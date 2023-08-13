import {
	CameraHelper,
	Clock,
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

export type Sizes = {
	w: number;
	h: number;
}

export class Experience {

	private static INSTANCE: Experience;

	private readonly scene: Scene;
	private sizes!: Sizes;

	private readonly renderer: WebGLRenderer;

	private readonly viewManager: ViewManager;
	private readonly modelManager: ModelManager;

	private readonly cameraManager: CameraManager;
	private camera!: PerspectiveCamera;
	private controls!: OrbitControls;

	private readonly clock: Clock;

	private readonly lilGUI!: GUI;


	private constructor() {
		this.scene = new Scene();

		this.autoSetSizes();

		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.setSize(this.sizes.w, this.sizes.h);
		this.renderer.shadowMap.enabled = true;
		this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
		this.renderer.toneMappingExposure = 0.5;

		this.viewManager = new ViewManager();
		this.modelManager = new ModelManager();
		this.cameraManager = new CameraManager(this.sizes, this.renderer.domElement);

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

	public getScene(): Scene {
		return this.scene;
	}

	public getSizes(): Sizes {
		return this.sizes;
	}

	public getRenderer(): WebGLRenderer {
		return this.renderer;
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

	public getLilGUI(): GUI {
		return this.lilGUI;
	}

	public getClock(): Clock {
		return this.clock;
	}

	public init(): void {
		this.modelManager.load(this.scene).then(() => {
			const geometry = new THREE.PlaneGeometry(512, 512);
			const material = new THREE.MeshPhongMaterial({ color: 0xcbcbcb, depthWrite: false });
			const map = new THREE.Mesh(geometry, material);
			map.receiveShadow = true;
			map.position.y = 0;
			map.rotation.x = -Math.PI / 2;
			this.scene.add(map);

			this.viewManager.start();
			this.modelManager.start();
			this.cameraManager.start();

			this.scene.add(this.camera);
			document.body.appendChild(this.renderer.domElement);

			this.onResize();
			this.subscribeToEventListeners();
			this.renderer.setAnimationLoop(() => this.animate());

			if (Vars.DEBUG_MODE) {
				this.initHelpers();
			}
		});
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