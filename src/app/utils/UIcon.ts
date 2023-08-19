import { UDom } from "./UDom";

export class UIcon {

	public static closeCircle(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m9 9l3 3m0 0l3 3m-3-3l-3 3m3-3l3-3m-3 12a9 9 0 1 1 0-18a9 9 0 0 1 0 18Z\"/></svg>",
			...properties
		});
	}

	public static help(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 32 32\"><path fill=\"currentColor\" d=\"M16 1.466C7.973 1.466 1.466 7.973 1.466 16c0 8.027 6.507 14.534 14.534 14.534c8.027 0 14.534-6.507 14.534-14.534c0-8.027-6.507-14.534-14.534-14.534zm1.328 22.905H14.62v-2.595h2.708v2.596zm0-5.367v.858H14.62v-1.056c0-3.19 3.63-3.696 3.63-5.963c0-1.033-.923-1.825-2.133-1.825c-1.254 0-2.354.924-2.354.924l-1.54-1.916S13.74 8.44 16.358 8.44c2.486 0 4.795 1.54 4.795 4.136c0 3.632-3.827 4.05-3.827 6.427z\"/></svg>",
			...properties
		});
	}

}