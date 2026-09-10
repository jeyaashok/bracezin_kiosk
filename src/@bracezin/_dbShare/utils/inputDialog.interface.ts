export interface InputDialog {
    title: string;
    message: string;
    type: string;
    for?: string;
    format?: string;
    options?: Array<any>;
    item?: any;
    items?: any;
}
