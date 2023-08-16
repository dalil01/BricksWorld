import {
	AnimationAction,
	AnimationClip,
	AnimationMixer,
	Clock,
	Group,
	LoopOnce,
	PerspectiveCamera,
	Quaternion,
	Vector3
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Experience } from "../../Experience";
import { Vars } from "../../../Vars";
import TWEEN from "@tweenjs/tween.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { EventType } from "../../managers/all/EventManager";
import { Ray, RigidBody, Vector, World } from '@dimforge/rapier3d';
import { COLLISION_GROUP, PhysicsManager } from "../../managers/all/PhysicsManager";

enum CONTROLS {
	THIRD_PERSON,
	FIRST_PERSON,
	SCENE
}

export class AvatarControls {

	private readonly avatar: Group;

	private readonly camera: PerspectiveCamera;
	private readonly controls: OrbitControls;

	private readonly animations: AnimationClip[];
	private animationMixer: AnimationMixer;

	private walkAnimation!: AnimationAction;
	private walkAnimationPlaying: boolean = false;
	private walkVelocity = 10;

	private runAnimation!: AnimationAction;
	private runAnimationPlaying: boolean = false;
	private runVelocity = 20;

	private jumpAnimation!: AnimationAction;

	private keysPressed = {};

	private walkDirection = new Vector3();
	private rotateAngle = new Vector3(0, 1, 0);
	private rotateQuaternion = new Quaternion();
	private cameraTarget = new Vector3();

	private clock: Clock;

	private currentControls: CONTROLS = CONTROLS.THIRD_PERSON;

	private firstPersonPoint;
	private firstPersonControls!: PointerLockControls;

	// Physics
	private readonly rigidBody: RigidBody;
	private readonly rigidBodyRadius: number;
	private readonly world: World;

	private storedFall = 0;

	private readonly rayYB: Ray;
	private readonly rayXL: Ray;
	private readonly rayXR: Ray;
	private readonly rayZL: Ray;
	private readonly rayZR: Ray;

	private validatedTranslation!: Vector;

	public constructor(model: Group, rigidBody: RigidBody, rigidBodyRadius: number, animations: AnimationClip[]) {
		this.avatar = model;
		this.animations = animations;
		this.animationMixer = new AnimationMixer(this.avatar);

		const experience = Experience.get();
		const cameraManager = experience.getCameraManager();

		this.clock = experience.getClock();
		this.camera = cameraManager.getCamera();
		this.controls = cameraManager.getControls();

		this.rigidBody = rigidBody;
		this.rigidBodyRadius = rigidBodyRadius;
		this.world = Experience.get().getPhysicsManager().getWorld();

		this.rayYB = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: -1, z: 0 });
		this.rayXL = new Ray({ x: 0, y: 0, z: 0 }, { x: -1, y: 0, z: 0 });
		this.rayXR = new Ray({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
		this.rayZL = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: -1 });
		this.rayZR = new Ray({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });
	}

	public init(): void {
		for (let i = 0; i < this.animations.length; i++) {
			const animationClip = this.animations[i];
			const clipAction = this.animationMixer.clipAction(animationClip);

			let name = animationClip.name;
			if (name === "AvatarWalking") {
				this.walkAnimation = clipAction;
			} else if (name === "AvatarRunning") {
				this.runAnimation = clipAction;
			} else if (name === "AvatarJumping") {
				this.jumpAnimation = clipAction;
				this.jumpAnimation.loop = LoopOnce;
				this.jumpAnimation.clampWhenFinished = true;
			}
		}

		this.firstPersonPoint = this.avatar.children.find((child) => child.name == "FirstPersonPoint")

		this.firstPersonControls = new PointerLockControls(Experience.get().getCameraManager().getCamera(), document.body);
		this.firstPersonControls.minPolarAngle = .3;
		this.firstPersonControls.maxPolarAngle = 3;
		this.firstPersonControls.addEventListener("unlock", () => {
			this.switchToThirdPersonControls();
		});

		Experience.get().getScene().add(this.firstPersonControls.getObject());

		if (Vars.DEBUG_MODE) {
			this.initHelpers();
		}
	}

	public update(): void {
		const viewManager = Experience.get().getViewManager();
		if (!viewManager.isStartMenuView()) {
			return;
		}

		this.controls.enableDamping = true;
		this.controls.enablePan = true;
		this.controls.panSpeed = 1;
		this.controls.enableZoom = true;
		this.controls.zoomSpeed = 3;
		this.controls.minDistance = 5;
		this.controls.maxDistance = 20;
		this.controls.enableRotate = true;
		this.controls.maxPolarAngle = Math.PI / 2.42;

		if (viewManager.isStartMenuMinView()) {
			this.camera.position.set(0, 5, -15);
			this.controls.target.set(0, -1, 0);
		} else {
			this.camera.position.set(0, 5, -8);
			this.controls.target.set(0, 2, 0);
		}

		this.controls.update();
	}

	public animate(): void {
		const delta = this.clock.getDelta();

		this.animationMixer.update(delta);
		this.walkDirection.x = this.walkDirection.y = this.walkDirection.z = 0

		let velocity = 0;
		if (this.walkAnimationPlaying || this.runAnimationPlaying) {
			if (this.currentControls === CONTROLS.FIRST_PERSON) {
				const p = new Vector3();
				this.firstPersonPoint.getWorldPosition(p);

				const cameraDirection = new Vector3();
				this.camera.getWorldDirection(cameraDirection);

				// Calculer l'angle de rotation pour faire tourner l'objet vers l'arrière de la caméra
				const angle = Math.atan2(-cameraDirection.x, -cameraDirection.z);

				const directionOffset = this.findDirectionOffset();

				// Rotate avatar
				this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, angle + directionOffset);
				this.avatar.quaternion.rotateTowards(this.rotateQuaternion, 0.5);


				// Calculate Direction
				this.camera.getWorldDirection(this.walkDirection);
				this.walkDirection.y = 0;
				this.walkDirection.normalize();
				this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);


				// Run/Walk velocity
				const velocity = this.walkAnimationPlaying ? this.walkVelocity : this.runVelocity;

				// Move avatar & camera
				const moveX = this.walkDirection.x * velocity * delta;
				const moveZ = this.walkDirection.z * velocity * delta;

				this.avatar.position.x += moveX;
				this.avatar.position.z += moveZ;

				const p2 = new Vector3()
				this.firstPersonPoint.getWorldPosition(p2);

				this.camera.position.copy(p);

				return
			}

			let angleYCameraDirect = Math.atan2(
				(this.camera.position.x - this.avatar.position.x),
				(this.camera.position.z - this.avatar.position.z)
			);

			// Diagonal movement angle offset
			const directionOffset = this.findDirectionOffset();

			// Rotate avatar
			this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, angleYCameraDirect + directionOffset);
			this.avatar.quaternion.rotateTowards(this.rotateQuaternion, 0.5);

			// Calculate Direction
			this.camera.getWorldDirection(this.walkDirection);
			this.walkDirection.y = 0;
			this.walkDirection.normalize();
			this.walkDirection.applyAxisAngle(this.rotateAngle, directionOffset);

			// Run/Walk velocity
			velocity = this.walkAnimationPlaying ? this.walkVelocity : this.runVelocity;
			//const velocity = this.walkAnimationPlaying ? this.walkVelocity : this.runVelocity;

			// Move avatar & camera
			const moveX = this.walkDirection.x * velocity * delta;
			const moveZ = this.walkDirection.z * velocity * delta;

			//this.avatar.position.x += moveX;
			//this.avatar.position.z += moveZ;


			//this.updateCameraTarget(moveX, moveZ);
		}

		const translation = this.rigidBody.translation();
		if (translation.y < -3) {
			// Don't fall below ground
			this.rigidBody.setNextKinematicTranslation({
				x: 0,
				y: 10,
				z: 0
			});
		} else {
			const cameraPositionOffset = this.camera.position.sub(this.avatar.position);

			// Update model and camera
			this.avatar.position.x = translation.x;
			this.avatar.position.y = translation.y;
			this.avatar.position.z = translation.z;

			this.updateCameraTarget(cameraPositionOffset);

			this.walkDirection.y += this.lerp(this.storedFall, -9.81 * delta, 0.10);
			this.storedFall = this.walkDirection.y;

			this.rayYB.origin.x = translation.x;
			this.rayYB.origin.y = translation.y;
			this.rayYB.origin.z = translation.z;

			let hitYB = this.world.castRay(this.rayYB, 0.5, false, COLLISION_GROUP.ALL);
			if (hitYB) {
				const point = this.rayYB.pointAt(hitYB.toi);
				let diff = translation.y - (point.y + this.rigidBodyRadius);
				if (diff < 0.0) {
					this.storedFall = 0;
					this.walkDirection.y = this.lerp(0, Math.abs(diff), 0.5)
				}
			}

			const canMove = !this.hasObstacleCollisions(translation);
			if (canMove) {
				this.walkDirection.x *= velocity * delta;
				this.walkDirection.z *= velocity * delta;

				this.rigidBody.setNextKinematicTranslation({
					x: translation.x + this.walkDirection.x,
					y: translation.y + this.walkDirection.y,
					z: translation.z + this.walkDirection.z
				});

				this.validatedTranslation = translation;
			} else {
				this.rigidBody.setNextKinematicTranslation(this.validatedTranslation);
			}
		}
	}

	private hasObstacleCollisions(translation: Vector): boolean {
		this.rayXL.origin.x = translation.x;
		this.rayXL.origin.y = translation.y;
		this.rayXL.origin.z = translation.z;

		this.rayXR.origin.x = translation.x;
		this.rayXR.origin.y = translation.y;
		this.rayXR.origin.z = translation.z;

		this.rayZL.origin.x = translation.x;
		this.rayZL.origin.y = translation.y;
		this.rayZL.origin.z = translation.z;

		this.rayZR.origin.x = translation.x;
		this.rayZR.origin.y = translation.y;
		this.rayZR.origin.z = translation.z;

		let canMove = false;

		let hitXL = this.world.castRay(this.rayXR, 0.5, false, COLLISION_GROUP.ALL);
		if (hitXL && this.world.getCollider(hitXL.colliderHandle).collisionGroups() === COLLISION_GROUP.HIDDEN_FENCE) {
			console.log("hitXL")

			const point = this.rayXL.pointAt(hitXL.toi);
			let diffX = translation.x - (point.x + this.rigidBodyRadius);
			if (diffX < 0.0) {
				canMove = true;
			}
		}

		let hitXR = this.world.castRay(this.rayXR, 0.5, false, COLLISION_GROUP.ALL);
		if (hitXR && this.world.getCollider(hitXR.colliderHandle).collisionGroups() === COLLISION_GROUP.HIDDEN_FENCE) {
			const point = this.rayXR.pointAt(hitXR.toi);
			let diffX = translation.x - (point.x - this.rigidBodyRadius);
			if (diffX > 0.0) {
				canMove = true;
			}
		}

		let hitZL = this.world.castRay(this.rayZL, 0.5, false, COLLISION_GROUP.ALL);
		if (hitZL && this.world.getCollider(hitZL.colliderHandle).collisionGroups() === COLLISION_GROUP.HIDDEN_FENCE) {
			const point = this.rayZL.pointAt(hitZL.toi);
			let diffZ = translation.z - (point.z + this.rigidBodyRadius);
			if (diffZ < 0.0) {
				canMove = true;
			}
		}

		let hitZR = this.world.castRay(this.rayZR, 0.5, false, COLLISION_GROUP.ALL);
		if (hitZR && this.world.getCollider(hitZR.colliderHandle).collisionGroups() === COLLISION_GROUP.HIDDEN_FENCE) {
			const point = this.rayZR.pointAt(hitZR.toi);
			let diffZ = translation.z - (point.z - this.rigidBodyRadius);
			if (diffZ > 0.0) {
				canMove = true;
			}
		}

		return canMove;
	}

	public moveCameraToDefaultWorldView(): void {
		/*
		const targetCameraPosition = new Vector3();
		targetCameraPosition.x = -7;
		targetCameraPosition.y = 7;
		targetCameraPosition.z = 15;


		 */
		const targetCameraPosition = new Vector3();
		targetCameraPosition.x = this.avatar.position.x - 5;
		targetCameraPosition.y = this.avatar.position.y + 10;
		targetCameraPosition.z = this.avatar.position.z + 10;

		new TWEEN.Tween(this.camera.position)
			.to(targetCameraPosition, 1500)
			.start();

		const targetControlsPosition = new Vector3();
		targetControlsPosition.x = this.avatar.position.x;
		targetControlsPosition.y = this.avatar.position.y + 3;
		targetControlsPosition.z = this.avatar.position.z;

		new TWEEN.Tween(this.controls.target)
			.to(targetControlsPosition, 1500)
			.onUpdate(() => this.controls.update())
			.start()
			.onComplete(() => {
				this.subscribeToEventListeners();
			})
		;
	}

	private subscribeToEventListeners(): void {
		const eventManager = Experience.get().getEventManager();
		eventManager.pushCallback(EventType.KEYDOWN, (ev) => this.onKeyDown(ev));
		eventManager.pushCallback(EventType.KEYUP, (ev) => this.onKeyUp(ev));
		eventManager.pushCallback(EventType.MOUSEMOVE, () => this.onMouseMove());

		/*
			document.addEventListener("keydown", (ev) => this.onKeyDown(ev));
			document.addEventListener("keyup", (ev) => this.onKeyUp(ev));
			document.addEventListener("mousemove", (ev) => this.onMouseMove());
		*/
	}

	private onKeyDown(ev: KeyboardEvent): void {
		if (ev.key === '1') {
			this.switchToFirstPersonControl();
		} else if (ev.key === '2') {
			this.switchToThirdPersonControls();
		} else if (ev.key === '3') {
			this.switchToSceneControls();
		}

		if (this.currentControls === CONTROLS.SCENE) {
			return;
		}

		(this.keysPressed as any)[ev.key] = true;

		if (this.jumpAnimation && ev.code === "Space") {
			this.playJumpAnimation();
		}

		if (!this.runAnimationPlaying && this.walkAnimationPlaying && ev.key === "Shift") {
			if (this.walkAnimationPlaying) {
				this.stopWalkAnimation();
			}

			this.playRunAnimation();
		} else if (!this.walkAnimationPlaying && this.isMoveKey(ev.key)) {
			if (this.runAnimationPlaying) {
				this.stopRunAnimation();
			}

			this.playWalkAnimation();
		}
	}

	private onKeyUp(ev: KeyboardEvent): void {
		(this.keysPressed as any)[ev.key] = false;

		if (this.runAnimationPlaying && ev.key === "Shift") {
			this.stopRunAnimation();
			this.playWalkAnimation();
		}

		if (this.walkAnimationPlaying && !this.isMovingKeyPressed()) {
			this.stopWalkAnimation();
		}
	}

	private onMouseMove(): void {
		if (this.currentControls === CONTROLS.FIRST_PERSON && !this.walkAnimationPlaying && !this.runAnimationPlaying) {
			const firstPersonPosition = new Vector3();
			this.firstPersonPoint.getWorldPosition(firstPersonPosition);

			const cameraDirection = new Vector3();
			this.camera.getWorldDirection(cameraDirection);

			// Calculer l'angle de rotation pour faire tourner l'objet vers l'arrière de la caméra
			const angle = Math.atan2(-cameraDirection.x, -cameraDirection.z);

			const directionOffset = this.findDirectionOffset();

			// Rotate avatar
			this.rotateQuaternion.setFromAxisAngle(this.rotateAngle, angle + directionOffset);
			this.avatar.quaternion.rotateTowards(this.rotateQuaternion, 0.5);

			const p2 = new Vector3()
			this.firstPersonPoint.getWorldPosition(p2);

			this.camera.position.copy(firstPersonPosition);
		}
	}

	private isMoveKey(key: string): boolean {
		return key === 'z' || key === 'q' || key === 's' || key === 'd';
	}

	private isMovingKeyPressed(): boolean {
		return this.keysPressed['z'] || this.keysPressed['q'] || this.keysPressed['s'] || this.keysPressed['d'];
	}

	private playWalkAnimation(): void {
		this.walkAnimation.play();
		this.walkAnimationPlaying = true;
	}

	private stopWalkAnimation(): void {
		this.walkAnimation.stop();
		this.walkAnimationPlaying = false;
	}

	private playRunAnimation(): void {
		this.runAnimation.play();
		this.runAnimationPlaying = true;
	}

	private stopRunAnimation(): void {
		this.runAnimation.stop();
		this.runAnimationPlaying = false;
	}

	private playJumpAnimation(): void {
		this.jumpAnimation.play();
		this.jumpAnimation.reset();
	}

	private findDirectionOffset(): number {
		let directionOffset = 0; // Z

		if (this.keysPressed['z']) {
			if (this.keysPressed['q']) {
				directionOffset = Math.PI / 4; // Z+Q
			} else if (this.keysPressed['d']) {
				directionOffset = -Math.PI / 4; // Z+D
			}
		} else if (this.keysPressed['s']) {
			if (this.keysPressed['q']) {
				directionOffset = Math.PI / 4 + Math.PI / 2; // S+Q
			} else if (this.keysPressed['d']) {
				directionOffset = -Math.PI / 4 - Math.PI / 2; // S+D
			} else {
				directionOffset = Math.PI; // S
			}
		} else if (this.keysPressed['q']) {
			directionOffset = Math.PI / 2; // Q
		} else if (this.keysPressed['d']) {
			directionOffset = -Math.PI / 2; // D
		}

		return directionOffset;
	}

	private lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;

	private updateCameraTarget(offset: Vector3) {
		const rigidTranslation = this.rigidBody.translation();
		this.camera.position.x = rigidTranslation.x + offset.x;
		this.camera.position.y = rigidTranslation.y + offset.y;
		this.camera.position.z = rigidTranslation.z + offset.z;

		this.cameraTarget.x = rigidTranslation.x;
		this.cameraTarget.y = rigidTranslation.y + 1;
		this.cameraTarget.z = rigidTranslation.z;
		this.controls.target = this.cameraTarget;

		/* TODO
		this.controls.target = this.cameraTarget;
		this.controls.enablePan = Vars.DEBUG_MODE;
		this.controls.rotateSpeed = 2
		this.controls.update();
		 */
	}

	private switchToThirdPersonControls(): void {
		if (this.currentControls === CONTROLS.FIRST_PERSON) {
			this.firstPersonControls.unlock();
		}

		const targetCameraPosition = new Vector3();
		targetCameraPosition.x = this.avatar.position.x;
		targetCameraPosition.y = this.avatar.position.y + 7;
		targetCameraPosition.z = this.avatar.position.z + 10;

		this.camera.position.copy(targetCameraPosition)

		const targetControlsPosition = new Vector3();
		targetControlsPosition.x = this.avatar.position.x;
		targetControlsPosition.y = this.avatar.position.y + 3;
		targetControlsPosition.z = this.avatar.position.z;

		this.controls.target.copy(targetControlsPosition);
		this.controls.update();

		this.currentControls = CONTROLS.THIRD_PERSON;
	}

	private switchToFirstPersonControl(): void {
		const p = new Vector3();
		this.firstPersonPoint.getWorldPosition(p)

		this.camera.position.copy(p);

		this.firstPersonControls.lock();

		this.currentControls = CONTROLS.FIRST_PERSON;
	}

	private switchToSceneControls(): void {
		// TODO : refacto - it's not that avatar responsibility

		if (this.currentControls === CONTROLS.FIRST_PERSON) {
			this.firstPersonControls.unlock();
		}

		const scene = Experience.get().getScene();

		const targetCameraPosition = new Vector3();
		targetCameraPosition.x = scene.position.x - 50;
		targetCameraPosition.y = scene.position.y + 30;
		targetCameraPosition.z = scene.position.z - 40;

		this.camera.position.copy(targetCameraPosition)

		const targetControlsPosition = new Vector3();
		targetControlsPosition.x = scene.position.x;
		targetControlsPosition.y = scene.position.y + 3;
		targetControlsPosition.z = scene.position.z;

		this.controls.target.copy(targetControlsPosition);
		this.controls.update();

		this.currentControls = CONTROLS.SCENE;
	}

	private initHelpers(): void {
		// TODO
	}

}