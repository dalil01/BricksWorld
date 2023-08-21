import { Model } from "../../Model";
import { Scene, Vector3 } from "three";
import { UModelLoader } from "../../../utils/UModelLoader";
import { Vars } from "../../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Experience } from "../../../Experience";
import { U3DObject } from "../../../utils/U3DObject";
import { COLLISION_GROUP } from "../../../managers/all/PhysicsManager";
import { Sky } from "../../Sky/Sky";
import { Sea } from "../../Sea/Sea";
import { AvatarData } from "../../Avatar/AvatarData";

export class PalmIsland extends Model {

	private readonly sky: Sky;
	private readonly sea: Sea;

	public constructor() {
		super();
		this.sky = new Sky();
		this.sea = new Sea();
	}


	public init(): void {
		this.sky.init();
		this.sea.init();
	}

	public async load(scene: Scene): Promise<void> {
		await this.sky.load(scene);
		await this.sea.load(scene);


		return new Promise((resolve, reject) => {
			this.loadIsland(scene, resolve, reject);
		});
	}

	private loadIsland(scene, resolve, reject): void {
		UModelLoader.loadGLTF(Vars.PATH.ISLAND.PALM_MODEL, (gltf: GLTF) => {
			this.model = gltf.scene;

			scene.add(this.model);

			const firstPersonPoint = this.model.children.find((child) => child.name == "FirstPersonPoint")
			scene.remove(firstPersonPoint);

			const physics = Experience.get().getPhysicsManager();
			const rapier = physics.getRapier();
			const world = physics.getWorld();

			const modelInfos = U3DObject.extractVerticesAndPositionsFromGroup(this.model, (child) => child.name.startsWith('_'));
			for (const modelInfo of modelInfos) {
				//console.log("modelInfo", modelInfo)

				const floorVertices = modelInfo.vertices;
				const floorIndices = modelInfo.indices;

				const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed();
				const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);
				let floorCollider = rapier.ColliderDesc.trimesh(floorVertices, floorIndices);
				floorCollider.setCollisionGroups(COLLISION_GROUP.OBSTACLE);

				world.createCollider(floorCollider, floorRigidBody.handle);
				physics.addBody({ rigid: floorRigidBody, mesh: modelInfo.mesh });

				this.model.remove(modelInfo.mesh);
			}

			resolve();
		}, undefined, () => reject());
	}

	public update(): void {
	}

	public animate(): void {
	}

	public static getAvatarConfig(): AvatarData {
		const data = new AvatarData();

		data.defaultTranslation = new Vector3(-1, 0.7, 1);
		data.rigidBodyRadius = 0.2;

		return data;
	}

}