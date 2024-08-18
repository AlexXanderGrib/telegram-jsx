/// <reference path="./global.d.ts" />

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

export type MentionSubject =
  | { id: number | bigint; first_name: string; last_name?: string }
  | { id: number | bigint; title: string }
  | number
  | bigint
  | string;

export function Mention({
  subject: entity = 0 as MentionSubject,
  customName = undefined as string | undefined,
  ping = true
}) {
  const wrap = (id: number | string | bigint, name: string) => {
    const displayName = customName || name || `👤 Entity №${id}`;
    if (!ping) {
      return <>{displayName}</>;
    }

    return <a href={`tg://user?id=${id}`}>{displayName}</a>;
  };

  if (typeof entity === "string") {
    const displayName = customName || `@${entity}`;

    if (!ping) {
      return <>{displayName}</>;
    }

    return <a href={`https://t.me/${entity}`}>{displayName}</a>;
  }

  if (typeof entity === "number" || typeof entity === "bigint") {
    return wrap(entity, `👤 Entity №${entity}`);
  }

  if (typeof entity === "object" && entity && "first_name" in entity) {
    return wrap(
      entity.id,
      `${entity.first_name} ${entity.last_name || ""}`.trim() ||
        `👤 Entity №${entity.id}`
    );
  }

  if (typeof entity === "object" && entity && "title" in entity) {
    return wrap(entity.id, entity.title.trim());
  }

  return <>{customName || `👤 Unknown`}</>;
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
} & Partial<JSX.WithChildren>;

export function Notification({
  emoji = "⚠️",
  message,
  subject,
  children = [],
  success,
  error,
  comma = true
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
            <Mention subject={subject} />
            {comma ? ", " : " "}
          </>
        ) : null}
        {message}
      </b>{" "}
      {children}
    </>
  );
}
