import {
	Clock, Color,
	GridHelper,
	PerspectiveCamera,
	Scene,
	WebGLRenderer
} from "three";
import { CameraManager } from "./managers/all/CameraManager";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import TWEEN from "@tweenjs/tween.js";
import { ModelManager } from "./managers/all/ModelManager";
import * as THREE from "three";
import GUI from "lil-gui";
import { ViewManager } from "./managers/all/ViewManager";
import { Vars } from "../Vars";
import { PhysicsManager } from "./managers/all/PhysicsManager";
import { EventManager } from "./managers/all/EventManager";
import { Loader } from "./components/Loader/Loader";
import { UDom } from "./utils/UDom";
import { LightsManager } from "./managers/all/LightsManager";

export type Sizes = {
	w: number;
	h: number;
}

export class Experience {

	private static INSTANCE: Experience | null;

	private readonly loader: Loader;

	private readonly scene: Scene;
	private sizes!: Sizes;

	private readonly renderer: WebGLRenderer;

	private readonly eventManager: EventManager;
	private readonly physicsManager: PhysicsManager;
	private readonly viewManager: ViewManager;
	private readonly modelManager: ModelManager;
	private readonly lightsManager: LightsManager;

	private readonly cameraManager: CameraManager;
	private readonly camera!: PerspectiveCamera;
	private controls!: OrbitControls;

	private readonly clock: Clock;

	// TODO : https://github.com/pmndrs/leva
	private readonly lilGUI!: GUI;


	private constructor() {
		this.loader = new Loader(document.body, true);

		this.scene = new Scene();
		this.scene.background = new Color( "#D01012" );

		this.autoSetSizes();

		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.shadowMap.enabled = true;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 0.5;

		this.eventManager = new EventManager();
		this.physicsManager = new PhysicsManager();
		this.viewManager = new ViewManager();
		this.modelManager = new ModelManager();
		this.cameraManager = new CameraManager(this.sizes, this.renderer.domElement);
		this.lightsManager = new LightsManager(this.scene);

		this.camera = this.cameraManager.getCamera();
		this.controls = this.cameraManager.getControls();

		this.clock = new Clock();

		if (Vars.DEBUG_MODE) {
			this.lilGUI = new GUI();
		}
	}

	public static get(): Experience {
		if (!Experience.INSTANCE) {
			Experience.INSTANCE = new Experience();
		}

		return Experience.INSTANCE;
	}

	public getLoader(): Loader {
		return this.loader;
	}

	public getScene(): Scene {
		return this.scene;
	}

	public getSizes(): Sizes {
		return this.sizes;
	}

	public getRenderer(): WebGLRenderer {
		return this.renderer;
	}

	public getEventManager(): EventManager {
		return this.eventManager;
	}

	public getPhysicsManager(): PhysicsManager {
		return this.physicsManager;
	}

	public getCameraManager(): CameraManager {
		return this.cameraManager;
	}

	public getModelManager(): ModelManager {
		return this.modelManager;
	}

	public getViewManager(): ViewManager {
		return this.viewManager;
	}

	public getLightsManager(): LightsManager {
		return this.lightsManager;
	}

	public getLilGUI(): GUI {
		return this.lilGUI;
	}

	public getClock(): Clock {
		return this.clock;
	}

	public init(): void {
		this.loader.show();

		this.eventManager.start();
		this.physicsManager.start().then(() => {
			this.modelManager.load(this.scene).then(() => {
				this.viewManager.start();
				this.modelManager.start();
				this.lightsManager.start();
				this.cameraManager.start();

				this.scene.add(this.camera);
				document.body.appendChild(this.renderer.domElement);

				this.onResize();
				this.subscribeToEventListeners();
				this.renderer.setAnimationLoop(() => this.animate());

				if (Vars.DEBUG_MODE) {
					//this.initHelpers();
				}

				this.loader.hide();
			});
		});
	}

	public stop(): void {
		UDom.removeAllChildren(document.body);
		Experience.INSTANCE = null;
		Experience.get().init();
	}

	public updateRenderer(): void {
		this.autoSetSizes();

		this.viewManager.update();
		this.modelManager.update();
		this.cameraManager.update();

		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	}

	private subscribeToEventListeners(): void {
		window.addEventListener("resize", () => this.onResize());
	}

	private onResize(): void {
		this.updateRenderer();
	}

	private autoSetSizes(): void {
		this.sizes = {
			w: window.innerWidth,
			h: window.innerHeight
		};
	}

	private animate(): void {
		this.physicsManager.animate();
		this.cameraManager.update();
		this.modelManager.animate();

		TWEEN.update();

		this.renderer.render(this.scene, this.camera);
	}

	private initHelpers(): void {
		const gridHelper = new GridHelper(5, 5);
		this.scene.add(gridHelper);

		const axesHelper = new THREE.AxesHelper(5);
		this.scene.add(axesHelper);
	}

}