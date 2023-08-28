import { Scene } from "three";

export interface IModelLights {

	start(scene: Scene): void;

	stop(scene: Scene): void;

}