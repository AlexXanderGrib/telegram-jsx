const CHILDREN_KEY = "children";
function stringifyAttributes(attributes) {
    return Object.keys(attributes)
        .filter((key) => key !== CHILDREN_KEY)
        .map((key) => `${key}="${attributes[key]}"`)
        .join(" ");
}
function stringifyAndPad(attributes) {
    const text = stringifyAttributes(attributes);
    if (!text) {
        return "";
    }
    return ` ${text}`;
}
class Element {
    constructor(contents) {
        this._contents = contents;
        Object.freeze(this);
    }
    toString() {
        return this._contents;
    }
}
function escape(html) {
    return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/, "&gt;");
}
function stringifyChildren(children) {
    const parts = [];
    for (const value of [children].flat(2)) {
        if (value === false || value === null || value === undefined) {
            continue;
        }
        let string = String(value);
        if (!(value instanceof Element)) {
            string = escape(string);
        }
        parts.push(string);
    }
    return parts.join("");
}
function jsx(element, properties) {
    if (typeof element === "function") {
        return element(properties);
    }
    const content = CHILDREN_KEY in properties
        ? stringifyChildren(properties[CHILDREN_KEY])
        : "";
    if (content) {
        return new Element(`<${element}${stringifyAndPad(properties)}>${content}</${element}>`);
    }
    return new Element(`<${element}${stringifyAndPad(properties)} />`);
}
function Fragment(properties = {}) {
    return new Element(stringifyChildren(properties.children));
}

export { Fragment, jsx, jsx as jsxDEV, jsx as jsxs };
