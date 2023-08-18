import { Color, Scene } from "three";
import { Model } from "../Model";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Experience } from "../../Experience";
import { SeaData } from "./SeaData";

export class Sea extends Model {

	private data: SeaData;

	public constructor(data: SeaData = new SeaData()) {
		super();
		this.data = data;
	}

	public override init(): void {
	}

	public setData(data: SeaData): void {
		this.data = data;
	}

	public override load(scene: Scene): Promise<void> {
		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(Vars.PATH.SEA.MODEL, (gltf: GLTF) => {
				this.model = gltf.scene;

				scene.add(this.model);

				this.applyMaterialColor();
				this.generateGridClones();

				if (Vars.DEBUG_MODE) {
					this.initHelpers();
				}

				resolve();
			}, undefined, () => reject());
		});
	}

	public animate(): void {
	}

	public update(): void {
	}

	public applyMaterialColor(): void {
		const color = new Color(this.data.color);
		this.model.traverse((child) => {
			if (child.material) {
				child.material.color = color;
			}
		});
	}

	public generateGridClones(): void {
		const n = this.data.size;
		const middleModel = this.model.clone();
		const baseSpacing = 10;

		let totalClones = 0;

		for (let x = -n; x <= n; x++) {
			for (let z = -n; z <= n; z++) {
				if (x === 0 && z === 0) {
					continue;
				}

				const xOffset = x * baseSpacing;
				const zOffset = z * baseSpacing;

				const clonedModel = middleModel.clone();
				clonedModel.position.set(xOffset, 0, zOffset);
				this.model.add(clonedModel);

				totalClones++;
			}
		}

		if (Vars.DEBUG_MODE) {
			console.log(`Sea - Total clones generated: ${ totalClones }`);
		}
	}

	private clearGeneratedClones(): void {
		const realMesh = this.model.children.find((child) => child.name === "Sea");
		this.model.children.length = 0;
		this.model.add(realMesh);
	}

	private initHelpers(): void {
		const GUIFolder = Experience.get().getLilGUI().addFolder("Sea");
		GUIFolder.add(this.data, "size", 1, 100, 1).onChange(() => {
			this.clearGeneratedClones();
			this.generateGridClones();
		});

		GUIFolder.addColor(this.data, "color").onChange((value) => {
			this.applyMaterialColor();
		});
	}

}