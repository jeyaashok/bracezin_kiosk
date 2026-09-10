import { Pipe, PipeTransform } from '@angular/core';

export interface SlugifyPipeOptions {
    unique?: boolean;
    uniqueOptions?: {
        randomLength?: number;
        chars?: Array<'lowercase' | 'uppercase' | 'numeric' | 'special'>;
        separator?: string;
    };
    seperateBy?: string;
}

export enum CharTypesEnum {
    lowercase = 'a',
    uppercase = 'A',
    numeric = '#',
    special = '!'
}

@Pipe({ name: 'slugify' })
export class SlugifyPipe implements PipeTransform {
    transform(input: string, slugifyOptions?: SlugifyPipeOptions): string {

        // Default values
        const unique = slugifyOptions && slugifyOptions.unique || false;
        const uniqueOptions = unique && slugifyOptions.uniqueOptions;
        const { chars, randomLength, separator } = {
            randomLength: (uniqueOptions && uniqueOptions.randomLength) || 6,
            chars: (uniqueOptions && uniqueOptions.chars) || ["lowercase", "numeric"],
            separator: uniqueOptions.separator || '-'
        };
        const seperateBy = slugifyOptions && slugifyOptions.seperateBy || '-';

        let randomChars: string = '';
        unique && chars.map(char => randomChars += CharTypesEnum[char])

        const trChars = {
            'áÁ': 'a',
            'éÉ': 'e',
            'íÍ': 'i',
            'óÓ': 'o',
            'úÚ': 'u',
            'ñÑ': 'n'
        };
        for (const key of Object.keys(trChars)) {
            input = input.replace(new RegExp('[' + key + ']', 'g'), trChars[key]);
        }
        return input
            .toString()
            .toLowerCase()
            .replace(/[^\w-]+/g, ' ')
            .replace(/-+$/, '')
            .replace(/^-+/, '')
            .replace(/--+/g, '')
            .trim()
            .replace(/\s+/g, seperateBy)
            .concat(unique ? separator + this.randomString(randomLength, randomChars) : '');
    }

    private randomString(length: number, chars: string) {
        let result = '';
        let mask = '';
        if (chars.indexOf('a') > -1) mask += 'abcdefghijklmnopqrstuvwxyz';
        if (chars.indexOf('A') > -1) mask += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (chars.indexOf('#') > -1) mask += '0123456789';
        if (chars.indexOf('!') > -1) mask += '~`!@#$%^&*()_+-={}[]:";\'<>?,./|\\';

        for (let i = length; i > 0; --i)
            result += mask[Math.floor(Math.random() * mask.length)];
        return result;
    }
}
