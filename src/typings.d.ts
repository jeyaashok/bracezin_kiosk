declare module '@ckeditor/ckeditor5-build-classic' {
	const ClassicEditorBuild: any;
	export = ClassicEditorBuild;
}

declare module 'slugify' {
	interface SlugifyOptions {
		lower?: boolean;
		strict?: boolean;
		trim?: boolean;
	}

	function slugify(value: string, options?: SlugifyOptions): string;
	export default slugify;
}

declare module 'countrycitystatejson' {
	interface CountryCityStateCountry {
		states: Record<string, Array<{ name: string; [key: string]: any }>>;
		[key: string]: any;
	}

	interface CountryCityStateInfo {
		shortName: string;
		[key: string]: any;
	}

	interface CountryCityStateApi {
		getAll(): Record<string, CountryCityStateCountry>;
		getCountriesShort(): string[];
		getCountryByShort(shortName: string): CountryCityStateCountry | null;
		getCountryInfoByShort(shortName: string): CountryCityStateInfo | null;
		getStatesByShort(shortName: string): string[] | null;
		getCities(shortName: string, state: string): string[] | null;
		getCountries(): CountryCityStateInfo[];
		getCitiesByName(name: string): Array<{
			city: { name: string; [key: string]: any };
			state: string;
			country: CountryCityStateCountry;
		}>;
	}

	const worldJson: CountryCityStateApi;
	export default worldJson;
}

declare module 'html2pdf.js' {
	const html2pdf: any;
	export default html2pdf;
}

interface Window {
	html2pdf?: any;
}
