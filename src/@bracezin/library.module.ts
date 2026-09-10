import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { NoRecordComponent } from './components/norecord/norecord.component';
import { ConfirmComponent } from './components/confirm/confirm.component';
import { SearchComponent } from './components/search/search.component';
import { AlertComponent } from './components/dialog/alert/alert.component';

@NgModule({
    declarations: [
		],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatDialogModule,
        NoRecordComponent,
				ConfirmComponent,
        SearchComponent,
        AlertComponent
    ],
    exports: [
        NoRecordComponent,
        ConfirmComponent,
        SearchComponent,
        AlertComponent
    ],
    providers: [],
    schemas: [
        CUSTOM_ELEMENTS_SCHEMA,
        NO_ERRORS_SCHEMA
    ]
})
export class LibraryModule { }
