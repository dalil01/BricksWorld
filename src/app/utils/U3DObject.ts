import { Group, Mesh } from "three";

export class U3DObject {

	public static extractVerticesAndPositionsFromGroup(group: Group): { mesh: Mesh, vertices: Float32Array, indices: Uint32Array }[] {
		const arr: any = [];

		group.traverse((child) => {
			if (child instanceof Mesh) {
				const geometry = child.geometry;
				geometry.computeVertexNormals();

				const vertices: Float32Array = new Float32Array(geometry.getAttribute('position').array);
				const indices: Uint32Array = geometry.index ? new Uint32Array(geometry.index.array) : new Uint32Array([]);

				arr.push({ mesh: child, vertices, indices });
			}
		});

		return arr;
	}

}