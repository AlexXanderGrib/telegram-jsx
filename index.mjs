import { jsx, Fragment } from './jsx-runtime.mjs';

/// <reference path="./global.d.ts" />
let globalMangleUrls = false;
function setMangleUrls(value) {
    globalMangleUrls = value;
}
function escapeName(name, mangleUrls = globalMangleUrls) {
    if (mangleUrls) {
        return name.replace(/\./g, "․");
    }
    return name;
}
function Heading({ children }) {
    return (jsx(Paragraph, { children: jsx("b", { children: [jsx("u", { children: children }), ":"] }) }));
}
function Paragraph({ children }) {
    return (jsx(Fragment, { children: [children, "\n"] }));
}
function Ul({ children }) {
    return (jsx(Fragment, { children: [...children].filter(Boolean).map((value) => (jsx(Paragraph, { children: [jsx("i", { children: "\u2022" }), " ", value] }))) }));
}
function Ol({ children, alignIndexes = true }) {
    return (jsx(Fragment, { children: [...children].filter(Boolean).map((value, index, array) => {
            let indexText = (index + 1).toString();
            if (alignIndexes) {
                indexText = indexText.padStart((array.length - 1).toString().length, "0");
            }
            return (jsx(Paragraph, { children: [jsx("code", { children: indexText }), ". ", value] }));
        }) }));
}
function isNumberLike(value) {
    return (typeof value === "number" ||
        typeof value === "bigint" ||
        (typeof value === "object" && !!value && "toBigInt" in value));
}
function toNumber(value) {
    if (typeof value === "number" || typeof value === "bigint") {
        return value;
    }
    return value.toBigInt();
}
function Mention({ subject: entity = 0, customName = undefined, ping = true, mangleUrls = globalMangleUrls }) {
    const wrap = (id, name) => {
        id = toNumber(id);
        const displayName = escapeName(customName || name || `👤 Entity №${id}`, mangleUrls);
        if (!ping) {
            return jsx(Fragment, { children: displayName });
        }
        return jsx("a", { href: `tg://user?id=${id}`, children: displayName });
    };
    if (isNumberLike(entity)) {
        const value = toNumber(entity);
        return wrap(value, `👤 Entity №${value}`);
    }
    else if (typeof entity === "string") {
        const displayName = escapeName(customName || `@${entity}`, mangleUrls);
        if (!ping) {
            return jsx(Fragment, { children: displayName });
        }
        return jsx("a", { href: `https://t.me/${entity}`, children: displayName });
    }
    else if (typeof entity === "object" && entity && "first_name" in entity) {
        return wrap(entity.id, `${entity.first_name} ${entity.last_name || ""}`.trim() ||
            `👤 Entity №${entity.id}`);
    }
    else if (typeof entity === "object" && entity && "title" in entity) {
        return wrap(entity.id, entity.title.trim());
    }
    else {
        return jsx(Fragment, { children: customName || `👤 Unknown` });
    }
}
function Code({ children, multiline = children.toString().includes("\n"), language }) {
    if (language) {
        return (jsx("pre", { children: jsx("code", { class: `language-${language}`, children: children }) }));
    }
    if (multiline) {
        return jsx("pre", { children: children });
    }
    return jsx("code", { children: children });
}
function Text({ italic = false, bold = false, underline = false, strike = false, spoiler = false, children = [] }) {
    let element = jsx(Fragment, { children: children });
    if (italic) {
        element = jsx("i", { children: element });
    }
    if (bold) {
        element = jsx("b", { children: element });
    }
    if (underline) {
        element = jsx("u", { children: element });
    }
    if (strike) {
        element = jsx("s", { children: element });
    }
    if (spoiler) {
        element = jsx("tg-spoiler", { children: element });
    }
    return element;
}
function Notification({ emoji = "⚠️", message, subject, children = [], success, error, comma = true, mangleUrls = globalMangleUrls }) {
    if (success) {
        emoji = "✅";
    }
    if (error) {
        emoji = "🛑";
    }
    return (jsx(Fragment, { children: [jsx("b", { children: [emoji, " • ", subject ? (jsx(Fragment, { children: [jsx(Mention, { subject: subject, mangleUrls: mangleUrls }), comma ? ", " : " "] })) : null, message] }), " ", children] }));
}

export { Code, Heading, Mention, Notification, Ol, Paragraph, Text, Ul, setMangleUrls };
