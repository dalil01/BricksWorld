import {
	AmbientLight,
	Color,
	DirectionalLight,
	DirectionalLightHelper,
	Scene,
} from "three";
import { Vars } from "../../../Vars";

export class AvatarLights {

	private readonly color = 0xffffff;
	private readonly intensity = 2;

	private readonly frontLight: DirectionalLight;
	private readonly frontLeftLight: DirectionalLight;
	private readonly frontRightLight: DirectionalLight;
	private readonly backLight: DirectionalLight;
	private readonly backLeftLight: DirectionalLight;
	private readonly backRightLight: DirectionalLight;

	public constructor() {
		this.frontLight = new DirectionalLight(this.color, this.intensity);
		this.frontLeftLight = new DirectionalLight(this.color, this.intensity);
		this.frontRightLight = new DirectionalLight(this.color, this.intensity);
		this.backLight = new DirectionalLight(this.color, this.intensity);
		this.backLeftLight = new DirectionalLight(this.color, this.intensity);
		this.backRightLight = new DirectionalLight(this.color, this.intensity);
	}

	public init(scene: Scene): void {
		const ambientLight = new AmbientLight(0xffffff, .3); // Couleur blanche, intensité 0.5
		scene.add(ambientLight);

		scene.background = new Color( "#FFFFFF" );
		//scene.background = new Color( "#D01012" );

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

	public initHelpers(scene: Scene): void {
		[this.frontLight, this.frontLeftLight, this.frontRightLight, this.backLight, this.backLeftLight, this.backRightLight].forEach((light) => {
			const helper = new DirectionalLightHelper(light, 10);
			scene.add(helper);
		});
	}

}