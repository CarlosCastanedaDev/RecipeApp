# Deploying Pantry Chef to a VPS

This is a static single-page app. Build it, then serve the `dist/` folder.

## 1. Build

```bash
npm install
npm run build
```

This produces a static `dist/` directory. Copy it to your server, e.g.:

```bash
scp -r dist/ user@your-vps:/var/www/pantry-chef
```

## 2. Seed / test data

No backend or database is needed. Sample recipes and a starter pantry are
**seeded automatically** the first time each browser loads the app (whenever
`localStorage` is empty). Data is stored per-browser in `localStorage`.

There is a **"Reset sample data"** button in the footer to restore the seed at
any time — handy when testing.

## 3. IMPORTANT: SPA route fallback

The app uses client-side routing (`/add`, `/pantry`, `/meal-plan`,
`/shopping-list`). Your web server **must** fall back to `index.html` for
unknown paths, or direct visits / refreshes on those routes will 404.

### nginx

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/pantry-chef;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Reload: `sudo nginx -t && sudo systemctl reload nginx`

### Apache

Create `dist/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Quick test with Node (no nginx)

`vite preview` already handles the SPA fallback:

```bash
npm run build
npm run preview -- --host --port 8080
```

Or with `serve`:

```bash
npx serve -s dist -l 8080
```

(`-s` = single-page mode, which adds the index.html fallback.)
