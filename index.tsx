/// <reference path="./global.d.ts" />

let globalMangleUrls = false;

export function setMangleUrls(value: boolean): void {
  globalMangleUrls = value;
}

function escapeName(name: string, mangleUrls = globalMangleUrls): string {
  if (mangleUrls) {
    return name.replace(/\./g, "․");
  }

  return name;
}

export function Heading({ children }: { children: JSX.Children }) {
  return (
    <Paragraph>
      <b>
        <u>{children}</u>:
      </b>
    </Paragraph>
  );
}

export function Paragraph({ children }: { children: JSX.Children }) {
  return (
    <>
      {children}
      {"\n"}
    </>
  );
}

export function Ul({ children }: { children: Iterable<JSX.Child> }) {
  return (
    <>
      {[...children].filter(Boolean).map((value) => (
        <Paragraph>
          <i>•</i> {value}
        </Paragraph>
      ))}
    </>
  );
}

export function Ol({
  children,
  alignIndexes = true
}: {
  children: Iterable<JSX.Child>;
  alignIndexes?: boolean;
}) {
  return (
    <>
      {[...children].filter(Boolean).map((value, index, array) => {
        let indexText = (index + 1).toString();
        if (alignIndexes) {
          indexText = indexText.padStart(
            (array.length - 1).toString().length,
            "0"
          );
        }

        return (
          <Paragraph>
            <code>{indexText}</code>. {value}
          </Paragraph>
        );
      })}
    </>
  );
}

type NumberLike = number | bigint | { toBigInt(): bigint };

function isNumberLike(value: unknown): value is NumberLike {
  return (
    typeof value === "number" ||
    typeof value === "bigint" ||
    (typeof value === "object" && !!value && "toBigInt" in value)
  );
}

function toNumber(value: NumberLike): bigint | number {
  if (typeof value === "number" || typeof value === "bigint") {
    return value;
  }

  return value.toBigInt();
}

export type MentionSubject =
  | { id: NumberLike; first_name: string; last_name?: string }
  | { id: NumberLike; title: string }
  | NumberLike
  | string;

export function Mention({
  subject: entity = 0 as MentionSubject,
  customName = undefined as string | undefined,
  ping = true,
  mangleUrls = globalMangleUrls
}) {
  const wrap = (id: NumberLike, name: string) => {
    id = toNumber(id);

    const displayName = escapeName(
      customName || name || `👤 Entity №${id}`,
      mangleUrls
    );

    if (!ping) {
      return <>{displayName}</>;
    }

    return <a href={`tg://user?id=${id}`}>{displayName}</a>;
  };

  if (isNumberLike(entity)) {
    const value = toNumber(entity);
    return wrap(value, `👤 Entity №${value}`);
  } else if (typeof entity === "string") {
    const displayName = escapeName(customName || `@${entity}`, mangleUrls);

    if (!ping) {
      return <>{displayName}</>;
    }

    return <a href={`https://t.me/${entity}`}>{displayName}</a>;
  } else if (typeof entity === "object" && entity && "first_name" in entity) {
    return wrap(
      entity.id,
      `${entity.first_name} ${entity.last_name || ""}`.trim() ||
        `👤 Entity №${entity.id}`
    );
  } else if (typeof entity === "object" && entity && "title" in entity) {
    return wrap(entity.id, entity.title.trim());
  } else {
    return <>{customName || `👤 Unknown`}</>;
  }
}

export function Code({
  children,
  multiline = children.toString().includes("\n"),
  language
}: {
  language?: string;
  multiline?: boolean;
} & JSX.WithChildren<string>) {
  if (language) {
    return (
      <pre>
        <code class={`language-${language}`}>{children}</code>
      </pre>
    );
  }

  if (multiline) {
    return <pre>{children}</pre>;
  }

  return <code>{children}</code>;
}

export function Text({
  italic = false,
  bold = false,
  underline = false,
  strike = false,
  spoiler = false,
  children = [] as JSX.Children
}) {
  let element = <>{children}</>;

  if (italic) {
    element = <i>{element}</i>;
  }

  if (bold) {
    element = <b>{element}</b>;
  }

  if (underline) {
    element = <u>{element}</u>;
  }

  if (strike) {
    element = <s>{element}</s>;
  }

  if (spoiler) {
    element = <tg-spoiler>{element}</tg-spoiler>;
  }

  return element;
}

type NotificationProperties = {
  emoji?: string;
  message: string;
  subject?: MentionSubject;
  success?: boolean;
  error?: boolean;
  comma?: boolean;
  mangleUrls?: boolean;
} & Partial<JSX.WithChildren>;

export function Notification({
  emoji = "⚠️",
  message,
  subject,
  children = [],
  success,
  error,
  comma = true,
  mangleUrls = globalMangleUrls
}: NotificationProperties) {
  if (success) {
    emoji = "✅";
  }

  if (error) {
    emoji = "🛑";
  }

  return (
    <>
      <b>
        {emoji}
        {" • "}
        {subject ? (
          <>
            <Mention subject={subject} mangleUrls={mangleUrls} />
            {comma ? ", " : " "}
          </>
        ) : null}
        {message}
      </b>{" "}
      {children}
    </>
  );
}
