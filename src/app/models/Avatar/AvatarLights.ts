import { AmbientLight, DirectionalLight, DirectionalLightHelper, Light, Scene } from "three";
import { Vars } from "../../../Vars";
import { LightProbeHelper } from "three/examples/jsm/helpers/LightProbeHelper";

export class AvatarLights {

	private frontLight: DirectionalLight;
	private backLight: DirectionalLight;
	private leftLight: DirectionalLight;
	private rightLight: DirectionalLight;

	public constructor() {
		const color = 0xffffff;
		const intensity = 10;

		this.frontLight = new DirectionalLight(color, intensity);
		this.backLight = new DirectionalLight(color, intensity);
		this.leftLight = new DirectionalLight(color, intensity);
		this.rightLight = new DirectionalLight(color, intensity);
	}

	public init(scene: Scene): void {
		/*
		this.frontLight.position.set(- 60, 100, - 10);
		this.frontLight.castShadow = true;
		this.frontLight.shadow.camera.top = 50;
		this.frontLight.shadow.camera.bottom = - 50;
		this.frontLight.shadow.camera.left = - 50;
		this.frontLight.shadow.camera.right = 50;
		this.frontLight.shadow.camera.near = 0.1;
		this.frontLight.shadow.camera.far = 200;
		this.frontLight.shadow.mapSize.width = 4096;
		this.frontLight.shadow.mapSize.height = 4096;
		scene.add(this.frontLight)

		 */

		this.frontLight.position.set(0, 5, -5);
		scene.add(this.backLight);

		this.backLight.position.set(0, 5, 5);
		scene.add(this.backLight);

		this.leftLight.position.set(5, 5, 0);
		scene.add(this.backLight);

		this.rightLight.position.set(-5, 5, 0);
		scene.add(this.backLight);

		if (Vars.DEBUG_MODE) {
			//this.initHelpers(scene);
		}
	}

	public initHelpers(scene: Scene): void {
		[this.frontLight, this.backLight, this.leftLight, this.rightLight].forEach((light) => {
			const helper = new DirectionalLightHelper(light, 10);
			scene.add(helper);
		});
	}

}