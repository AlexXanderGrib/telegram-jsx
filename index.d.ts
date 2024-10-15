/// <reference path="./global.d.ts" />
export declare function setMangleUrls(value: boolean): void;
export declare function Heading({ children }: {
    children: JSX.Children;
}): JSX.Element;
export declare function Paragraph({ children }: {
    children: JSX.Children;
}): JSX.Element;
export declare function Ul({ children }: {
    children: Iterable<JSX.Child>;
}): JSX.Element;
export declare function Ol({ children, alignIndexes }: {
    children: Iterable<JSX.Child>;
    alignIndexes?: boolean;
}): JSX.Element;
type NumberLike = number | bigint | {
    toBigInt(): number;
};
export type MentionSubject = {
    id: NumberLike;
    first_name: string;
    last_name?: string;
} | {
    id: NumberLike;
    title: string;
} | NumberLike | string;
export declare function Mention({ subject: entity, customName, ping, mangleUrls }: {
    subject?: MentionSubject | undefined;
    customName?: string | undefined;
    ping?: boolean | undefined;
    mangleUrls?: boolean | undefined;
}): JSX.Element;
export declare function Code({ children, multiline, language }: {
    language?: string;
    multiline?: boolean;
} & JSX.WithChildren<string>): JSX.Element;
export declare function Text({ italic, bold, underline, strike, spoiler, children }: {
    italic?: boolean | undefined;
    bold?: boolean | undefined;
    underline?: boolean | undefined;
    strike?: boolean | undefined;
    spoiler?: boolean | undefined;
    children?: JSX.Children;
}): JSX.Element;
type NotificationProperties = {
    emoji?: string;
    message: string;
    subject?: MentionSubject;
    success?: boolean;
    error?: boolean;
    comma?: boolean;
    mangleUrls?: boolean;
} & Partial<JSX.WithChildren>;
export declare function Notification({ emoji, message, subject, children, success, error, comma, mangleUrls }: NotificationProperties): JSX.Element;
export {};
