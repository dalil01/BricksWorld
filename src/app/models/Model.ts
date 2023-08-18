import { Group, Mesh, Object3D, Scene } from "three";
import { Sizes } from "../Experience";

export abstract class Model {

	protected model!: any;

	protected constructor() {
	}

	protected autoSetMeshShadow(mesh: Mesh): void {
		mesh.castShadow = true;
		mesh.receiveShadow = true;
	}

	public getModel(): Object3D {
		return this.model;
	}

	public abstract init(): void;


	public abstract load(scene: Scene): Promise<void>;

	public reload(scene: Scene): Promise<void> {
		scene.remove(this.model);
		return this.load(scene);
	}

	public abstract update(): void;

	public abstract animate(): void;

}