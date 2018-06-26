
export enum PinType {
    DomainExact,
    DomainMatch,
    UrlExact,
    UrlMatch,
}

export type PinDefinition =
    | {
          type: PinType.DomainExact | PinType.UrlExact;
          value: string;
      }
    | {
          type: PinType.DomainMatch | PinType.UrlMatch;
          value: RegExp;
      };

export interface IOptions {
    updateEvent: 'loading' | 'complete';
    rules: PinDefinition[];
}
