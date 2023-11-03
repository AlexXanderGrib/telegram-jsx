# Telegram JSX

TSX/JSX runtime for telegram bots

## Installation

1. Run:
   ```bash
   npm install telegram-jsx
   ```
2. Set these properties in `tsconfig.json`
   ```json
   {
     "jsx": "react-jsx",
     "jsxImportSource": "telegram-jsx",
     "include": ["node_modules/telegram-jsx/index.d.ts"]
   }
   ```

## Usage

Now you can create components and use TSX

```tsx
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
```

```tsx
telegram.updates.on("message", (context) =>
  context.reply((<b>yoo!</b>).toString())
);
```
