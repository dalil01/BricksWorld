import { Model } from "../Model";
import { Mesh, Scene, Vector3 } from "three";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Experience } from "../../Experience";
import { U3DObject } from "../../utils/U3DObject";
import { COLLISION_GROUP } from "../../managers/all/PhysicsManager";
import * as THREE from "three";

export class PalmIsland extends Model {

	public constructor() {
		super();
	}


	public init(): void {
	}

	public load(scene: Scene): Promise<void> {
		return new Promise((resolve, reject) => {
			this.loadPalm(scene, resolve, reject);
		});
	}

	private loadPalm(scene, resolve, reject): void {
		UModelLoader.loadGLTF(Vars.PATH.ISLAND.PALM_MODEL, (gltf: GLTF) => {
			this.model = gltf.scene;

			scene.add(this.model);

			const physics = Experience.get().getPhysicsManager();
			const rapier = physics.getRapier();
			const world = physics.getWorld();

			const modelInfos = U3DObject.extractVerticesAndPositionsFromGroup(this.model);
			for (const modelInfo of modelInfos) {
				if (!modelInfo.mesh.name.startsWith("_")) {
					continue;
				}

				console.log("modelInfos", modelInfo)

				const floorVertices = modelInfo.vertices;
				const floorIndices = modelInfo.indices;

				const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed();
				const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);
				let floorCollider = rapier.ColliderDesc.trimesh(floorVertices, floorIndices);

				let collisionGroups;
				if (modelInfo.mesh.name === "_Fence") {
					collisionGroups = COLLISION_GROUP.OBSTACLE;
				} else {
					collisionGroups = COLLISION_GROUP.FLOOR;
				}

				floorCollider.setCollisionGroups(collisionGroups);

				world.createCollider(floorCollider, floorRigidBody.handle);
				physics.addBody({ rigid: floorRigidBody, mesh: modelInfo.mesh });

				gltf.scene.remove(modelInfo.mesh);
			}

			resolve();
		}, undefined, () => reject());
	}

	public update(): void {
	}

	public animate(): void {
	}

}