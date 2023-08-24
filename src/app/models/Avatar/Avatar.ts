import { Model } from "../Model";
import { Color, Group, MeshStandardMaterial, Scene, SkinnedMesh } from "three";
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
		name: string,
		color?: string
	}
}

export class Avatar extends Model {

	private data: AvatarData;

	private avatarMaterial!: MeshStandardMaterial;

	private hairs: Map<string, SkinnedMesh> = new Map();
	private currentHair: undefined | SkinnedMesh;
	private hairMaterial!: MeshStandardMaterial;

	private lights: AvatarLights;
	private controls!: AvatarControls;

	private viewManager!: ViewManager;

	private localStorageData!: avatarLocalStorageData;

	public constructor(data: AvatarData = new AvatarData()) {
		super();
		this.data = data;
		this.lights = new AvatarLights();
	}

	public override init(): void {
		this.viewManager = Experience.get().getViewManager();
	}

	public getHairColor(): undefined | string {
		return this.localStorageData?.hair?.color;
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

				this.avatarMaterial = new MeshStandardMaterial();
				this.avatarMaterial.color = new Color("#FFCF00")

				this.hairMaterial = new MeshStandardMaterial();

				this.model.traverse((child) => {
					if (child.isSkinnedMesh && child.name.startsWith("Hair")) {
						this.hairs.set(child.name, child);
						child.visible = false;
						child.material = this.hairMaterial;
					} else if (child.name.startsWith("FirstPersonPoint")) {
						child.visible = false;
					} else {
						child.material = this.avatarMaterial;
					}
				});


				scene.add(gltf.scene);

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

				this.initDataFromLocalStorage();

				resolve();
			}, undefined, () => reject());
		});
	}

	public addHair(name: string): void {
		const hair = this.hairs.get(name);
		if (!hair) {
			return;
		}

		hair.visible = true;

		if (!this.localStorageData.hair) {
			this.localStorageData.hair = {
				name
			}
		} else {
			this.localStorageData.hair.name = name;
		}

		this.updateDataInLocalStorage();
	}

	public changeHairColor(color: string): void {
		this.hairMaterial.color = new Color(color);

		if (this.localStorageData.hair) {
			this.localStorageData.hair.color = color;
		}

		this.updateDataInLocalStorage();
	}

	public removeHair(): void {
		if (this.currentHair) {
			this.currentHair.visible = false;
			this.currentHair = undefined;
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

	private initDataFromLocalStorage(): void {
		this.localStorageData = JSON.parse(localStorage.getItem(avatarLocalStorageDataKey) || '{}');
		if (this.localStorageData.hair) {
			this.addHair(this.localStorageData.hair?.name || '');
			this.changeHairColor(this.localStorageData.hair?.color || '');
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