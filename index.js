'use strict';

const jsxRuntime = require('./jsx-runtime.js');

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
    return (jsxRuntime.jsx(Paragraph, { children: jsxRuntime.jsx("b", { children: [jsxRuntime.jsx("u", { children: children }), ":"] }) }));
}
function Paragraph({ children }) {
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: [children, "\n"] }));
}
function Ul({ children }) {
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: [...children].filter(Boolean).map((value) => (jsxRuntime.jsx(Paragraph, { children: [jsxRuntime.jsx("i", { children: "\u2022" }), " ", value] }))) }));
}
function Ol({ children, alignIndexes = true }) {
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: [...children].filter(Boolean).map((value, index, array) => {
            let indexText = (index + 1).toString();
            if (alignIndexes) {
                indexText = indexText.padStart((array.length - 1).toString().length, "0");
            }
            return (jsxRuntime.jsx(Paragraph, { children: [jsxRuntime.jsx("code", { children: indexText }), ". ", value] }));
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
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: displayName });
        }
        return jsxRuntime.jsx("a", { href: `tg://user?id=${id}`, children: displayName });
    };
    if (isNumberLike(entity)) {
        const value = toNumber(entity);
        return wrap(value, `👤 Entity №${value}`);
    }
    else if (typeof entity === "string") {
        const displayName = escapeName(customName || `@${entity}`, mangleUrls);
        if (!ping) {
            return jsxRuntime.jsx(jsxRuntime.Fragment, { children: displayName });
        }
        return jsxRuntime.jsx("a", { href: `https://t.me/${entity}`, children: displayName });
    }
    else if (typeof entity === "object" && entity && "first_name" in entity) {
        return wrap(entity.id, `${entity.first_name} ${entity.last_name || ""}`.trim() ||
            `👤 Entity №${entity.id}`);
    }
    else if (typeof entity === "object" && entity && "title" in entity) {
        return wrap(entity.id, entity.title.trim());
    }
    else {
        return jsxRuntime.jsx(jsxRuntime.Fragment, { children: customName || `👤 Unknown` });
    }
}
function Code({ children, multiline = children.toString().includes("\n"), language }) {
    if (language) {
        return (jsxRuntime.jsx("pre", { children: jsxRuntime.jsx("code", { class: `language-${language}`, children: children }) }));
    }
    if (multiline) {
        return jsxRuntime.jsx("pre", { children: children });
    }
    return jsxRuntime.jsx("code", { children: children });
}
function Text({ italic = false, bold = false, underline = false, strike = false, spoiler = false, children = [] }) {
    let element = jsxRuntime.jsx(jsxRuntime.Fragment, { children: children });
    if (italic) {
        element = jsxRuntime.jsx("i", { children: element });
    }
    if (bold) {
        element = jsxRuntime.jsx("b", { children: element });
    }
    if (underline) {
        element = jsxRuntime.jsx("u", { children: element });
    }
    if (strike) {
        element = jsxRuntime.jsx("s", { children: element });
    }
    if (spoiler) {
        element = jsxRuntime.jsx("tg-spoiler", { children: element });
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
    return (jsxRuntime.jsx(jsxRuntime.Fragment, { children: [jsxRuntime.jsx("b", { children: [emoji, " • ", subject ? (jsxRuntime.jsx(jsxRuntime.Fragment, { children: [jsxRuntime.jsx(Mention, { subject: subject, mangleUrls: mangleUrls }), comma ? ", " : " "] })) : null, message] }), " ", children] }));
}

exports.Code = Code;
exports.Heading = Heading;
exports.Mention = Mention;
exports.Notification = Notification;
exports.Ol = Ol;
exports.Paragraph = Paragraph;
exports.Text = Text;
exports.Ul = Ul;
exports.setMangleUrls = setMangleUrls;
