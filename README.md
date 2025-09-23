# やきべん (Yakiben)

Modern Japanese lunch box pre-order system built with Vue 3 and TypeScript.

## Features

### Customer App
- 🍱 Beautiful, mobile-first menu browsing
- 🛒 Smart cart with customizations and quantity management
- 📝 Order tracking with user-friendly IDs
- 🖨️ Advanced printing support for orders and receipts
- 💾 Customer info persistence and quick reordering
- 🕒 Smart pickup time validation with business hours
- 🌐 Internationalization-ready UI text system
- 📱 PWA-ready for mobile installation

### Admin App (Coming Soon)
- 📊 Order management dashboard
- 🗂️ Menu and inventory control
- 👥 Role-based access control
- 🚚 Delivery management

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

## Architecture

### PWA Support
- 📱 Installable on mobile devices
- 🔄 Offline support and asset caching
- 🚀 Optimized for performance

### Configuration
- 🏢 Centralized restaurant info configuration
- 🌐 Hierarchical UI text system for i18n
- ⚙️ Business hours and validation rules
- 🎨 Shared design tokens and Tailwind theme

### Development Tools
- 🛠️ ESLint, Prettier for code quality
- 🎯 TypeScript for type safety
- 🎨 Tailwind CSS for styling
- 🔄 Husky and lint-staged for git hooks
- 🧪 Mock API layer for development

### Environment Variables
- Place `.env` files in each app for secrets (see `.env.example` in each app).

## Local Supabase Setup

To use the local Supabase instance for development:

1. **Install Supabase CLI**:
   ```bash
   brew install supabase/tap/supabase
   ```

2. **Initialize Supabase**:
   ```bash
   supabase init
   ```

3. **Start Supabase**:
   ```bash
   supabase start
   ```

4. **Access Supabase**:
   - API: `http://localhost:54321`
   - Studio: `http://localhost:54323`

5. **Update Environment Variables**:
   - Add the local Supabase URL and anon key to the shared `supabase.ts` file:
     ```typescript
     const supabaseUrl = 'http://localhost:54321';
     const supabaseAnonKey = 'YOUR_LOCAL_SUPABASE_ANON_KEY';
     ```

6. **Testing**:
   - Keep the mock APIs until Supabase is fully implemented and tested.

## Deploying Supabase

To deploy the Supabase schema and configuration to your remote project, follow these steps:

1. **Link to your Supabase project**:
   ```bash
   supabase link
   ```
   This command will prompt you to authenticate and select your Supabase project.

2. **Push the local migrations to the remote database**:
   ```bash
   supabase db push
   ```
   This will apply all local migrations to the remote Supabase database.

3. **Verify the deployment**:
   - Check the Supabase dashboard to ensure the schema and data are correctly applied.
   - Test the API endpoints to confirm functionality.

4. **Optional: Seed the database**:
   If you have a `seed.sql` file, you can populate the database with initial data:
   ```bash
   supabase db seed
   ```

5. **Monitor and Debug**:
   Use the Supabase dashboard logs and metrics to monitor the deployment and debug any issues.

## Project Structure

```
yakiben/
├── apps/
│   ├── customer/           # Customer-facing app
│   │   ├── src/
│   │   │   ├── config/    # App configuration
│   │   │   ├── constants/ # UI text and constants
│   │   │   ├── data/     # Mock API and data
│   │   │   ├── stores/   # State management
│   │   │   ├── types/    # TypeScript types
│   │   │   └── views/    # Vue components
│   │   └── public/       # Static assets
│   └── admin/            # Admin panel (WIP)
└── shared/              # Shared configurations
```

---

For more details, see the code and workflow files in this repo.


## License

This project is released under a **strict custom license**.  
**No use of the code is allowed** — including personal or internal business use — without explicit written permission.

See [`LICENSE-RESTRICTED.txt`](./LICENSE-RESTRICTED.txt) for full details.
