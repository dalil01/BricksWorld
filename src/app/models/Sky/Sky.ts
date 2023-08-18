import { Model } from "../Model";
import { Scene, Vector3 } from "three";
import { Vars } from "../../../Vars";
import { Sky as ThreeSky } from "three/examples/jsm/objects/Sky.js";
import * as THREE from "three";
import { SkyData } from "./SkyData";
import { Experience } from "../../Experience";

export class Sky extends Model {

	private scene!: Scene;

	private readonly sky: ThreeSky;
	private readonly data: SkyData;

	private sun: Vector3 = new Vector3();

	public constructor(data: SkyData = new SkyData()) {
		super();
		this.sky = this.model = new ThreeSky();
		this.data = data;
	}

	public override init(): void {
		this.sky.position.set(0, 0, 0);
		this.sky.scale.setScalar(3000);
	}

	public override load(scene: Scene): Promise<void> {
		this.scene = scene;

		scene.add(this.sky);

		this.onChanged();

		if (Vars.DEBUG_MODE) {
			this.initHelpers(scene);
		}

		return Promise.resolve(undefined);
	}

	public override update(): void {

	}

	public override animate(): void {
	}

	private initHelpers(scene: Scene): void {
		const GUIFolder = Experience.get().getLilGUI().addFolder("Sky")
		GUIFolder.add(this.data, "turbidity", 0.0, 20.0, 0.1).onChange(() => this.onChanged());
		GUIFolder.add(this.data, "rayleigh", 0.0, 4, 0.001).onChange(() => this.onChanged());
		GUIFolder.add(this.data, "mieCoefficient", 0.0, 0.1, 0.001).onChange(() => this.onChanged());
		GUIFolder.add(this.data, "mieDirectionalG", 0.0, 1, 0.001).onChange(() => this.onChanged());
		GUIFolder.add(this.data, "elevation", 0, 90, 0.1).onChange(() => this.onChanged());
		GUIFolder.add(this.data, "azimuth", -180, 180, 0.1).onChange(() => this.onChanged());
		GUIFolder.add(this.data, "exposure", 0, 1, 0.0001).onChange(() => this.onChanged());
	}

	private onChanged(): void {
		const uniforms = this.sky.material.uniforms;
		uniforms["turbidity"].value = this.data.turbidity;
		uniforms["rayleigh"].value = this.data.rayleigh;
		uniforms["mieCoefficient"].value = this.data.mieCoefficient;
		uniforms["mieDirectionalG"].value = this.data.mieDirectionalG;

		const phi = THREE.MathUtils.degToRad(90 - this.data.elevation);
		const theta = THREE.MathUtils.degToRad(this.data.azimuth);

		this.sun.setFromSphericalCoords(1, phi, theta);

		uniforms["sunPosition"].value.copy(this.sun);

		const experience = Experience.get();
		const renderer = experience.getRenderer();

		renderer.toneMappingExposure = this.data.exposure;
		renderer.render(this.scene, experience.getCameraManager().getCamera());
	}

}