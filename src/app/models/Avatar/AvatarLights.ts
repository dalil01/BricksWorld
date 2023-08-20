import { DirectionalLight, DirectionalLightHelper, Scene } from "three";
import { Vars } from "../../../Vars";

export class AvatarLights {

	private readonly frontLight: DirectionalLight;
	private readonly backLight: DirectionalLight;
	private readonly leftLight: DirectionalLight;
	private readonly rightLight: DirectionalLight;

	public constructor() {
		const color = 0xffffff;
		const intensity = 10;

		this.frontLight = new DirectionalLight(color, intensity);
		this.backLight = new DirectionalLight(color, intensity);
		this.leftLight = new DirectionalLight(color, intensity);
		this.rightLight = new DirectionalLight(color, intensity);
	}

	public init(scene: Scene): void {
		this.frontLight.position.set(0, 3, -5);
		scene.add(this.frontLight);

		this.backLight.position.set(0, 3, 5);
		scene.add(this.backLight);

		/*
		this.leftLight.position.set(5, 3, 0);
		scene.add(this.leftLight);

		this.rightLight.position.set(-5, 3, 0);
		scene.add(this.rightLight);

		 */

		if (Vars.DEBUG_MODE) {
			this.initHelpers(scene);
		}
	}

	public initHelpers(scene: Scene): void {
		[this.frontLight, this.backLight, this.leftLight, this.rightLight].forEach((light) => {
			const helper = new DirectionalLightHelper(light, 10);
			scene.add(helper);
		});
	}

}