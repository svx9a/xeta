# Launch XETAPAY Sovereign Demo

This workflow automates the local environment setup for the XETAPAY Sovereign system, including database migrations and launching both the frontend and backend.

### 1. Database Synchronization

// turbo
1. Apply the latest D1 migrations to the local development database:

```bash
npx wrangler d1 migrations apply xetapay-db --local
```

### 2. Environment Configuration

1. Ensure the `.dev.vars` file contains the required keys:

```bash
cat .dev.vars
```

### 3. Launch Services

// turbo
1. Open a new terminal and start the Cloudflare Worker (Backend):

```bash
npm run worker:dev
```

// turbo
2. Open a new terminal and start the Vite development server (Frontend):

```bash
npm run dev
```

### 4. Verification Path

1. Once services are up:

- Visit the Dashboard at `http://localhost:3000` (or the Vite output port).
- Verify the Turnstile widget loads on the Login and Quotation pages.
- Test a "Secure Checkout" by generating a payment link.
