import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'kiosk-common-numpad',
  standalone: false,
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss']
})
export class NumpadComponent implements OnInit {
  @Input() value = '';
  @Input() disabled = false;
  @Input() title = 'Numpad';
  @Output() valueChange = new EventEmitter<string>();
  @Output() enter = new EventEmitter<void>();
  pressedKeyCode: string | null = null;
  private pressedKeyTimer: ReturnType<typeof setTimeout> | null = null;

  readonly rows: string[][] = [
    ['7', '8', '9'],
    ['4', '5', '6'],
    ['1', '2', '3'],
    ['00', '0', '.']
  ];

  constructor() {}

  ngOnInit(): void {}

  onKeyTap(key: string): void {
    if (this.disabled) {
      return;
    }

    this.flashKey(key);

    switch (key) {
      case 'BKSP':
        this.updateValue(this.value.slice(0, -1));
        return;
      case 'CLEAR':
        this.updateValue('');
        return;
      case 'ENTER':
        this.enter.emit();
        return;
      default:
        this.updateValue(this.value + key);
    }
  }

  private updateValue(nextValue: string): void {
    this.value = nextValue;
    this.valueChange.emit(this.value);
  }

  private flashKey(code: string): void {
    this.pressedKeyCode = code;

    if (this.pressedKeyTimer) {
      clearTimeout(this.pressedKeyTimer);
    }

    this.pressedKeyTimer = setTimeout(() => {
      this.pressedKeyCode = null;
      this.pressedKeyTimer = null;
    }, 180);
  }

}