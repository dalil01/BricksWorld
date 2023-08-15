import { Manager } from "../Manager";
import { Collider, ColliderDesc, RigidBody, World } from "@dimforge/rapier3d";
import { Mesh, Quaternion } from "three";

export type Body = {
	collider: Collider,
	rigid: RigidBody, mesh: Mesh
};

export class PhysicsManager extends Manager {

	private RAPIER;

	private world!: World;
	private bodys: Body[] = [];

	public constructor() {
		super();

	}

	public async start(): Promise<void> {
		return new Promise((resolve, reject) => {
			import("@dimforge/rapier3d").then((rapier) => {
				this.RAPIER = rapier;
				const gravity = { x: 0.0, y: -9.82, z: 0.0 };
				this.world = new rapier.World(gravity);
				console.log(this.world)
				resolve();
			});
		});
	}

	public stop(): void {
	}

	public getRapier() {
		return this.RAPIER;
	}

	public getWorld() {
		return this.world;
	}

	public addCollider(desc: ColliderDesc, parent: RigidBody | undefined): void {
		//this.world.createCollider(desc, parent);
	}

	public addBody(body: Body): void {
		this.bodys.push(body);
		console.log(this.bodys)
	}

	getBodies()
	{
		return this.bodys;
	}
	public update(): void {
	}

	public animate(): void {
		// Step the simulation forward.
		this.world.step();

		// Update 3D world with physical world.
		this. bodys.forEach(body => {
			let position = body.rigid.translation();
			let rotation = body.rigid.rotation();

			body.mesh.position.x = position.x
			body.mesh.position.y = position.y
			body.mesh.position.z = position.z

			body.mesh.setRotationFromQuaternion(
				new Quaternion(rotation.x,
					rotation.y,
					rotation.z,
					rotation.w));
		});
	}

}