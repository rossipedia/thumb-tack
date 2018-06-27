export enum PinType {
    DomainExact,
    DomainMatch,
    UrlExact,
    UrlMatch,
}

export interface PinDefinition {
    type: PinType;
    value: string;
}

export interface IOptions {
    updateEvent: 'loading' | 'complete';
    rules: PinDefinition[];
}

export function shouldPin(def: PinDefinition, url: URL): boolean {
    switch (def.type) {
        case PinType.UrlExact:
            return url.toString() === def.value;

        case PinType.DomainExact:
            return url.hostname === def.value;

        case PinType.UrlMatch:
            return new RegExp(def.value).test(url.toString());

        case PinType.DomainMatch:
            return new RegExp(def.value).test(url.hostname);
    }
}

const normalizeExpression = (expr:string|RegExp) =>
    String(expr).replace(/^\/|\/$/g, '');

const defaultOptions: IOptions = {
    updateEvent: 'loading',
    rules: [],
};

// Default to sync storage for now
export function getOptions(): Promise<IOptions> {
    return new Promise<IOptions>(resolve => {
        chrome.storage.sync.get(
            ['options'],
            (result: { options: IOptions }) => {
                if (result && result.options) {
                    console.log(`Got options:`, result.options)
                    resolve(result.options);
                } else {
                    resolve(defaultOptions);
                }
            },
        );
    });
}

export function storeOptions(options: IOptions) {
    return new Promise(resolve => {
        chrome.storage.sync.set({ options }, resolve);
    });
}
