import { Vector3 } from "three";

export class AvatarData {

	defaultTranslation: Vector3 = new Vector3(-1, .77, 1);
	rigidBodyRadius: number = 0.2;

	worldCameraPositionOffset: Vector3 = new Vector3(-5, 10, 10);
	sceneControlsCameraPositionOffset: Vector3 = new Vector3(-50, 30, -40);
	sceneControlsPositionOffset: Vector3 = new Vector3(0, 0, 0);

}