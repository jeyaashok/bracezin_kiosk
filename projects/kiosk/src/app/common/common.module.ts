import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { KeyboardComponent } from './keyboard/keyboard.component';
import { NumpadComponent } from './numpad/numpad.component';

@NgModule({
  declarations: [
    KeyboardComponent,
    NumpadComponent
  ],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [
    KeyboardComponent,
    NumpadComponent
  ],
  providers: [],
  bootstrap: []
})
export class KioskCommonModule {}
