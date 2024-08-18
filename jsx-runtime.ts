const CHILDREN_KEY: keyof JSX.ElementChildrenAttribute = "children";

function stringifyAttributes(attributes: Record<string, unknown>) {
  return Object.keys(attributes)
    .filter((key) => key !== CHILDREN_KEY)
    .map((key) => `${key}="${attributes[key]}"`)
    .join(" ");
}

function stringifyAndPad(attributes: Record<string, unknown>) {
  const text = stringifyAttributes(attributes);

  if (!text) {
    return "";
  }

  return ` ${text}`;
}

class Element implements JSX.Element {
  get _brand(): 'jsx.element' {
    return 'jsx.element'
  }

  readonly _contents: string;

  constructor(contents: string) {
    this._contents = contents;
    Object.freeze(this);
  }

  toString(): string {
    return this._contents;
  }
}

function escape(html: string): string {
  return html.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/, "&gt;");
}

function stringifyChildren(children: JSX.Children): string {
  const parts: string[] = [];

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

export function jsx(
  element:
    | keyof JSX.IntrinsicElements
    | ((properties: Record<string, unknown>) => JSX.Element),
  properties: Record<string, unknown>
): JSX.Element {
  if (typeof element === "function") {
    return element(properties);
  }

  const content =
    CHILDREN_KEY in properties
      ? stringifyChildren(properties[CHILDREN_KEY] as JSX.Children)
      : "";

  if (content) {
    return new Element(
      `<${element}${stringifyAndPad(properties)}>${content}</${element}>`
    );
  }

  return new Element(`<${element}${stringifyAndPad(properties)} />`);
}

export { jsx as jsxs, jsx as jsxDEV };

export function Fragment(
  properties: Partial<JSX.WithChildren> = {}
): JSX.Element {
  return new Element(stringifyChildren(properties.children));
}
