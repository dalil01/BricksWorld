import { CameraHelper, PerspectiveCamera } from "three";
import { Experience, Sizes } from "../../Experience";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Manager } from "../Manager";
import { Vars } from "../../../Vars";

export class CameraManager extends Manager {

	private readonly camera: PerspectiveCamera;
	private cameraHelper!: CameraHelper;

	private readonly controls: OrbitControls;

	public constructor(sizes: Sizes, canvas: HTMLElement) {
		super();
		this.camera = new PerspectiveCamera(45, sizes.w / sizes.h, 0.1, 500);
		this.controls = new OrbitControls(this.camera, canvas);
	}

	public getCamera(): PerspectiveCamera {
		return this.camera;
	}

	public getControls(): OrbitControls {
		return this.controls;
	}

	public override start(): void {
		if (Vars.DEBUG_MODE) {
			this.initHelpers();
		}
	}

	public override stop(): void {
	}

	public override update(): void {
		const sizes = Experience.get().getSizes();

		this.camera.aspect = sizes.w / sizes.h;
		this.camera.updateProjectionMatrix();
	}

	public override animate(): void {
		this.cameraHelper?.update();
		this.controls.update();
	}

	private initHelpers(): void {
		this.cameraHelper = new CameraHelper(this.camera);
		Experience.get().getScene().add(this.cameraHelper);
	}

}