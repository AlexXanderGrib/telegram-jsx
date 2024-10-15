declare namespace JSX {
  interface ElementChildrenAttribute {
    children: {};
  }

  interface Element {
    readonly _brand: "jsx.element";
    toString(): string;
  }

  type Primitive = string | boolean | number | null | undefined;
  type Child = Primitive | Element;
  type Children = Child | Child[];
  type PrimitiveChild = Primitive | Primitive[];
  type WithChildren<T extends Children = Children> = {
    [key in keyof ElementChildrenAttribute]: T;
  };

  interface IntrinsicElements {
    b: WithChildren;
    strong: WithChildren;
    em: WithChildren;
    i: WithChildren;
    u: WithChildren;
    ins: WithChildren;
    s: WithChildren;
    strike: WithChildren;
    del: WithChildren;
    span: { class: "tg-spoiler" } & WithChildren;
    "tg-spoiler": WithChildren;
    "tg-emoji": { "emoji-id": bigint | string } & WithChildren<string>;
    a: { href: string } & WithChildren;
    code: { class?: `language-${string}` } & WithChildren<PrimitiveChild>;
    pre: WithChildren;
    blockquote: WithChildren & { expandable?: boolean };
  }
}
