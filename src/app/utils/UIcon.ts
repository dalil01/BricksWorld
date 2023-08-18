import { UDom } from "./UDom";

export class UIcon {

	public static closeCircle(properties = {}): HTMLSpanElement {
		return UDom.span({ innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m9 9l3 3m0 0l3 3m-3-3l-3 3m3-3l3-3m-3 12a9 9 0 1 1 0-18a9 9 0 0 1 0 18Z\"/></svg>", ...properties });
	}

}