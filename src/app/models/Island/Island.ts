import { Model } from "../Model";
import {
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

				const modelInfos  = this.extractVertexPositionsFromGLBModel(this.model);
				console.log(modelInfos )

				for (const modelInfo of modelInfos ) {
					const floorVertices = modelInfo.vertices;
					const floorIndices = modelInfo.indices;

					// Créez un corps rigide statique pour le sol
					const floorRigidBodyDesc = rapier.RigidBodyDesc.fixed(); // Ou RigidBodyDesc.newDynamic() si nécessaire
					const floorRigidBody = world.createRigidBody(floorRigidBodyDesc);
					const floorCollider = rapier.ColliderDesc.trimesh(floorVertices, floorIndices);


					// Ajoutez le corps rigide au monde Rapier
					world.createCollider(floorCollider, floorRigidBody.handle);
				}





				const cube = this.model.children.find(child => child.name = "Cube");

				const cubeBoxSize = this.calculateModelSize(cube);
				console.log(cubeBoxSize)


				const boxRigidBodyDesc = rapier.RigidBodyDesc.fixed();
				boxRigidBodyDesc.setCanSleep(false);
				const boxRigidBody = world.createRigidBody(boxRigidBodyDesc);
				const boxCollider =rapier.ColliderDesc.cuboid(2, 2, 2);

				world.createCollider(boxCollider, boxRigidBody.handle);
//
		physics.addBody({ collider: boxCollider, rigid: boxRigidBody, mesh: cube  })



				function body(scene: Scene, world: World,
							  bodyType: 'dynamic' | 'static' | 'kinematicPositionBased',
							  colliderType: 'cube' | 'sphere' | 'cylinder' | 'cone', dimension: any,
							  translation: { x: number, y: number, z: number },
							  rotation: { x: number, y: number, z: number },
							  color: string): Body {

					let bodyDesc

					if (bodyType === 'dynamic') {
						bodyDesc = rapier.RigidBodyDesc.dynamic();
					} else if (bodyType === 'kinematicPositionBased') {
						bodyDesc = rapier.RigidBodyDesc.kinematicPositionBased();
					} else if (bodyType === 'static') {
						bodyDesc = rapier.RigidBodyDesc.fixed();
						bodyDesc.setCanSleep(false);
					}

					if (translation) {
						bodyDesc.setTranslation(translation.x, translation.y, translation.z)
					}
					if(rotation) {
						const q = new Quaternion().setFromEuler(
							new Euler( rotation.x, rotation.y, rotation.z, 'XYZ' )
						)
						bodyDesc.setRotation({ x: q.x, y: q.y, z: q.z, w: q.w })
					}

					let rigidBody = world.createRigidBody(bodyDesc);

					let collider;
					if (colliderType === 'cube') {
						collider = rapier.ColliderDesc.cuboid(dimension.hx, dimension.hy, dimension.hz);
					} else if (colliderType === 'sphere') {
						collider = rapier.ColliderDesc.ball(dimension.radius);
					} else if (colliderType === 'cylinder') {
						collider = rapier.ColliderDesc.cylinder(dimension.hh, dimension.radius);
					} else if (colliderType === 'cone') {
						collider = rapier.ColliderDesc.cone(dimension.hh, dimension.radius);
						// cone center of mass is at bottom
						collider.centerOfMass = {x:0, y:0, z:0}
					}
					world.createCollider(collider, rigidBody.handle);

					let bufferGeometry;
					if (colliderType === 'cube') {
						bufferGeometry = new BoxGeometry(dimension.hx * 2, dimension.hy * 2, dimension.hz * 2);
					} else if (colliderType === 'sphere') {
						bufferGeometry = new SphereGeometry(dimension.radius, 32, 32);
					} else if (colliderType === 'cylinder') {
						bufferGeometry = new CylinderGeometry(dimension.radius,
							dimension.radius, dimension.hh * 2,  32, 32);
					} else if (colliderType === 'cone') {
						bufferGeometry = new ConeGeometry(dimension.radius, dimension.hh * 2,
							32, 32);
					}

					const threeMesh = new Mesh(bufferGeometry, new MeshPhongMaterial({ color: color }));
					threeMesh.castShadow = true;
					threeMesh.receiveShadow = true;
					scene.add(threeMesh);

					return { collider, rigid: rigidBody, mesh: threeMesh };
				}

				let scale = new rapier.Vector3(30.0, 3.0, 30.0);

				const staticB = body(scene, world, 'static', 'cube',
					{ hx: 10, hy: 1, hz: 10 }, { x: scale.x / 2, y: 2.5, z: 0 },
					{ x: 0, y: 0, z: 1.2 }, 'pink');
				physics.addBody(staticB);

				const cubeBody = body(scene, world, 'dynamic', 'cube',
					{ hx: 1, hy: 1, hz: 1 }, { x: 0, y: 15, z: 0 },
					{ x: 0, y: 0.4, z: 0.7 }, 'orange');
				physics.addBody(cubeBody);

				console.log("dd",cubeBody)

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