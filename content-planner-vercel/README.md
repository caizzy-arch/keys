# Content Planner for Vercel

This version keeps the existing calendar, content forms, multiple platforms, request forms, Google Drive references, comments, and approvals. It uses Neon PostgreSQL for shared records and Clerk for sign-in. It does not use Supabase or the original hosting platform.

The manager is **caizzy.lyne@gmail.com**, using a verified email in Clerk. Other users need a verified email listed in `VISITOR_EMAILS`. Visitors can view all shared items, add comments, approve or request revisions for scheduled content, and submit new content requests. They cannot edit or delete existing items or create scheduled content. Authorization is enforced on the server, including session checks.

## 1. Replace the GitHub files

Extract this ZIP. Replace the old source in `caizzy-arch/keys` with the files and folders inside this package. Put `package.json`, `vercel.json`, `api`, `server`, `public`, and `scripts` at the repository root. Remove the old `dist`, `worker`, `db`, `drizzle`, `.openai`, `build.cjs`, `generate.cjs`, and `drizzle.config.ts` files/folders. They belong to the old host. Do not upload `node_modules`, credentials, or a ZIP as your application source. The original site remains unchanged.

## 2. Create the Vercel project

Import `caizzy-arch/keys` into your Keysi team. Name the project `content-planner`. Select **Other**, root directory `./`, build command `npm run build`, and output directory `public`. Use Node.js 24 (Node.js 22 also supports the app). The checked-in `vercel.json` supplies build settings and API routing. Vercel installs packages using the included `pnpm-lock.yaml`.

You can create the project before configuring the services. It will show a setup/sign-in message until the required environment variables and database tables are ready; it will not fabricate data or fall back to browser-only storage.

## 3. Connect Neon and Clerk

In Vercel Storage/Integrations, connect your existing Neon database and Clerk authentication resource to this project. Keep sensitive environment variables protected. For Preview deployments, enable a separate Neon preview branch if available so test edits do not change production records.

In Project Settings → Environment Variables, ensure these names are set:

| Name | Value |
| --- | --- |
| `DATABASE_URL` | Your Neon pooled PostgreSQL connection string. Keep it secret. |
| `CLERK_PUBLISHABLE_KEY` | Your Clerk publishable key (`pk_…`). `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` also works. |
| `CLERK_SECRET_KEY` | The matching Clerk secret key (`sk_…`). Keep it secret. |
| `APP_URL` | Your final Vercel origin, such as `https://content-planner-your-team.vercel.app`. |
| `VISITOR_EMAILS` | Comma-separated emails of permitted reviewers, such as `reviewer@example.com,client@example.com`. Leave empty to allow only the manager. |

Automatic Neon names `STORAGE_URL` and `POSTGRES_URL` are also accepted. If the integration creates differently prefixed variables, copy its connection string into `DATABASE_URL`. Never paste a secret key or database connection string into GitHub, screenshots, or chat.

Clerk may need you to claim/open its application and finish configuration. Use matching publishable and secret keys from the same Clerk instance. For initial testing, use its development keys. Before a public production launch, configure Clerk's production instance and domain as required by Clerk, then use its production keys. Verify the manager email when signing in. Other verified users remain denied unless on `VISITOR_EMAILS`.

## 4. Create database tables

Open your Neon project's SQL Editor and run the complete contents of `schema.sql` on the production database branch. If you use a separate preview branch, run it there too. It creates the planner tables and indexes without deleting data.

Alternatively, with Node.js installed locally and `DATABASE_URL` set in your shell, run:

```sh
pnpm install --frozen-lockfile
pnpm run db:setup
```

## 5. Redeploy and verify

Redeploy after connecting integrations or changing environment variables. Sign in as `caizzy.lyne@gmail.com` and create an item. Sign in as an allowed visitor in another browser: New content item and Delete must be absent, content fields must be read-only, and comments/approve/request revision must work. Return to the manager account and confirm those comments and decisions are visible. A user not on the allowlist must receive an access-denied message.

## Existing content

The new host uses a new Neon database. Records in the original host's database are **not automatically copied**. This package contains source only, not a database backup. Existing localStorage records can import when the new planner opens in a browser that already holds them and the database is empty, but storage from a different site origin cannot be read. Keep your original planner available until any needed content has been migrated or recreated.

## Checks and limits

```sh
pnpm run build
pnpm test
```

The package includes tests for verified-email roles, unknown-user denial, visitor restrictions, shared comments/reviews, content requests, stale-edit conflicts, deletion, and SQL translation. These use a local test database; a live Neon/Clerk/Vercel test still requires your environment configuration. Sign-in UI comes from Clerk. Original planner styling is retained.

References: [Clerk JavaScript](https://clerk.com/docs/js-frontend/getting-started/quickstart), [Clerk token verification](https://clerk.com/docs/reference/backend/verify-token), [Neon driver](https://neon.com/docs/serverless/serverless-driver).
