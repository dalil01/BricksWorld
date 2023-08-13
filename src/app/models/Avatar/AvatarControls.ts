import {
	AnimationAction,
	AnimationClip,
	AnimationMixer,
	Clock,
	Group,
	LoopOnce,
	PerspectiveCamera, Quaternion,
	Vector3
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Experience } from "../../Experience";
import { Vars } from "../../../Vars";
import TWEEN from "@tweenjs/tween.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

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
	private runVelocity = 30;

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

	public constructor(model: Group, animations: AnimationClip[]) {
		this.avatar = model;
		this.animations = animations;
		this.animationMixer = new AnimationMixer(this.avatar);

		const experience = Experience.get();
		const cameraManager = experience.getCameraManager();

		this.clock = experience.getClock();
		this.camera = cameraManager.getCamera();
		this.controls = cameraManager.getControls();
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
			const velocity = this.walkAnimationPlaying ? this.walkVelocity : this.runVelocity;

			// Move avatar & camera
			const moveX = this.walkDirection.x * velocity * delta;
			const moveZ = this.walkDirection.z * velocity * delta;

			this.avatar.position.x += moveX;
			this.avatar.position.z += moveZ;


			this.updateCameraTarget(moveX, moveZ);
		}
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
		document.addEventListener("keydown", (ev) => this.onKeyDown(ev));
		document.addEventListener("keyup", (ev) => this.onKeyUp(ev));
		document.addEventListener("mousemove", (ev) => this.onMouseMove());
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

		(this.keysPressed as any)[ev.key.toUpperCase()] = true;

		if (this.jumpAnimation && ev.code === "Space") {
			this.playJumpAnimation();
		}

		if (!this.runAnimationPlaying && this.walkAnimationPlaying && ev.key === "Shift") {
			if (this.walkAnimationPlaying) {
				this.stopWalkAnimation();
			}

			this.playRunAnimation();
		} else if (!this.walkAnimationPlaying && (ev.key === 'z' || ev.key === 's')) {
			if (this.runAnimationPlaying) {
				this.stopRunAnimation();
			}

			this.playWalkAnimation();
		}

	}

	private onKeyUp(ev: KeyboardEvent): void {
		(this.keysPressed as any)[ev.key.toUpperCase()] = false

		if (this.runAnimationPlaying && ev.key === "Shift") {
			this.stopRunAnimation();
			this.playWalkAnimation();
		}

		if (this.walkAnimationPlaying && (ev.key === 'z' || ev.key === 's')) {
			this.stopWalkAnimation();
		}
	}

	private onMouseMove(): void {
		if (this.currentControls === CONTROLS.FIRST_PERSON && !this.walkAnimationPlaying && !this.runAnimationPlaying) {
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

			const p2 = new Vector3()
			this.firstPersonPoint.getWorldPosition(p2);

			this.camera.position.copy(p);
		}
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

		if (this.keysPressed['Z']) {
			if (this.keysPressed['Q']) {
				directionOffset = Math.PI / 4; // Z+Q
			} else if (this.keysPressed['D']) {
				directionOffset = -Math.PI / 4; // Z+D
			}
		} else if (this.keysPressed['S']) {
			if (this.keysPressed['Q']) {
				directionOffset = Math.PI / 4 + Math.PI / 2; // S+Q
			} else if (this.keysPressed['D']) {
				directionOffset = -Math.PI / 4 - Math.PI / 2; // S+D
			} else {
				directionOffset = Math.PI; // S
			}
		} else if (this.keysPressed['Q']) {
			directionOffset = Math.PI / 2; // Q
		} else if (this.keysPressed['D']) {
			directionOffset = -Math.PI / 2; // D
		}

		return directionOffset;
	}

	private updateCameraTarget(moveX: number, moveZ: number): void {
		this.camera.position.x += moveX;
		this.camera.position.z += moveZ;

		this.cameraTarget.x = this.avatar.position.x;
		this.cameraTarget.y = this.avatar.position.y + 3;
		this.cameraTarget.z = this.avatar.position.z;

		this.controls.target = this.cameraTarget;
		this.controls.enablePan = Vars.DEBUG_MODE;
		this.controls.rotateSpeed = 2

		this.controls.update();
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