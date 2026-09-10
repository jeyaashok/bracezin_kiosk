import { Directive, ElementRef, HostListener, Input } from '@angular/core';

/**
 * Restricts a number input to a configurable number of decimal places.
 *
 * Usage:
 *   <input type="number" decimal="3">   → allows up to 3 decimal places
 *   <input type="number" decimal="0">   → integers only
 *   <input type="number" decimal>       → defaults to 2 decimal places
 */
@Directive({
	selector: 'input[decimal]',
	standalone: true,
})
export class DecimalInputDirective {

	/** Number of allowed decimal places. Defaults to 2. */
	@Input() decimal: number | string = 2;

	private get places(): number {
		const parsed = Number(this.decimal);
		return isNaN(parsed) || parsed < 0 ? 2 : Math.floor(parsed);
	}

	constructor(private el: ElementRef<HTMLInputElement>) { }

	@HostListener('input', ['$event'])
	onInput(event: InputEvent): void {
		const input = this.el.nativeElement;
		const raw = input.value;

		if (!raw) {
			return;
		}

		const places = this.places;

		if (places === 0) {
			// Strip everything after the decimal point
			const integer = raw.replace(/[^0-9-]/g, '');
			if (raw !== integer) {
				input.value = integer;
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
			return;
		}

		const regex = new RegExp(`^-?\\d*\\.?\\d{0,${places}}$`);

		if (!regex.test(raw)) {
			const dotIndex = raw.indexOf('.');
			if (dotIndex !== -1) {
				input.value = raw.slice(0, dotIndex + places + 1);
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		}
	}

	@HostListener('blur')
	onBlur(): void {
		const input = this.el.nativeElement;
		const value = parseFloat(input.value);

		if (!isNaN(value)) {
			input.value = value.toFixed(this.places);
			input.dispatchEvent(new Event('input', { bubbles: true }));
		}
	}

	@HostListener('keydown', ['$event'])
	onKeyDown(event: KeyboardEvent): void {
		// Allow: backspace, delete, tab, escape, enter, arrows, home, end, minus, period
		const allowed = [
			'Backspace', 'Delete', 'Tab', 'Escape', 'Enter',
			'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
			'Home', 'End', '.', '-',
		];

		if (allowed.includes(event.key)) {
			return;
		}

		// Block the period key when decimal places = 0
		if (event.key === '.' && this.places === 0) {
			event.preventDefault();
			return;
		}

		// Allow Ctrl/Cmd shortcuts (copy, paste, select all, etc.)
		if (event.ctrlKey || event.metaKey) {
			return;
		}

		// Block non-numeric keys
		if (!/^\d$/.test(event.key)) {
			event.preventDefault();
		}
	}
}
