import { IModelLights } from "../../IModelLights";
import { AmbientLight, DirectionalLight, DirectionalLightHelper, Scene } from "three";
import { Vars } from "../../../../Vars";

export class PalmIslandLights implements IModelLights {

	private readonly color = 0xffffff;
	private readonly intensity = 2;

	private readonly ambientLight: AmbientLight;

	private readonly frontLight: DirectionalLight;
	private readonly frontLeftLight: DirectionalLight;
	private readonly frontRightLight: DirectionalLight;
	private readonly backLight: DirectionalLight;
	private readonly backLeftLight: DirectionalLight;
	private readonly backRightLight: DirectionalLight;

	public constructor() {
		this.ambientLight = new AmbientLight(0xffffff, .2);
		this.frontLight = new DirectionalLight(this.color, this.intensity);
		this.frontLeftLight = new DirectionalLight(this.color, this.intensity);
		this.frontRightLight = new DirectionalLight(this.color, this.intensity);
		this.backLight = new DirectionalLight(this.color, this.intensity);
		this.backLeftLight = new DirectionalLight(this.color, this.intensity);
		this.backRightLight = new DirectionalLight(this.color, this.intensity);
	}

	public start(scene: Scene): void {
		scene.add(this.ambientLight);

		this.frontLight.position.set(0, 30, -30);
		scene.add(this.frontLight);

		this.frontLeftLight.position.set(50, 15, 5);
		scene.add(this.frontLeftLight);

		this.frontRightLight.position.set(-30, 30, -15);
		scene.add(this.frontRightLight);

		this.backLight.position.set(0, 50, 10);
		scene.add(this.backLight);

		this.backLeftLight.position.set(15, 15, 5);
		scene.add(this.backLeftLight);

		this.backRightLight.position.set(-30, 30, 20);
		scene.add(this.backRightLight);

		if (Vars.DEBUG_MODE) {
			this.initHelpers(scene);
		}
	}

	public stop(scene: Scene): void {
		scene.remove(
			this.ambientLight,
			this.frontLight,
			this.frontLeftLight,
			this.frontRightLight,
			this.backLight,
			this.backLeftLight,
			this.backRightLight
		);
	}

	private initHelpers(scene: Scene): void {
		[this.frontLight, this.frontLeftLight, this.frontRightLight, this.backLight, this.backLeftLight, this.backRightLight].forEach((light) => {
			const helper = new DirectionalLightHelper(light, 10);
			scene.add(helper);
		});
	}

}