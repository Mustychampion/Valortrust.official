# Deployment Guide for ValorTrust Website

## Project Overview
- **Frontend**: Vite + TypeScript (builds to `dist/`)
- **Backend**: Express.js server (server.js)
- **Database**: Supabase

---

## Option 1: Render (Recommended - Full Stack)

### Prerequisites
- GitHub/GitLab account
- Render account (free signup at render.com)

### Setup Steps

1. **Push your code to GitHub** (if not already)

2. **Create render.yaml** (create in project root):
```yaml
services:
  - type: web
    name: valortrust-website
    region: oregon
    plan: free
    buildCommand: npm run build
    startCommand: npm run start
    envVars:
      - key: NODE_ENV
        value: production
      - key: SUPABASE_URL
        value: https://zcbvhzenlfrgjyewvwbl.supabase.co
      - key: SUPABASE_ANON_KEY
        value: your_actual_anon_key_here
      - key: PORT
        value: 3000
```

3. **In Render Dashboard**:
   - Create New → Web Service
   - Connect your repository
   - Render will auto-detect settings from render.yaml
   - Click "Deploy"

---

## Option 2: Railway

### Setup Steps
1. Connect GitHub repo at [railway.app](https://railway.app)
2. Auto-detect Node.js environment
3. Set environment variables in Railway dashboard

### railway.json (create in project root):
```json
{
  "services": [
    {
      "name": "valortrust",
      "source": {
        "repo": "your-github-username/your-repo-name",
        "type": "git"
      },
      "buildCommand": "npm run build",
      "startCommand": "npm run start"
    }
  ]
}
```

---

## Option 3: Static Hosting (Frontend Only)

If you want to host only the static frontend:

### Netlify
- Drag & drop `dist/` folder to Netlify dashboard
- Or connect repo with:
  - Build command: `npm run build`
  - Publish directory: `dist`

### Vercel
```bash
npm install -g vercel
vercel --prod
```

---

## Option 4: VPS (Manual Setup)

### On Ubuntu/Debian VPS:

```bash
# 1. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Clone and setup
git clone your-repo
cd your-repo
npm install
npm run build

# 3. Install PM2
sudo npm install -g pm2
pm2 start server.js --name valortrust

# 4. Setup NGINX (optional)
sudo apt install nginx
```

---

## Environment Variables Required

Create these in your hosting platform's dashboard:

| Variable | Value |
|----------|-------|
| `NODE_ENV` | `production` |
| `SUPABASE_URL` | `https://zcbvhzenlfrgjyewvwbl.supabase.co` |
| `SUPABASE_ANON_KEY` | Your Supabase anon key |
| `PORT` | `3000` (or platform default) |

**Note**: For production, use `SUPABASE_SERVICE_ROLE_KEY` for full backend access.