# yakiben

## Monorepo Structure

- `apps/customer`: Customer-facing Vue 3 + Vite + TS + Tailwind + PWA app
- `apps/admin`: Admin panel (Vue 3 + Vite + TS + Tailwind + PWA)

## Development

- Install dependencies: `yarn install`
- Run customer app: `yarn workspace customer dev`
- Run admin app: `yarn workspace admin dev`

## Routing for GitHub Pages

- Both apps use Vue Router in hash mode (`/#/route`) for static hosting compatibility.
- Vite `base` is set to `/customer/` and `/admin/` for correct asset paths.

## Deployment

- Both apps are built and deployed to GitHub Pages using GitHub Actions.
- See `.github/workflows/gh-pages.yml` for the deploy workflow.
- After deployment:
  - Customer app: `https://<username>.github.io/<repo>/customer/`
  - Admin app: `https://<username>.github.io/<repo>/admin/`

## PWA Support

- Both apps are configured as PWAs (offline support, installable on mobile, etc.).

## Shared Tooling

- ESLint, Prettier, Tailwind, TypeScript, Husky, and lint-staged are configured at the root for all apps.

## Environment Variables

- Place `.env` files in each app for secrets (see `.env.example` in each app).

---

For more details, see the code and workflow files in this repo.

