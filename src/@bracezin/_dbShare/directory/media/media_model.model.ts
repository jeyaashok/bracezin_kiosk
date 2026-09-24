import { AvatarService } from 'src/@bracezin/_dbShare/avatar';
import { Media } from 'src/@bracezin/_dbShare/directory/media';

export class MediaModel extends AvatarService {
    id: string | number;
	user_id: number;
	resource_id: number;
	resource_type: string;
	model_id: number;
	model_type: string;
	shared_by: number;
	document_type: string;
	name: string;
	filename: string;
	location: string;
	dirname: string;
	mime: string;
	size: number;
	fileSize?: string;
	extension: string;
	etag: string;
	disk: string;
	url: string;
	thumb_url?: string;
	type: string;
	is_active: boolean;
	is_primary: boolean;
    is_favorite: boolean;
    is_local_server: boolean;
	created_by?: number;
	updated_by?: number;
	created_at?: Date;
	updated_at?: Date;

	tableName?: string;
    sharedByName?: string;

    /**
     * media
     *
     * @param media
     */
    constructor(media, additional: any = null) {
        super();

        this.id = media.id || null;
        this.user_id = media.user_id || null;
        this.resource_id = media.resource_id || null;
        this.resource_type = media.resource_type || null;
        this.model_id = media.model_id || null;
        this.model_type = media.model_type || null;
        this.shared_by = media.shared_by || null;
        this.document_type = media.document_type || null;
        this.name = media.name || null;
        this.filename = media.filename || null;

        this.location = media.location || null;
        this.dirname = media.dirname || null;
        this.mime = media.mime || null;
        this.size = media.size || 0;
        this.fileSize = media?.fileSize || this.formatSizeFromKB(media.size || 0) || null;
        this.extension = media.extension || null;
        this.etag = media.etag || null;
        this.disk = media.disk || 'local';
        this.url =  media.url || null;
        this.thumb_url =  media?.thumb_url || null;
        this.type = media.type || null;
        this.is_active = media.is_active || true;
        this.is_primary = media.is_primary || true;
        this.is_favorite = media.is_favorite || false;
        this.is_local_server = media.is_local_server || false;
        this.created_by = media.created_by || null;
        this.updated_by = media.updated_by || null;
        this.created_at = media.created_at || null;
        this.updated_at = media.updated_at || null;

        this.tableName = media.tableName || null;
        this.sharedByName = media.sharedByName || null;
    }

    formatSizeFromKB(kb: any): string {
        if (kb === undefined || kb === null || isNaN(kb)) {
            return '0 KB';
        }
        kb = Number(kb);
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
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
		datas = (datas && datas.length < 1 && response && response.data && response.data.data && response.data.data.length > 0) ? response.data.data : datas;
        let additional = (response && response.additional) ? response.additional : null;
        let items: Media[] = [];
        if (datas && datas.length > 0) {
            for (let i = 0; i <= datas.length; i++) {
                let item = datas[i];
                if (item && item.id) {
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
