import { PinDefinition, PinType, IOptions } from './types';

export function shouldPin(def: PinDefinition, url: URL): boolean {
    switch (def.type) {
        case PinType.UrlExact:
            return url.toString() === def.value;

        case PinType.DomainExact:
            return url.hostname === def.value;

        case PinType.UrlMatch:
            return def.value.test(url.toString());

        case PinType.DomainMatch:
            return def.value.test(url.hostname);
    }
}

const defaultOptions: IOptions = {
    updateEvent: 'complete',
    rules: [
    ],
};

// Default to sync storage for now
export function getOptions(): Promise<IOptions> {
    return new Promise<IOptions>(resolve => {
        chrome.storage.sync.get(
            ['options'],
            (result: { options: IOptions }) => {
                if (result && result.options) {
                    resolve(result.options);
                } else {
                    resolve(defaultOptions);
                }
            },
        );
    });
}
