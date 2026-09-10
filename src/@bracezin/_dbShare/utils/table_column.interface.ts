export interface TableColumn {
    label: string;
    property: string;
    type: 'text' | 'image' | 'badge' | 'progress' | 'checkbox' | 'button' | 'toggle' | 'icon' | 'date' | 'other';
    value?: string;
    subvalue?: string;
    subvalue2?: string;
    visible?: boolean;
    cssClasses?: string[];
}
