## Commands

- `npm run dev` / `astro dev` — start dev server (localhost:4321)
- `npm run build` — production build to `./dist/`
- No lint, typecheck, test, or formatter scripts are configured.

When starting the dev server in this environment, use background mode:

```
astro dev --background
```

Manage with `astro dev stop`, `astro dev status`, `astro dev logs`.

## Environment

- Node >= 22.12.0 (enforced in `package.json` `engines`)
- TypeScript: `astro/tsconfigs/strict`
- No framework integrations (React, Vue, Tailwind, etc.) are installed yet. Add via `astro add` before using.

## Documentation

Full docs: https://docs.astro.build
