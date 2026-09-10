import { Component, OnDestroy, OnInit, Input, Output, ViewEncapsulation, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@UntilDestroy()
@Component({
	selector: 'lib-search',
	templateUrl: './search.component.html',
	encapsulation: ViewEncapsulation.None,
	standalone: true,
	providers: [],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, MatIconModule, MatTooltipModule, TranslateModule],
})

export class SearchComponent implements OnInit, OnDestroy {

	@Input() search: string = 'false';
	@Output() onSearch = new EventEmitter();
	@Output() onSearchKeyPress = new EventEmitter();
	searchControl: UntypedFormControl;
	searchInput: string = '';

	/**  Constructor */
	constructor() { }

	/** On init */
	ngOnInit(): void {
		this.searchInit();
	}

	/** On destroy */
	ngOnDestroy(): void { }

	searchInit() {
		this.searchControl = new UntypedFormControl('');
		this.searchControl.valueChanges
			.pipe(debounceTime(1000), distinctUntilChanged())
			.subscribe(query => {
				this.searchInput = query;
				this.onSearch.emit(query);
			});
	}

	searchKeyPress(event) {
		this.onSearchKeyPress.emit(event);
	}

	reset() {
		this.searchInput = '';
		this.onSearch.emit('');
	}

}
