import { jsx, Fragment } from './jsx-runtime.mjs';

/// <reference path="./global.d.ts" />
function Heading({ children }) {
    return (jsx(Paragraph, { children: jsx(Text, { bold: true, underline: true, children: [children, ":"] }) }));
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
function Mention({ subject: entity = 0, customName = undefined, ping = true }) {
    const wrap = (id, name) => {
        const displayName = customName || name || `👤 Entity №${id}`;
        if (!ping) {
            return jsx(Fragment, { children: displayName });
        }
        return jsx("a", { href: `tg://user?id=${id}`, children: displayName });
    };
    if (typeof entity === "string") {
        const displayName = customName || `@${entity}`;
        if (!ping) {
            return jsx(Fragment, { children: displayName });
        }
        return jsx("a", { href: `https://t.me/${entity}`, children: displayName });
    }
    if (typeof entity === "number" || typeof entity === "bigint") {
        return wrap(entity, `👤 Entity №${entity}`);
    }
    if (typeof entity === "object" && entity && "first_name" in entity) {
        return wrap(entity.id, `${entity.first_name} ${entity.last_name || ""}`.trim() ||
            `👤 Entity №${entity.id}`);
    }
    if (typeof entity === "object" && entity && "title" in entity) {
        return wrap(entity.id, entity.title.trim());
    }
    return jsx(Fragment, { children: customName || `👤 Unknown` });
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
function Notification({ emoji = "⚠️", message, subject, children = [], success, error, comma = true }) {
    if (success) {
        emoji = "✅";
    }
    if (error) {
        emoji = "🛑";
    }
    return (jsx(Fragment, { children: [jsx("b", { children: [emoji, " • ", subject ? (jsx(Fragment, { children: [jsx(Mention, { subject: subject }), comma ? ", " : " "] })) : null, message] }), " ", children] }));
}

export { Code, Heading, Mention, Notification, Ol, Paragraph, Text, Ul };
