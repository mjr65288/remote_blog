# Remote Blog

Remote Blog is a SvelteKit application for publishing and managing blog posts. It uses Svelte 5, SvelteKit server routes and form actions, Better Auth for email/password authentication, Drizzle ORM for database access, and PostgreSQL for persistence.

The current app includes a simple public area, signup flow, protected admin area, post creation and editing screens, and a JSON endpoint for posts.

## Tech Stack

- SvelteKit 2 with Svelte 5 runes enabled
- TypeScript
- PostgreSQL
- Drizzle ORM and Drizzle Kit
- Better Auth with the admin plugin
- Valibot for server-side form validation
- Docker Compose for local Postgres
- ESLint and Prettier

## Getting Started

Install dependencies:

```sh
npm install
```

Create a local environment file:

```sh
cp .env.example .env
```

The default local database URL is:

```env
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
```

Start PostgreSQL:

```sh
npm run db:start
```

In another terminal, push the Drizzle schema to the database:

```sh
npm run db:push
```

Start the development server:

```sh
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Common Commands

```sh
npm run dev          # Start the SvelteKit dev server
npm run build        # Build the production app
npm run preview      # Preview the production build locally
npm run check        # Run Svelte and TypeScript checks
npm run lint         # Run Prettier check and ESLint
npm run format       # Format files with Prettier
npm run db:start     # Start local Postgres through Docker Compose
npm run db:push      # Push the current Drizzle schema to the database
npm run db:generate  # Generate Drizzle migration files
npm run db:migrate   # Run Drizzle migrations
npm run db:studio    # Open Drizzle Studio
```

## Project Structure

```txt
src/
  app.d.ts                         App-level TypeScript declarations
  app.html                         SvelteKit HTML shell
  hooks.server.ts                  Global server hook for auth/session locals
  lib/
    auth.ts                        Better Auth server configuration
    auth-client.ts                 Better Auth browser client
    server/
      actions/actions.ts           Shared server action helpers
      db/
        index.ts                   Drizzle/Postgres client setup
        schema.ts                  Database tables and relations
  routes/
    +layout.svelte                 Root layout and global app wrapper
    +page.svelte                   Public home page
    about/+page.svelte             Public about page
    api/posts/+server.ts           JSON API endpoint for posts
    auth/
      +layout.server.ts            Redirects signed-in users away from auth pages
      signup/+page.svelte          Client-side signup form
      signup/+page.server.ts       Reserved server load file for signup route
    admin/
      +layout.server.ts            Protects all admin routes
      +page.server.ts              Loads all posts for the admin list
      +page.svelte                 Admin post list
      post/new/
        +page.server.ts            Create-post form action
        +page.svelte               Create-post form UI
      post/[id]/
        +page.server.ts            Edit-post load and update action
        +page.svelte               Edit-post form UI
```

There are also `page.copy.*` files under `src/routes/admin/post`. Because they do not use SvelteKit's `+page` naming convention, they are not active routes. Treat them as old reference or scratch files unless you intentionally bring them back into the routing tree.

## How Requests Flow

Every server request passes through `src/hooks.server.ts`.

1. `authHandle` lets Better Auth handle its internal auth endpoints.
2. `sessionHandle` reads the current session with `auth.api.getSession`.
3. The authenticated user, when present, is stored on `event.locals.user`.

The `App.Locals` type in `src/app.d.ts` declares `locals.user`, so server routes and layouts can safely access it.

Admin routes are protected by `src/routes/admin/+layout.server.ts`. If `locals.user?.id` is missing, the user is redirected to `/auth/signup`.

Auth routes use `src/routes/auth/+layout.server.ts`. If a user is already signed in, they are redirected back to `/`.

## Authentication

Server auth is configured in `src/lib/auth.ts`.

Better Auth is set up with:

- email/password login enabled
- minimum password length of 8
- Drizzle adapter using the shared database client
- Better Auth admin plugin

The browser auth client lives in `src/lib/auth-client.ts`. The signup page uses `authClient.signUp.email` to create a user, then redirects to `/` on success.

Better Auth uses the `user`, `session`, `account`, and `verification` tables defined in `src/lib/server/db/schema.ts`.

## Database Layer

Database access is centralized in `src/lib/server/db/index.ts`.

That file:

- reads `DATABASE_URL` from private environment variables
- creates a `postgres` client
- creates and exports the typed Drizzle `db` client

The schema lives in `src/lib/server/db/schema.ts`. The application-specific table is `post`, which stores:

- `id`
- `title`
- `slug`
- `body`
- `createdAt`
- `updatedAt`
- `authorId`

`authorId` references the Better Auth `user` table and cascades deletes when a user is removed.

## Blog Post Features

The admin post list is served by `src/routes/admin/+page.server.ts`, which loads all posts with:

```ts
db.query.post.findMany();
```

The create-post flow lives in `src/routes/admin/post/new`.

- The Svelte page renders a progressively enhanced form with `use:enhance`.
- The server action validates `title` and `body` with Valibot.
- The action checks the Better Auth session.
- A URL-friendly slug is generated from the title.
- A new row is inserted into the `post` table.
- The user is redirected back to `/admin`.

The edit-post flow lives in `src/routes/admin/post/[id]`.

- The `load` function calls `getPostById(params.id)`.
- The Svelte page renders a prefilled edit form.
- The `update_post` action validates input, checks auth, regenerates the slug, updates the row, and redirects to `/admin`.

The shared `form` helper in `src/lib/server/actions/actions.ts` wraps SvelteKit form actions with Valibot validation. It returns a `400` response with validation messages when parsing fails, and otherwise calls the route-specific action logic.

## API Routes

`GET /api/posts` returns all posts as JSON.

The endpoint is defined in `src/routes/api/posts/+server.ts` and currently does not require authentication.

## Styling and UI Notes

The root layout imports `@drop-in/graffiti`, so the project can use Graffiti's global styles and utility classes. The layout wraps pages in:

```svelte
<main class="layout-readable center">
	{@render children()}
</main>
```

Individual admin pages currently include local component styles for forms and error banners.

## Environment Variables

Required:

```env
DATABASE_URL="postgres://root:mysecretpassword@localhost:5432/local"
```

Keep real secrets in `.env`. The `.gitignore` excludes `.env` and `.env.*`, while allowing `.env.example` and `.env.test`.

## Adding New Features

When adding a new database-backed feature:

1. Add or update tables in `src/lib/server/db/schema.ts`.
2. Run `npm run db:push` during local development, or generate migrations with `npm run db:generate`.
3. Put shared database helpers in `src/lib/server`.
4. Use SvelteKit server `load` functions for route data.
5. Use form actions for mutations.
6. Reuse the shared `form` helper when the action needs Valibot validation.

When adding a protected admin page, place it under `src/routes/admin`. It will automatically inherit the admin auth guard from `src/routes/admin/+layout.server.ts`.

## Quality Checks

Before opening a pull request or pushing a larger change, run:

```sh
npm run check
npm run lint
```

Use `npm run format` to apply Prettier formatting.
