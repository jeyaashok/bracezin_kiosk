import { UnreadCount } from 'src/@bracezin/_dbShare/notify';

export class UnreadCountModel {
    name: string;
    site?: string;
    count?: number;

    /**
     * Constructor
     *
     * @param unreadCount
     */
    constructor(unreadCount, additional: any = null) {
            this.name = unreadCount.name || null;
            this.site = unreadCount.site || null;
            this.count = unreadCount.count || 0;
    }
}


export class UnreadCountMapModel {
    data: any;

    /** Constructor */
    constructor(response) {

        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
        let additional = (response && response.additional) ? response.additional : null;
        let items: UnreadCount[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
                    items[i] = new UnreadCountModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}
