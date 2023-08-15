import { Model } from "../Model";
import {
	Box3,
	BoxGeometry, ConeGeometry,
	CylinderGeometry, Euler,
	Mesh, MeshBasicMaterial, MeshPhongMaterial,
	MeshStandardMaterial, Object3D,
	PlaneGeometry, Quaternion,
	Scene,
	SphereGeometry,
	Vector3
} from "three";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader";
import { Experience } from "../../Experience";
import {
	World,
	Vector,
	ColliderDesc,
	RigidBodyDesc,
	RigidBodyType,
	Shape,
	TriMesh,
	RigidBody
} from '@dimforge/rapier3d';
import { Body } from "../../managers/all/PhysicsManager";

export class Island extends Model {

	public constructor() {
		super();
	}


	init(): void {
	}

	load(scene: Scene): Promise<void> {
		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(Vars.PATH.ISLAND.PALM_MODEL, (gltf: GLTF) => {
				this.model = gltf.scene;

				scene.add(this.model);

				const physics = Experience.get().getPhysicsManager();
				const rapier = physics.getRapier();
				const world = physics.getWorld();

				console.log("Island", this.model)

				/*
				this.model.traverse((child) => {
					if (child instanceof Mesh) {
						const boundingBox = new Box3().setFromObject(child);
						const dimensions = new Vector3();
						boundingBox.getSize(dimensions);

						const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed();
						const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);
						const floorCollider = rapier.ColliderDesc.cuboid(dimensions.x, dimensions.y, dimensions.z);

						world.createCollider(floorCollider, floorRigidBody.handle);

						physics.addBody({ collider: floorCollider, rigid: floorRigidBody, mesh: child });
					}
				})

				 */


				const modelInfos = this.extractVertexPositionsFromGLBModel(this.model);
				for (const modelInfo of modelInfos) {
					console.log(modelInfo)
					const floorVertices = modelInfo.vertices;
					const floorIndices = modelInfo.indices;

					// Créez un corps rigide statique pour le sol
					const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed(); // Ou RigidBodyDesc.newDynamic() si nécessaire
					const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);
					const floorCollider = rapier.ColliderDesc.trimesh(floorVertices, floorIndices);


					// Ajoutez le corps rigide au monde Rapier
					world.createCollider(floorCollider, floorRigidBody.handle);
				}

				/*
				this.model.traverse((child) => {
					console.log("ch", child)
					if (child instanceof Mesh) {
						const boundingBox = new Box3().setFromObject(child);
						const dimensions = new Vector3();
						boundingBox.getSize(dimensions);

						const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed(); // Utilisez newStatic() pour les objets statiques
						const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);

						const floorColliderDesc = rapier.ColliderDesc.cuboid(dimensions.x, dimensions.y, dimensions.z);
						world.createCollider(floorColliderDesc, floorRigidBody.handle);
					}
				});

				 */

				resolve();
			}, undefined, () => reject());
		});
	}

	calculateModelSize(model: any): [number, number, number] {
		const min = new Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
		const max = new Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);

		model.traverse((child) => {
			if (child.isMesh) {
				const geometry = child.geometry;

				geometry.computeBoundingBox();
				const boundingBox = geometry.boundingBox;

				min.min(boundingBox.min);
				max.max(boundingBox.max);
			}
		});

		const sizeX = max.x - min.x;
		const sizeY = max.y - min.y;
		const sizeZ = max.z - min.z;

		return [sizeX, sizeY, sizeZ];
	}

	private extractVertexPositionsFromGLBModel(glbModel: any): { vertices: Float32Array, indices: Uint32Array }[] {
		const vertexPositions: { vertices: Float32Array, indices: Uint32Array }[] = [];

		glbModel.traverse((child) => {
			if (child instanceof Mesh) {
				const geometry = child.geometry;
				geometry.computeVertexNormals();

				const vertices: Float32Array = new Float32Array(geometry.getAttribute('position').array);
				const indices: Uint32Array = geometry.index ? new Uint32Array(geometry.index.array) : new Uint32Array([]);

				vertexPositions.push({ vertices, indices });
			}
		});

		return vertexPositions;
	}


	update(): void {
	}

	animate(): void {
	}


}