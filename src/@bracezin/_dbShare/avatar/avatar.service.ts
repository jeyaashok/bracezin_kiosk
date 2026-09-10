import { map } from 'rxjs/operators';
import { Injectable, Pipe } from '@angular/core';

@Injectable({
    providedIn: 'root',
})

export class AvatarService {

    randomGifImage(type = 'leads'): string {
        let min = 1;
        let max = 50;
        if (type === 'agents') { max = 18; }
        if (type === 'leads') { max = 21 }
        let index = Math.floor(Math.random() * (max - min + 1) + min);
        let output: string = 'images/avatars/leads/' + String(index) + '.gif';
        if (type === 'agents') {
            output = 'images/avatars/agents/' + String(index) + '.gif';
        }
        return output;
    }

    checkNouser(url: string, type: string = 'leads'): string {
        if (!url || url === '' || url === null || url.indexOf("nouser.jpg") > -1 || url.indexOf("no_user.jpg") > -1) {
            url = this.randomGifImage(type);
        }
        return url;
    }


    CDN_SCRM = 'https://dmn80g3aplp9l.cloudfront.net/';
    CDN_OCTBH = 'https://cdn.ai-octopus.com/';

    S3_TO_CDN: Record<string, string> = {
        'https://scrmwapp.s3.us-east-1.amazonaws.com/': this.CDN_SCRM,
        'https://scrmwapp.s3.amazonaws.com/': this.CDN_SCRM,
        'https://octbh.s3.me-south-1.amazonaws.com/': this.CDN_OCTBH,
    };

    // mapS3UrlToCdn(imageUrl: string): string {
    //     for (const [s3Base, cdnBase] of Object.entries(this.S3_TO_CDN)) {
    //         if (imageUrl.startsWith(s3Base)) {
    //             return imageUrl.replace(s3Base, cdnBase);
    //         }
    //     }
    //     return imageUrl;
    // }

    mapS3UrlToCdn(imageUrl?: string | null): string | null {
        if (!imageUrl || typeof imageUrl !== 'string') {
            return null;
        }

        const match = Object.entries(this.S3_TO_CDN)
            .find(([s3Base]) => imageUrl.startsWith(s3Base));

        return match
            ? imageUrl.replace(match[0], match[1])
            : imageUrl;
    }


}

