import { Model } from "../Model";
import { Color, MeshStandardMaterial, Scene } from "three";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AvatarControls } from "./AvatarControls";
import { Experience } from "../../Experience";
import { AvatarLights } from "./AvatarLights";
import { ViewManager } from "../../managers/all/ViewManager";
import { WorldName } from "../World/World";
import { PalmIsland } from "../World/all/PalmIsland";
import { AvatarData } from "./AvatarData";

export class Avatar extends Model {

	private data: AvatarData;

	private lights: AvatarLights;
	private controls!: AvatarControls;

	private viewManager!: ViewManager;

	private hair;

	public constructor(data: AvatarData = new AvatarData()) {
		super();
		this.data = data;
		this.lights = new AvatarLights();
	}

	public override init(): void {
		this.viewManager = Experience.get().getViewManager();
	}

	public override load(scene: Scene): Promise<void> {
		switch (Vars.CURRENT_WORLD) {
			case WorldName.PALM_ISLAND:
				this.data = PalmIsland.getAvatarConfig();
				break;
		}

		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(Vars.PATH.AVATAR.MODEL, (gltf: GLTF) => {
				this.model = gltf.scene;

				scene.add(gltf.scene);

				const firstPersonPoint = this.model.children.find((child) => child.name === "FirstPersonPoint");
				if (firstPersonPoint) {
					const transparentMaterial = new MeshStandardMaterial({
						color: new Color("white"),
						transparent: true,
						opacity: 0,
					});

					if (firstPersonPoint.isMesh) {
						firstPersonPoint.material = transparentMaterial;
					}

					//scene.remove(firstPersonPoint)
				}

				const physics = Experience.get().getPhysicsManager();
				const rapier = physics.getRapier();
				const world = physics.getWorld();

				const bodyDesc = rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(this.data.defaultTranslation.x, this.data.defaultTranslation.y, this.data.defaultTranslation.z);
				const rigidBody = world.createRigidBody(bodyDesc);
				const dynamicCollider = rapier.ColliderDesc.ball(this.data.rigidBodyRadius);
				world.createCollider(dynamicCollider, rigidBody.handle);

				this.controls = new AvatarControls(this.model, rigidBody, this.data, gltf.animations);

				this.lights.init(scene);
				this.controls.init();

				resolve();
			}, undefined, () => reject());
		});
	}

	public async loadHair(path: string): Promise<void> {
		if (this.hair) {
			this.model.remove(this.hair);
		}

		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(path, (gltf: GLTF) => {
				this.hair = gltf.scene;

				const material = new MeshStandardMaterial();
				this.hair.traverse((node) => {
					if (node.isMesh) {
						node.material = material;
					}
				});

				this.model.add(this.hair);

				resolve();
			});
		});
	}

	public changeHairColor(color: string): void {
		if (this.hair) {
			const newHairColor = new Color(color);
			this.hair.traverse((node) => {
				if (node.isMesh) {
					node.material.color = newHairColor;
				}
			});
		}
	}

	public override update(): void {
		this.controls?.update();
	}

	public override animate(): void {
		if (this.viewManager?.isWorldView()) {
			this.controls?.animate();
		}
	}

	public moveCameraToModelsView(): void {
		this.controls.moveCameraToModelsView();
	}

	public moveCameraToHeadView(): void {
		this.controls.moveCameraToHeadView();
	}

	public moveCameraToChestView(): void {
		this.controls.moveCameraToChestView();
	}

	public moveCameraToLegsView(): void {
		this.controls.moveCameraToLegsView();
	}

	public moveCameraToDefaultWorldView(): void {
		this.controls.moveCameraToDefaultWorldView();
	}

}