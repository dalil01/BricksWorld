import { UDom } from "./UDom";

export class UIcon {

	public static close(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\"><path fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\" d=\"m16 16l-4-4m0 0L8 8m4 4l4-4m-4 4l-4 4\"/></svg>",
			...properties
		});
	}

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

	public static playArrowOutline(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M8 19V5l11 7l-11 7Zm2-7Zm0 3.35L15.25 12L10 8.65v6.7Z\"/></svg>",
			...properties
		});
	}

	public static models(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M15.43 15.48c-1.1-.49-2.26-.73-3.43-.73c-1.18 0-2.33.25-3.43.73c-.23.1-.4.29-.49.52h7.85a.978.978 0 0 0-.5-.52zm-2.49-6.69C12.86 8.33 12.47 8 12 8s-.86.33-.94.79l-.2 1.21h2.28l-.2-1.21z\" opacity=\".3\"/><path fill=\"currentColor\" d=\"M10.27 12h3.46a1.5 1.5 0 0 0 1.48-1.75l-.3-1.79a2.951 2.951 0 0 0-5.82.01l-.3 1.79c-.15.91.55 1.74 1.48 1.74zm.79-3.21c.08-.46.47-.79.94-.79s.86.33.94.79l.2 1.21h-2.28l.2-1.21zm-9.4 2.32c-.13.26-.18.57-.1.88c.16.69.76 1.03 1.53 1h1.95c.83 0 1.51-.58 1.51-1.29c0-.14-.03-.27-.07-.4c-.01-.03-.01-.05.01-.08c.09-.16.14-.34.14-.53c0-.31-.14-.6-.36-.82c-.03-.03-.03-.06-.02-.1c.07-.2.07-.43.01-.65a1.12 1.12 0 0 0-.99-.74a.09.09 0 0 1-.07-.03C5.03 8.14 4.72 8 4.37 8c-.3 0-.57.1-.75.26c-.03.03-.06.03-.09.02a1.24 1.24 0 0 0-1.7 1.03c0 .02-.01.04-.03.06c-.29.26-.46.65-.41 1.05c.03.22.12.43.25.6c.03.02.03.06.02.09zm14.58 2.54c-1.17-.52-2.61-.9-4.24-.9c-1.63 0-3.07.39-4.24.9A2.988 2.988 0 0 0 6 16.39V18h12v-1.61c0-1.18-.68-2.26-1.76-2.74zM8.07 16a.96.96 0 0 1 .49-.52c1.1-.49 2.26-.73 3.43-.73c1.18 0 2.33.25 3.43.73c.23.1.4.29.49.52H8.07zm-6.85-1.42A2.01 2.01 0 0 0 0 16.43V18h4.5v-1.61c0-.83.23-1.61.63-2.29c-.37-.06-.74-.1-1.13-.1c-.99 0-1.93.21-2.78.58zm21.56 0A6.95 6.95 0 0 0 20 14c-.39 0-.76.04-1.13.1c.4.68.63 1.46.63 2.29V18H24v-1.57c0-.81-.48-1.53-1.22-1.85zM22 11v-.5c0-1.1-.9-2-2-2h-2c-.42 0-.65.48-.39.81l.7.63c-.19.31-.31.67-.31 1.06c0 1.1.9 2 2 2s2-.9 2-2z\"/></svg>",
			...properties
		});
	}

	public static legoHead(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 24 24\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-linejoin=\"round\" stroke-width=\"2\"><path d=\"M9.5 11h.01m4.99 0h.01M9.5 15a3.5 3.5 0 0 0 5 0\"/><path d=\"M7 5h1V3h8v2h1a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3v1H7v-1a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3\"/></g></svg>",
			...properties
		});
	}

	public static chest(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 48 48\"><g fill=\"none\" stroke=\"currentColor\" stroke-linecap=\"round\" stroke-width=\"4\"><path d=\"M16.997 3.5v5.149c0 1.75-.964 2.425-4.595 3.358c-3.63.932-4.706 1.482-5.554 3.093C6.283 16.172 6 17.83 6 20.072V37.5\"/><path stroke-linejoin=\"round\" d=\"M34.942 21.509c.237 2.876-.25 5.389-1.463 7.537c-1.212 2.148-3.353 3.457-6.422 3.926M13.059 21.509c-.239 2.876.25 5.389 1.469 7.537c1.218 2.148 3.376 3.457 6.474 3.926\"/><path d=\"M13 43.512c1.333-1.555 2-3.246 2-5.072v-8.364m20 13.436c-1.333-1.555-2-3.246-2-5.072v-8.364M31 3.5v5.149c0 1.75.964 2.425 4.595 3.358c3.63.932 4.706 1.482 5.554 3.093c.565 1.073.848 2.73.848 4.972V37.5\"/></g></svg>",
			...properties
		});
	}

	public static legs(properties = {}): HTMLSpanElement {
		return UDom.span({
			innerHTML: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"32\" height=\"32\" viewBox=\"0 0 512 512\"><path fill=\"currentColor\" d=\"M329.4 16.38c20.7 13.71 33.6 29.78 39.1 48.03c7.7 25.32.6 52.79-15.1 80.89c-2.2 3.9-4.3 7.7-6.3 11.5c21.2 42.5 38.6 84.8 44.4 128.3c4.9 17.3-25.6 32.3-23.8 44.5c2.4 12.6 9.3 17.2 18.6 22.6c11.4 6.2 23.2 13.3 26.8 25c5.8 21 13.4 31.6 19.7 37c6.3 5.4 11.4 6.3 15.3 6.8c10.8 1.2 22.5-1.2 28.9-4.7c4.2-2.3 6-5.2 4.4-7.9c-19.6-36.2-53.5-73.4-54-114.3c.6-60.2-22.8-129.8-13.7-196.25c4-29.33 3.5-44.93-1.2-52.6c-16.8-27.67-54.3-27.75-83.1-28.87zM30.05 18.72C76.23 100.3 192 102.1 276.4 99.03L265 114.1c-25.3 33.5-29.9 62.3-29.7 92.5c.3 30.3 6.3 61.8 1.7 97.4c-2.2 17.3-14.5 28.6-24.2 37.5c-4.9 5.7-15.9 11.5-16.1 19.7c-.1 16.2 2.7 24.5 6.2 32.3c3.5 7.7 8.5 15.6 10.1 27.8c2 14.9 1.8 26.8 3.2 35.9c1.3 9 3.5 15.1 10.7 22.2c11.4 9 25.5 10.9 34.8 8.8c4.5-1.1 10.7-3.9 9-7.4c-26.9-55.9-11.5-108.3-2.5-161.5c9.7-58.5 31.8-115.3 69.4-182.8c14.4-25.8 19.4-48.02 13.7-66.89c-5.6-18.56-22-35.81-55.1-50.89z\"/></svg>",
			...properties
		});
	}

}