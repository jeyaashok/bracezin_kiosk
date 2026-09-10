export interface SlugifyOptions {
	lower?: boolean;
	strict?: boolean;
	trim?: boolean;
}

export function slugify(value: string, options: SlugifyOptions = {}): string {
	let result = `${value ?? ''}`;
	if (options.trim !== false) {
		result = result.trim();
	}
	result = result
		.normalize('NFKD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
	if (options.lower) {
		result = result.toLowerCase();
	}
	if (options.strict) {
		result = result.replace(/[^a-zA-Z0-9-]/g, '');
	}
	return result;
}