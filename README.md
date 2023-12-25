# Example Monorepo

This is a monorepo for a fullstack typescript app, using Nuxt 3 on the frontend. It runs on [Turborepo](https://turbo.build/repo) & [pnpm](https://pnpm.io).

### Monorepo Setup

This monorepo is broken down into two types of workspaces:

- **Apps** - These are the applications that are deployed and have a runtime. They are located in the `apps` directory. They usually don't import other apps.
- **Packages** - These are packages that are usually used by the apps, or things like "CDK" that are used in devops and don't require a runtime. They are located in the `packages` directory.

### Using The Monorepo

Node v18+, pnpm v8+ (recommended to install using corepack), and Postgres are what we use to develop in this monorepo.

Install dependencies:

```bash
pnpm install
```

Run the dev environment:

```bash
pnpm dev
```

Run typechecks:
    
```bash
pnpm typecheck
```

Run linting:

```bash
pnpm lint
```