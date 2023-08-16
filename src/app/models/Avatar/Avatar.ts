import { Model } from "../Model";
import { Mesh, MeshPhongMaterial, Scene, SphereGeometry } from "three";
import { UModelLoader } from "../../utils/UModelLoader";
import { Vars } from "../../../Vars";
import { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { AvatarControls } from "./AvatarControls";
import { Experience } from "../../Experience";
import { AvatarLights } from "./AvatarLights";
import { ViewManager } from "../../managers/all/ViewManager";

export class Avatar extends Model {

	private lights: AvatarLights;
	private controls!: AvatarControls;

	private viewManager!: ViewManager;

	public constructor() {
		super();
		this.lights = new AvatarLights();
	}

	public override init(): void {
		this.viewManager = Experience.get().getViewManager();
	}

	public override load(scene: Scene): Promise<void> {
		return new Promise((resolve, reject) => {
			UModelLoader.loadGLTF(Vars.PATH.AVATAR.MODEL, (gltf: GLTF) => {
				this.model = gltf.scene;

				scene.add(gltf.scene);

				const firstPersonPoint = this.model.children.find((child) => child.name = "firstPersonPoint");
				scene.remove(firstPersonPoint)

				const physics = Experience.get().getPhysicsManager();
				const rapier = physics.getRapier();
				const world = physics.getWorld();

				const rigidBodyRadius = 0.25;

				const bodyDesc = rapier.RigidBodyDesc.kinematicPositionBased().setTranslation(-1, 1, 1);
				const rigidBody = world.createRigidBody(bodyDesc);
				const dynamicCollider = rapier.ColliderDesc.ball(rigidBodyRadius);
				world.createCollider(dynamicCollider, rigidBody.handle);

				this.controls = new AvatarControls(this.model, rigidBody, rigidBodyRadius, gltf.animations);

				this.lights.init(scene);
				this.controls.init();

				resolve();
			}, undefined, () => reject());
		});
	}

	public override update(): void {
		this.controls?.update();
	}

	public override animate(): void {
		if (this.viewManager?.isWorldView()) {
			this.controls?.animate();
		}
	}

	public moveCameraToDefaultWorldView(): void {
		this.controls.moveCameraToDefaultWorldView();
	}

}