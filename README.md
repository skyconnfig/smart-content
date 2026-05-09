# CopyForge — AI-Powered Content Generator

Generate high-quality blog posts, news articles, e-commerce copy, and academic content with AI. Built with Next.js, OpenAI, Neon PostgreSQL, and Creem payments.

## Features

- **AI Content Generation** — Enter a topic, get a well-written article in seconds
- **4 Template Styles** — Blog, News, E-commerce, Academic
- **Free Trial** — 2 free generations for new users
- **Pay-as-you-go** — Purchase additional credits via Creem (no subscription)
- **User Dashboard** — Track usage and browse your generated articles
- **OAuth Login** — Sign in with Auth0, GitHub, or Google

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL |
| ORM | Prisma |
| Auth | NextAuth v5 (Auth.js) |
| AI | DeepSeek (deepseek-v4-flash) |
| Payments | Creem |
| Deployment | Vercel |

## Getting Started

### 1. Prerequisites

- Node.js 20+
- A Neon PostgreSQL database (free at [neon.tech](https://neon.tech))
- A DeepSeek API key (get one at [platform.deepseek.com](https://platform.deepseek.com/api_keys))
- A Creem account (sign up at [creem.io](https://creem.io))
- (Optional) An Auth0 tenant for OAuth login

### 2. Clone & Install

```bash
git clone <your-repo-url> ai-copy-generator
cd ai-copy-generator
npm install
```

### 3. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required variables:

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | Your DeepSeek API key ([get one here](https://platform.deepseek.com/api_keys)) |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `AUTH_SECRET` | Random string for session encryption (run `openssl rand -base64 32`) |

At least one auth provider (Auth0 and/or GitHub):

| Variable | Description |
|----------|-------------|
| `AUTH0_CLIENT_ID` | Auth0 application client ID |
| `AUTH0_CLIENT_SECRET` | Auth0 application client secret |
| `AUTH0_ISSUER` | Auth0 domain (e.g., `https://your-tenant.us.auth0.com`) |

For payments (Creem):

| Variable | Description |
|----------|-------------|
| `CREEM_API_KEY` | Creem API key |
| `CREEM_PRODUCT_ID` | Creem product ID for 10-credit pack |
| `CREEM_WEBHOOK_SECRET` | Creem webhook signing secret |

### 4. Database Setup

```bash
# Push the schema to your Neon database
npx prisma db push

# Or create a migration
npx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth route handler
│   │   ├── generate/             # AI content generation API
│   │   ├── user/                 # User profile & articles API
│   │   └── creem/                # Creem checkout & webhook
│   ├── dashboard/                # User dashboard page
│   ├── login/                    # Login page
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page + generator tool
├── components/
│   ├── Navbar.tsx                # Top navigation bar
│   ├── KeywordInput.tsx          # Topic/keyword input field
│   ├── TemplateSelect.tsx        # Style template selector
│   ├── ResultDisplay.tsx         # AI output display area
│   ├── ArticleCard.tsx           # Article preview card
│   ├── PurchaseButton.tsx        # Creem payment trigger
│   └── SessionProvider.tsx       # NextAuth session wrapper
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   ├── db.ts                     # Prisma client singleton
│   └── openai.ts                 # OpenAI API wrapper
└── types/
    └── index.ts                  # Shared TypeScript types
prisma/
└── schema.prisma                 # Database schema
```

## Deployment (Vercel)

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/your-username/ai-copy-generator.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add all environment variables from `.env.local`
4. Deploy!

### 3. Custom Domain

The app is configured for `lxs.best`:

1. In Vercel dashboard → Project → Domains → Add `lxs.best`
2. In Cloudflare DNS, add a CNAME record pointing to `cname.vercel-dns.com`
3. Wait for DNS propagation (a few minutes)

### 4. Database Migration on Vercel

Add a post-deploy hook:

```bash
npx prisma db push
```

Or better, add it as a build command step in `vercel.json`.

## Usage Flow

1. **Sign Up** — Sign in with Auth0 or GitHub (2 free credits)
2. **Generate** — Enter a topic, select a style, click "Generate"
3. **Review** — See the AI-generated content, copy it to clipboard
4. **Upgrade** — When free credits run out, purchase more via Creem
5. **Manage** — View all your generated articles in the Dashboard

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/generate` | Required | Generate AI content |
| GET | `/api/user` | Required | Get user profile & usage |
| GET | `/api/user/articles` | Required | List user's articles |
| POST | `/api/creem/checkout` | Required | Create Creem checkout session |
| POST | `/api/creem/webhook` | Webhook | Handle Creem payment events |

## Future Improvements

- SEO-optimized content generation
- PDF/Word export
- Email delivery of articles
- Custom template styles
- Batch generation
- Team/shared workspaces

## License

MIT
