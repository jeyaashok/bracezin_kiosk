import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

interface KeyboardKey {
  code: string;
  label: string;
  shiftLabel?: string;
  width?: 'normal' | 'wide' | 'xwide' | 'space';
  action?: 'char' | 'shift' | 'caps' | 'tab' | 'ctrl' | 'alt' | 'bksp' | 'enter' | 'space' | 'clear';
}

@Component({
  selector: 'kiosk-common-keyboard',
  standalone: false,
  templateUrl: './keyboard.component.html',
  styleUrls: ['./keyboard.component.scss']
})
export class KeyboardComponent implements OnInit {
  @Input() value = '';
  @Input() disabled = false;
  @Input() title = 'Keyboard';
  @Output() valueChange = new EventEmitter<string>();
  @Output() enter = new EventEmitter<void>();

  readonly rows: KeyboardKey[][] = [
    [
      { code: '`', label: '`', shiftLabel: '~' },
      { code: '1', label: '1', shiftLabel: '!' },
      { code: '2', label: '2', shiftLabel: '@' },
      { code: '3', label: '3', shiftLabel: '#' },
      { code: '4', label: '4', shiftLabel: '$' },
      { code: '5', label: '5', shiftLabel: '%' },
      { code: '6', label: '6', shiftLabel: '^' },
      { code: '7', label: '7', shiftLabel: '&' },
      { code: '8', label: '8', shiftLabel: '*' },
      { code: '9', label: '9', shiftLabel: '(' },
      { code: '0', label: '0', shiftLabel: ')' },
      { code: '-', label: '-', shiftLabel: '_' },
      { code: '=', label: '=', shiftLabel: '+' },
      { code: 'BKSP', label: 'Backspace', action: 'bksp', width: 'xwide' }
    ],
    [
      { code: 'TAB', label: 'Tab', action: 'tab', width: 'wide' },
      { code: 'q', label: 'q' },
      { code: 'w', label: 'w' },
      { code: 'e', label: 'e' },
      { code: 'r', label: 'r' },
      { code: 't', label: 't' },
      { code: 'y', label: 'y' },
      { code: 'u', label: 'u' },
      { code: 'i', label: 'i' },
      { code: 'o', label: 'o' },
      { code: 'p', label: 'p' },
      { code: '[', label: '[', shiftLabel: '{' },
      { code: ']', label: ']', shiftLabel: '}' },
      { code: '\\', label: '\\', shiftLabel: '|' }
    ],
    [
      { code: 'CAPS', label: 'Caps', action: 'caps', width: 'xwide' },
      { code: 'a', label: 'a' },
      { code: 's', label: 's' },
      { code: 'd', label: 'd' },
      { code: 'f', label: 'f' },
      { code: 'g', label: 'g' },
      { code: 'h', label: 'h' },
      { code: 'j', label: 'j' },
      { code: 'k', label: 'k' },
      { code: 'l', label: 'l' },
      { code: ';', label: ';', shiftLabel: ':' },
      { code: '\'', label: '\'', shiftLabel: '"' },
      { code: 'ENTER', label: 'Enter', action: 'enter', width: 'xwide' }
    ],
    [
      { code: 'SHIFT', label: 'Shift', action: 'shift', width: 'xwide' },
      { code: 'z', label: 'z' },
      { code: 'x', label: 'x' },
      { code: 'c', label: 'c' },
      { code: 'v', label: 'v' },
      { code: 'b', label: 'b' },
      { code: 'n', label: 'n' },
      { code: 'm', label: 'm' },
      { code: ',', label: ',', shiftLabel: '<' },
      { code: '.', label: '.', shiftLabel: '>' },
      { code: '/', label: '/', shiftLabel: '?' },
      { code: 'CLEAR', label: 'Clear', action: 'clear', width: 'wide' }
    ],
    [
      { code: 'CTRL', label: 'Ctrl', action: 'ctrl', width: 'wide' },
      { code: 'ALT', label: 'Alt', action: 'alt', width: 'wide' },
      { code: 'SPACE', label: 'Space', action: 'space', width: 'space' },
      { code: 'ALT_R', label: 'Alt', action: 'alt', width: 'wide' },
      { code: 'CTRL_R', label: 'Ctrl', action: 'ctrl', width: 'wide' }
    ]
  ];

  isShiftOn = false;
  isCapsOn = false;
  isCtrlOn = false;
  isAltOn = false;

  constructor() {}

  ngOnInit(): void {}
  pressedKeyCode: string | null = null;
  private pressedKeyTimer: ReturnType<typeof setTimeout> | null = null;

  onKeyTap(key: KeyboardKey): void {
    if (this.disabled) {
      return;
    }

    this.flashKey(key.code);

    switch (key.action || 'char') {
      case 'shift':
        this.isShiftOn = !this.isShiftOn;
        return;
      case 'caps':
        this.isCapsOn = !this.isCapsOn;
        return;
      case 'ctrl':
        this.isCtrlOn = !this.isCtrlOn;
        return;
      case 'alt':
        this.isAltOn = !this.isAltOn;
        return;
      case 'tab':
        this.updateValue(this.value + '\t');
        this.resetTransientModifiers();
        return;
      case 'bksp':
        this.updateValue(this.value.slice(0, -1));
        return;
      case 'space':
        this.updateValue(this.value + ' ');
        this.resetTransientModifiers();
        return;
      case 'clear':
        this.updateValue('');
        this.resetTransientModifiers();
        return;
      case 'enter':
        this.enter.emit();
        this.resetTransientModifiers();
        return;
      default:
        this.updateValue(this.value + this.resolveKey(key));
        this.resetTransientModifiers();
    }
  }

  getVisibleKey(key: KeyboardKey): string {
    return this.resolveKey(key);
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
  isActiveKey(key: KeyboardKey): boolean {
    return (
      (key.action === 'shift' && this.isShiftOn) ||
      (key.action === 'caps' && this.isCapsOn) ||
      (key.action === 'ctrl' && this.isCtrlOn) ||
      (key.action === 'alt' && this.isAltOn)
    );
  }

  getWidthClass(key: KeyboardKey): string {
    switch (key.width || 'normal') {
      case 'wide':
        return 'vk-key-wide';
      case 'xwide':
        return 'vk-key-xwide';
      case 'space':
        return 'vk-key-space';
      default:
        return '';
    }
  }

  private resolveKey(key: KeyboardKey): string {
    const label = this.isShiftOn && key.shiftLabel ? key.shiftLabel : key.label;

    if (!/^[a-z]$/i.test(label)) {
      return label;
    }

    const uppercase = this.isShiftOn !== this.isCapsOn;
    return uppercase ? label.toUpperCase() : label.toLowerCase();
  }

  private updateValue(nextValue: string): void {
    this.value = nextValue;
    this.valueChange.emit(this.value);
  }

  private resetTransientModifiers(): void {
    this.isShiftOn = false;
    this.isCtrlOn = false;
    this.isAltOn = false;
  }

}