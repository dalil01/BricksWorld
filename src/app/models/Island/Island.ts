import { Model } from "../Model";
import { Mesh, Scene, Vector3 } from "three";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Experience } from "../../Experience";
import { U3DObject } from "../../utils/U3DObject";
import { COLLISION_GROUP } from "../../managers/all/PhysicsManager";
import * as THREE from "three";

export class Island extends Model {

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

			//const boundingBox = new THREE.Box3().setFromObject(this.model);
			//const boundingBoxHelper = new THREE.Box3Helper(boundingBox, new THREE.Color(0xffff00));
			//scene.add(boundingBoxHelper);
			//console.log("PALM helper box", boundingBoxHelper)

			const physics = Experience.get().getPhysicsManager();
			const rapier = physics.getRapier();
			const world = physics.getWorld();

			const modelInfos = U3DObject.extractVerticesAndPositionsFromGroup(this.model);
			console.log("modelInfos", modelInfos)

			for (const modelInfo of modelInfos) {
				const floorVertices = modelInfo.vertices;
				const floorIndices = modelInfo.indices;

				const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed();
				const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);
				const floorCollider = rapier.ColliderDesc.trimesh(floorVertices, floorIndices);

				let collisionGroups;
				if (modelInfo.mesh.name === "HiddenFence") {
					collisionGroups = COLLISION_GROUP.OBSTACLE;
					gltf.scene.remove(modelInfo.mesh);
				} else {
					collisionGroups = COLLISION_GROUP.FLOOR;
				}

				floorCollider.setCollisionGroups(collisionGroups);
				console.log(floorCollider)

				world.createCollider(floorCollider, floorRigidBody.handle);
				physics.addBody({ rigid: floorRigidBody, mesh: modelInfo.mesh });
			}

			resolve();
		}, undefined, () => reject());
	}

	public update(): void {
	}

	public animate(): void {
	}

}