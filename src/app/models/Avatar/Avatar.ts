import { Model } from "../Model";
import { Color, Group, MeshStandardMaterial, Scene } from "three";
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

const avatarLocalStorageDataKey = "avatar_data";

type avatarLocalStorageData = {
	hair?: {
		id: number,
		color?: string
	}
}

export class Avatar extends Model {

	private data: AvatarData;

	private lights: AvatarLights;
	private controls!: AvatarControls;

	private viewManager!: ViewManager;

	private localStorageData!: avatarLocalStorageData;

	private hair: any;
	private hairPath: undefined | string;

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

				this.initDataFromLocalStorage().then(() => {
					resolve();
				});
			}, undefined, () => reject());
		});
	}

	public async loadHair(id: number, path: string): Promise<void> {
		if (this.hair) {
			if (this.hairPath === path) {
				return;
			}

			this.model.remove(this.hair);
		}

		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(path, (gltf: GLTF) => {
				this.hair = gltf.scene;
				this.hairPath = path;

				const material = new MeshStandardMaterial();
				this.hair.traverse((node) => {
					if (node.isMesh) {
						node.material = material;
					}
				});

				this.model.add(this.hair);

				if (!this.localStorageData.hair) {
					this.localStorageData.hair = {
						id
					}
				}

				this.localStorageData.hair.id = id;

				this.updateDataInLocalStorage();

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

			if (this.localStorageData.hair) {
				this.localStorageData.hair.color = color;
			}

			this.updateDataInLocalStorage();
		}
	}

	public removeHair(): void {
		if (this.hair) {
			this.model.remove(this.hair);
			this.hair = undefined;
			this.hairPath = undefined;
			this.localStorageData.hair = undefined;

			this.updateDataInLocalStorage();
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

	private async initDataFromLocalStorage(): Promise<void> {
		this.localStorageData = JSON.parse(localStorage.getItem(avatarLocalStorageDataKey) || '{}');

		if (this.hair) {
			this.model.add(this.hair);
		} else {
			const hairData = this.localStorageData?.hair;
			if (hairData) {
				await this.loadHair(hairData.id, Vars.PATH.AVATAR.HAIRS[hairData.id]?.MODEL).then(() => {
					if (hairData?.color) {
						this.changeHairColor(hairData.color);
					}
				});
			}
		}
	}

	private updateDataInLocalStorage(): void {
		if (!this.localStorageData) {
			localStorage.setItem(avatarLocalStorageDataKey, JSON.stringify("{}"));
			return;
		}

		localStorage.setItem(avatarLocalStorageDataKey, JSON.stringify(this.localStorageData));
	}

}