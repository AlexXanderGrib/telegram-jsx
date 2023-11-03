export declare function jsx(element: keyof JSX.IntrinsicElements | ((properties: Record<string, unknown>) => JSX.Element), properties: Record<string, unknown>): JSX.Element;
export { jsx as jsxs, jsx as jsxDEV };
export declare function Fragment(properties?: Partial<JSX.WithChildren>): JSX.Element;
