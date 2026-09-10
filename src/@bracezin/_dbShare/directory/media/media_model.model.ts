import { AvatarService } from 'src/@bracezin/_dbShare/avatar';
import { Media } from 'src/@bracezin/_dbShare/directory/media';

export class MediaModel extends AvatarService {
    id: string | number;
    _id: string | number;
    user_id: number;
    client_id: number;
    name: string;
    file_name: string;
    mime: string;
    type: string;
    url: string;
    preview_url: string;
    size: string;
    is_active: boolean;
    is_favorite: boolean;
    shared_by: number;
    created_by?: number;
    updated_by?: number;
    created_at?: Date;
    updated_at?: Date;
    sharedWith: any;
    tableName?: string;
    sharedByName?: string;
    sharedId: number;
    extention?: any;
    favorite?: any;
    sizeData?: string;
    isSelected: boolean;
    isAccess: boolean
    createdBy: any;
    rawUrl: string;
    mediatags: any;

    /**
     * media
     *
     * @param media
     */
    constructor(media, additional: any = null) {
        super();
        
        let agents: Array<any> = (additional && additional.agents) ? additional.agents : [];
        let agent: any = (agents && agents.length > 0 && media && media.created_by) ? agents.filter(x => ((x.id) === (media.created_by)) ? true : false)[0] : null;

        var isFavorite = Array.isArray(media.favorite) ? media.favorite.length > 0 : Boolean(media.favorite);
        var user: any = JSON.parse(localStorage.getItem('tji_user'));
        let sizeInMB = this.formatSizeFromKB(media.size); // (media.size / 1024).toFixed(3);
        this.id = media.id || media?._id || null;
        this._id = media?._id || media.id || null;
        this.user_id = media.user_id || null;
        this.client_id = media.client_id || null;
        this.name = media.name || null;
        this.file_name = media.file_name || null;
        this.mime = media.mime || null;
        this.type = (media.type) ? this.getMediaType(media.type) : null;
        // this.type = media.type || null;
        this.rawUrl =  media.url ? media.url : null;
        this.url =  media.url ? this.mapS3UrlToCdn(media.url) : null;
        this.preview_url = media.preview_url || null;
        this.size = media.size || null;
        this.is_active = media.is_active || true;
        this.is_favorite = media.is_favorite || isFavorite || false;
        this.favorite = media.is_favorite || media.favorite || [];
        this.shared_by = media.shared_by || (media.sharedWith) ? media.sharedWith.length : 0 || null;
        this.created_by = media.created_by || null;
        this.updated_by = media.updated_by || null;
        this.created_at = media.created_at || null;
        this.updated_at = media.updated_at || null;
        this.sharedWith = media.sharedWith || null;
        this.sharedId = media.sharedId || null;
        this.extention = media.extention || null;
        this.sizeData = sizeInMB || "0";
        this.isSelected = media.isSelected || false;
        this.isAccess = this.isActiveUser(media, user)
        this.createdBy = agent?.name || null;
        this.mediatags = agent?.mediatags || null;
    }

    formatSizeFromKB(kb: any): string {
        if (kb === undefined || kb === null || isNaN(kb)) {
            return '0 KB';
        }
        kb = Number(kb);
        const units = ['KB', 'MB', 'GB', 'TB'];
        let unitIndex = 0;
        while (kb >= 1024 && unitIndex < units.length - 1) {
            kb /= 1024;
            unitIndex++;
        }
        return kb.toFixed(3) + ' ' + units[unitIndex];
    }


    getMediaType(type) {
        switch (type) {
            case 'image':
            case "JPEG": case "JPG":
            case "PNG": case "GIF":
            case "TIFF": case "RAW":
            case "jpeg": case "jpg":
            case "png": case "gif":
            case "tiff": case "raw":
            case "WebP": case "webp": case "WEBP":
                return 'image';
            case "document":
            case "DOC": case "DOCX":
            case "ODT": case "PDF":
            case "PPT": case "PPTX":
            case "TXT": case "XLS":
            case "XLSX": case "ZIP":
            case "CVS": case "vnd.ms-excel":
            case "doc": case "csv":
            case "docx": case "odt":
            case "pdf": case "pptx":
            case "text": case "xls":
            case "xlsx": case "zip": case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
            case "cvs": case "vnd.openxmlformats-officedocument.spreadsheetml.sheet":
            case "vnd.openxmlformats-officedocument.wordprocessingml.document":
                return 'document';
            case 'audio': case 'voice':
            case "MP3": case "WAV":
            case "AAC": case "FLAC":
            case "Ogg": case "Ogg Vorbis":
            case "PCM": case "MPEG":
            case "mp3": case "wav":
            case "aac": case "flac":
            case "ogg": case "mpeg":
            case "ogg vorbis": case "pcm":
            case "vnd.dlna.adts":
                return 'voice';
            case 'video':
            case "WEBM": case "MPG":
            case "MP2":
            case "MPE": case "MPV":
            case "MP4":
            case "AVI": case "WMV":
            case "MOV": case "QT":
            case "FLV": case "SWF":
            case "AVCHD":
            case "webm": case "mpg":
            case "mp2":
            case "mpe": case "mpv":
            case "mp4":
            case "avi": case "wmv":
            case "mov": case "qt":
            case "flv": case "swf":
            case "avchd": case "3gpp":
            case "3GPP":
                return 'video';
            default:
                return 'document';
        }
    }

    isActiveUser(item: any, user): boolean {
        if (user.person_type == 'client') {
            return false;
        } else if (item.created_by == user.person_id && user.person_type != 'client') {
            return false;
        } else if (item.shared_by == user.person_id && user.person_type != 'client') {
            return false;
        } else {
            return true;
        }
    }
}


export class MediaMapModel {
    data: any;

    /** Constructor */
    constructor(response) {
        let datas = (response && response.data && response.data.length > 0) ? response.data : [];
        let additional = (response && response.additional) ? response.additional : null;
        let items: Media[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item._id) {
                    items[i] = new MediaModel(datas[i], additional);
                }
            }
        }

        this.data = {};
        this.data.data = items;
    }
}


export class MediaPanelConfigModel {
    showCaption: boolean;
    showSelect: boolean;
    isChatMedia: boolean;

    /**
     * @param config
     */
    constructor(config) {
        this.showCaption = config.showCaption || true;
        this.showSelect = config.showSelect || false;
        this.isChatMedia = config.isChatMedia || false;
    }
}
