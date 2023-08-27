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
	color?: string,
	hair?: {
		name: string,
		color?: string
	},
	brows?: {
		name: string,
		color?: string
	},
	eyes?: {
		name: string,
		color?: string
		irisColor?: string,
	},
	mouth?: {
		name: string,
		color?: string,
		teethColor?: string,
		tongueColor?: string
	},
	headExtra?: {
		name: string,
		color?: string
	},
	chest?: {
		name?: string,
		color?: string
		obj1Color?: string
		obj2Color?: string
	},
	legs?: {
		color: string
	}
}

export class Avatar extends Model {

	private data: AvatarData;

	private readonly avatarMaterial!: MeshStandardMaterial;

	private readonly hairs: Map<string, SkinnedMesh> = new Map();
	private currentHair: undefined | SkinnedMesh;
	private readonly hairMaterial!: MeshStandardMaterial;

	private readonly brows: Map<string, SkinnedMesh> = new Map();
	private currentBrows: undefined | SkinnedMesh;
	private readonly browsMaterial!: MeshStandardMaterial;

	private readonly eyes: Map<string, SkinnedMesh> = new Map();
	private currentEyes: undefined | SkinnedMesh;
	private readonly eyesMaterial!: MeshStandardMaterial;
	private readonly eyesIrisMaterial!: MeshStandardMaterial;

	private readonly mouths: Map<string, SkinnedMesh> = new Map();
	private currentMouth: undefined | SkinnedMesh;
	private readonly mouthMaterial!: MeshStandardMaterial;
	private readonly mouthTeethMaterial!: MeshStandardMaterial;
	private readonly mouthTongueMaterial!: MeshStandardMaterial;

	private readonly headExtras: Map<string, SkinnedMesh> = new Map();
	private currentHeadExtra: undefined | SkinnedMesh;
	private readonly headExtraMaterial!: MeshStandardMaterial;

	private readonly chestMaterial!: MeshStandardMaterial;
	private readonly chests: Map<string, SkinnedMesh> = new Map();
	private currentChest: undefined | SkinnedMesh;
	private readonly chestObj1Material!: MeshStandardMaterial;
	private readonly chestObj2Material!: MeshStandardMaterial;

	private readonly legsMaterial!: MeshStandardMaterial;

	private lights: AvatarLights;
	private controls!: AvatarControls;

	private viewManager!: ViewManager;

	private localStorageData!: avatarLocalStorageData;

	public constructor(data: AvatarData = new AvatarData()) {
		super();
		this.data = data;

		this.avatarMaterial = new MeshStandardMaterial({ color: new Color("#FFCF00")});
		this.hairMaterial = new MeshStandardMaterial({ color: new Color("#000000") });
		this.browsMaterial = new MeshStandardMaterial({ color: new Color("#000000") });
		this.eyesMaterial = new MeshStandardMaterial({ color: new Color("#000000") });
		this.eyesIrisMaterial = new MeshStandardMaterial({ color: new Color("#FFFFFF") });
		this.mouthMaterial = new MeshStandardMaterial({ color: new Color("#000000") });
		this.mouthTeethMaterial = new MeshStandardMaterial({ color: new Color("#FFFFFF") });
		this.mouthTongueMaterial = new MeshStandardMaterial({ color: new Color("#FF0000") });
		this.headExtraMaterial = new MeshStandardMaterial({ color: new Color("#000000") });
		this.chestMaterial = new MeshStandardMaterial({ color: this.avatarMaterial.color });
		this.chestObj1Material = new MeshStandardMaterial({ color: new Color("#000000") });
		this.chestObj2Material = new MeshStandardMaterial({ color: new Color("#D01012") });
		this.legsMaterial = new MeshStandardMaterial({ color: this.avatarMaterial.color });

		this.lights = new AvatarLights();
	}

	public override init(): void {
		this.viewManager = Experience.get().getViewManager();
	}

	public getColor(): string {
		return this.localStorageData?.color || '#' + this.avatarMaterial.color.getHexString();
	}

	public getHairColor(): string {
		return this.localStorageData?.hair?.color || '#' + this.hairMaterial.color.getHexString();
	}

	public getBrowsColor(): string {
		return this.localStorageData?.brows?.color || '#' + this.browsMaterial.color.getHexString();
	}

	public getEyesColor(): string {
		return this.localStorageData?.eyes?.color || '#' + this.eyesMaterial.color.getHexString();
	}

	public getEyesIrisColor(): string {
		return this.localStorageData?.eyes?.irisColor || '#' + this.eyesIrisMaterial.color.getHexString();
	}

	public getMouthColor(): string {
		return this.localStorageData?.mouth?.color || '#' + this.mouthMaterial.color.getHexString();
	}

	public getMouthTeethColor(): string {
		return this.localStorageData?.mouth?.teethColor || '#' + this.mouthTeethMaterial.color.getHexString();
	}

	public getMouthTongueColor(): string {
		return this.localStorageData?.mouth?.tongueColor || '#' + this.mouthTongueMaterial.color.getHexString();
	}

	public getHeadExtraColor(): string {
		return this.localStorageData?.headExtra?.color || '#' + this.headExtraMaterial.color.getHexString();
	}

	public getChestColor(): string {
		return this.localStorageData?.chest?.color || '#' + this.chestMaterial.color.getHexString();
	}

	public getChestObj1Color(): string {
		return this.localStorageData?.chest?.obj1Color || '#' + this.chestObj1Material.color.getHexString();
	}

	public getChestObj2Color(): string {
		return this.localStorageData?.chest?.obj2Color || '#' + this.chestObj2Material.color.getHexString();
	}

	public getLegsColor(): string {
		return this.localStorageData?.legs?.color || '#' + this.legsMaterial.color.getHexString();
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

				this.model.traverse((child) => {
					if (child.isSkinnedMesh && child.name.startsWith("Hair")) {
						this.hairs.set(child.name, child);
						child.visible = false;
						child.material = this.hairMaterial;
					} else if (child.name.startsWith("Brows")) {
						this.brows.set(child.name, child);
						child.visible = false;
						child.material = this.browsMaterial;
					} else if (child.name.startsWith("Eyes")) {
						this.eyes.set(child.name, child);
						child.visible = false;
						child.material = child.name.includes("Iris") ? this.eyesIrisMaterial : this.eyesMaterial;
					} else if (child.name.startsWith("Mouth")) {
						this.mouths.set(child.name, child);
						child.visible = false;
						if (child.name.includes("Teeth")) {
							child.material = this.mouthTeethMaterial;
						} else if (child.name.includes("Tongue")) {
							child.material = this.mouthTongueMaterial;
						} else {
							child.material = this.mouthMaterial;
						}
					} else if (child.name.startsWith("HeadExtra")) {
						this.headExtras.set(child.name, child);
						child.visible = false;
						child.material = this.headExtraMaterial;
					} else if (child.name.startsWith("Torso") || child.name.includes("Arm")) {
						child.material = this.chestMaterial;
					}  else if (child.name.startsWith("Hip") || child.name.includes("Leg")) {
						child.material = this.legsMaterial;
					} else if (child.name.startsWith("Chest")) {
						console.log(child.name)
						this.chests.set(child.name, child);
						child.visible = false;
						child.material = child.name.includes('_') ? this.chestObj2Material : this.chestObj1Material;
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

	public changeColor(color: string): void {
		this.avatarMaterial.color = new Color(color);
		this.localStorageData.color = color;
		this.updateDataInLocalStorage();
	}

	public addHair(name: string): void {
		const hair = this.hairs.get(name);
		if (!hair) {
			return;
		}

		if (this.currentHair) {
			this.currentHair.visible = false;
		}

		this.currentHair = hair;
		this.currentHair.visible = true;

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

	public addBrows(name: string): void {
		const brows = this.brows.get(name);
		if (!brows) {
			return;
		}

		if (this.currentBrows) {
			this.currentBrows.visible = false;
		}

		this.currentBrows = brows;
		this.currentBrows.visible = true;

		if (!this.localStorageData.brows) {
			this.localStorageData.brows = {
				name
			}
		} else {
			this.localStorageData.brows.name = name;
		}

		this.updateDataInLocalStorage();
	}

	public changeBrowsColor(color: string): void {
		this.browsMaterial.color = new Color(color);

		if (this.localStorageData.brows) {
			this.localStorageData.brows.color = color;
		}

		this.updateDataInLocalStorage();
	}

	public removeBrows(): void {
		if (this.currentBrows) {
			this.currentBrows.visible = false;
			this.currentBrows = undefined;
			this.localStorageData.brows = undefined;
			this.updateDataInLocalStorage();
		}
	}

	public addEyes(name: string): void {
		const eyes = this.eyes.get(name);
		if (!eyes) {
			return;
		}

		if (this.currentEyes) {
			this.currentEyes.visible = false;
			for (const child of this.currentEyes.children) {
				child.visible = false;
			}
		}

		this.currentEyes = eyes;
		this.currentEyes.visible = true;
		for (const child of this.currentEyes.children) {
			child.visible = true;
		}

		if (!this.localStorageData.eyes) {
			this.localStorageData.eyes = {
				name
			}
		} else {
			this.localStorageData.eyes.name = name;
		}

		this.updateDataInLocalStorage();
	}

	public changeEyesColor(color: string): void {
		this.eyesMaterial.color = new Color(color);

		if (this.localStorageData.eyes) {
			this.localStorageData.eyes.color = color;
		}

		this.updateDataInLocalStorage();
	}

	public changeEyesIrisColor(color: string): void {
		this.eyesIrisMaterial.color = new Color(color);

		if (this.localStorageData.eyes) {
			this.localStorageData.eyes.irisColor = color;
		}

		this.updateDataInLocalStorage();
	}

	public removeEyes(): void {
		if (this.currentEyes) {
			this.currentEyes.visible = false;
			this.currentEyes = undefined;
			this.localStorageData.eyes = undefined;
			this.updateDataInLocalStorage();
		}
	}

	public addMouth(name: string): void {
		const mouth = this.mouths.get(name);
		if (!mouth) {
			return;
		}

		if (this.currentMouth) {
			this.currentMouth.visible = false;
			for (const child of this.currentMouth.children) {
				child.visible = false;
			}
		}

		this.currentMouth = mouth;
		this.currentMouth.visible = true;
		for (const child of this.currentMouth.children) {
			child.visible = true;
		}

		if (!this.localStorageData.mouth) {
			this.localStorageData.mouth = {
				name
			}
		} else {
			this.localStorageData.mouth.name = name;
		}

		this.updateDataInLocalStorage();
	}

	public changeMouthColor(color: string): void {
		this.mouthMaterial.color = new Color(color);

		if (this.localStorageData.mouth) {
			this.localStorageData.mouth.color = color;
		}

		this.updateDataInLocalStorage();
	}

	public changeMouthTeethColor(color: string): void {
		this.mouthTeethMaterial.color = new Color(color);

		if (this.localStorageData.mouth) {
			this.localStorageData.mouth.teethColor = color;
		}

		this.updateDataInLocalStorage();
	}

	public changeMouthTongueColor(color: string): void {
		this.mouthTongueMaterial.color = new Color(color);

		if (this.localStorageData.mouth) {
			this.localStorageData.mouth.tongueColor = color;
		}

		this.updateDataInLocalStorage();
	}

	public removeMouth(): void {
		if (this.currentMouth) {
			this.currentMouth.visible = false;
			this.currentMouth = undefined;
			this.localStorageData.mouth = undefined;
			this.updateDataInLocalStorage();
		}
	}

	public addHeadExtra(name: string): void {
		const headExtra = this.headExtras.get(name);
		if (!headExtra) {
			return;
		}

		if (this.currentHeadExtra) {
			this.currentHeadExtra.visible = false;
		}

		this.currentHeadExtra = headExtra;
		this.currentHeadExtra.visible = true;

		if (!this.localStorageData.headExtra) {
			this.localStorageData.headExtra = {
				name
			};
		} else {
			this.localStorageData.headExtra.name = name;
		}

		this.updateDataInLocalStorage();
	}

	public changeHeadExtraColor(color: string): void {
		this.headExtraMaterial.color = new Color(color);

		if (this.localStorageData.headExtra) {
			this.localStorageData.headExtra.color = color;
		}

		this.updateDataInLocalStorage();
	}

	public removeHeadExtra(): void {
		if (this.currentHeadExtra) {
			this.currentHeadExtra.visible = false;
			this.currentHeadExtra = undefined;
			this.localStorageData.headExtra = undefined;
			this.updateDataInLocalStorage();
		}
	}

	public addChest(name: string): void {
		const chest = this.chests.get(name);
		if (!chest) {
			return;
		}

		if (this.currentChest) {
			this.currentChest.visible = false;
			for (const child of this.currentChest.children) {
				child.visible = false;
			}
		}

		this.currentChest = chest;
		this.currentChest.visible = true;
		for (const child of this.currentChest.children) {
			child.visible = true;
		}

		if (!this.localStorageData.chest) {
			this.localStorageData.chest = {
				name
			};
		} else {
			this.localStorageData.chest.name = name;
		}

		this.updateDataInLocalStorage();
	}

	public changeChestColor(color: string): void {
		this.chestMaterial.color = new Color(color);

		if (!this.localStorageData.chest) {
			this.localStorageData.chest = {
				color
			};
		} else {
			this.localStorageData.chest.color = color;
		}

		this.updateDataInLocalStorage();
	}

	public changeChestObj1Color(color: string): void {
		this.chestObj1Material.color = new Color(color);

		if (!this.localStorageData.chest) {
			this.localStorageData.chest = {
				obj1Color: color
			};
		} else {
			this.localStorageData.chest.obj1Color = color;
		}

		this.updateDataInLocalStorage();
	}

	public changeChestObj2Color(color: string): void {
		this.chestObj2Material.color = new Color(color);

		if (!this.localStorageData.chest) {
			this.localStorageData.chest = {
				obj2Color: color
			};
		} else {
			this.localStorageData.chest.obj2Color = color;
		}

		this.updateDataInLocalStorage();
	}

	public removeChest(): void {
		if (this.currentChest) {
			this.currentChest.visible = false;
			this.currentChest = undefined;
			if (this.localStorageData.chest) {
				this.localStorageData.chest.name = undefined;
			}
			this.updateDataInLocalStorage();
		}
	}

	public changeLegsColor(color: string): void {
		this.legsMaterial.color = new Color(color);

		if (!this.localStorageData.legs) {
			this.localStorageData.legs = {
				color
			};
		} else {
			this.localStorageData.legs.color = color;
		}

		this.updateDataInLocalStorage();
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

		if (this.localStorageData.brows) {
			this.addBrows(this.localStorageData.brows?.name || '');
			this.changeBrowsColor(this.localStorageData.brows?.color || '');
		}

		if (this.localStorageData.eyes) {
			this.addEyes(this.localStorageData.eyes?.name || '');
			this.changeEyesColor(this.localStorageData.eyes?.color || '');
			this.changeEyesIrisColor(this.localStorageData.eyes?.irisColor || '');
		}

		if (this.localStorageData.mouth) {
			this.addMouth(this.localStorageData.mouth?.name || '');
			this.changeMouthColor(this.localStorageData.mouth?.color || '');
			this.changeMouthTeethColor(this.localStorageData.mouth?.teethColor || '');
			this.changeMouthTongueColor(this.localStorageData.mouth?.tongueColor || '');
		}

		if (this.localStorageData.headExtra) {
			this.addHeadExtra(this.localStorageData.headExtra?.name || '');
			this.changeHeadExtraColor(this.localStorageData.headExtra?.color || '');
		}

		if (this.localStorageData.chest) {
			this.addChest(this.localStorageData.chest?.name || '');
			this.changeChestColor(this.localStorageData.chest?.color || '');
			this.changeChestObj1Color(this.localStorageData.chest?.obj1Color || '');
			this.changeChestObj2Color(this.localStorageData.chest?.obj2Color || '');
		}

		if (this.localStorageData.legs) {
			this.changeLegsColor(this.localStorageData.legs?.color || '');
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