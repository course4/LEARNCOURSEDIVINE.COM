# 🚀 Course Divine - Complete Bluehost Deployment & Hosting Guide

This guide provides step-by-step instructions to deploy the **Course Divine Technology & Education Platform** onto **Bluehost** web hosting.

---

## 📁 Package Overview

You have 3 ready-to-use ZIP archives created in your project root folder:

| Zip Package Name | Contents & Purpose | Target Location |
| :--- | :--- | :--- |
| **`BLUEHOST_PUBLIC_HTML_FRONTEND.zip`** | Pre-built static React application (`index.html`, `.htaccess`, `assets/`, images) | Extract into Bluehost `public_html` |
| **`BLUEHOST_NODEJS_SERVER_BACKEND.zip`** | Production Node.js Express REST API (`server.js`, `routes/`, `models/`, `controllers/`, `package.json`) | Upload to Bluehost Node.js App folder or Render |
| **`COURSE_DIVINE_MASTER_BLUEHOST_BUNDLE.zip`** | Full master project source code including client, server, assets, and documentation | Backup & Development archive |

---

## 🌐 Method 1: Hybrid Deployment (Easiest & Most Recommended)

> **Best for speed, performance, and reliability.**
> - **Frontend (Website & UI)**: Hosted directly on Bluehost (`public_html`) for ultra-fast CDN asset delivery.
> - **Backend (API & Database)**: Hosted on Render / MongoDB Atlas (Free & Auto-scaling).

### Step 1: Upload Frontend to Bluehost `public_html`
1. Log in to your **Bluehost Account** $\rightarrow$ Click **Advanced** (cPanel).
2. Open **File Manager** $\rightarrow$ Navigate to `public_html`.
3. In File Manager, click **Settings** (top right) $\rightarrow$ Check **Show Hidden Files (dotfiles)** $\rightarrow$ Click **Save**.
4. Click **Upload** $\rightarrow$ Select `BLUEHOST_PUBLIC_HTML_FRONTEND.zip`.
5. Once uploaded, right-click `BLUEHOST_PUBLIC_HTML_FRONTEND.zip` in `public_html` $\rightarrow$ Click **Extract**.
6. Ensure `index.html` and `.htaccess` are directly inside `public_html`.

### Step 2: Verify `.htaccess` for React SPA Routing
The package includes an optimized `.htaccess` file so React pages load smoothly without 404 errors on page refresh:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteCond %{HTTPS} off
  RewriteRule ^ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Step 3: SSL / HTTPS Activation
1. In cPanel, search for **SSL/TLS Status**.
2. Select your domain (`learncoursedivine.com` or your domain name).
3. Click **Run AutoSSL** (Bluehost provides 100% free SSL certificates).

---

## ⚡ Method 2: Full-Stack Deployment inside Bluehost cPanel (Node.js App Selector)

If you want **both** the API server and frontend hosted inside Bluehost using Bluehost's **Setup Node.js App** feature:

### Step 1: Create Node.js Application in Bluehost
1. In Bluehost cPanel, search for **Setup Node.js App**.
2. Click **Create Application**.
3. Set the following fields:
   - **Node.js Version**: `18.x` or `20.x`
   - **Application Mode**: `Production`
   - **Application Root**: `backend` (or `server`)
   - **Application URL**: `api`
   - **Application Startup File**: `server.js`
4. Click **Create**.

### Step 2: Upload Backend Files
1. Open cPanel **File Manager** $\rightarrow$ Go to the newly created folder (`backend` or `server`).
2. Upload `BLUEHOST_NODEJS_SERVER_BACKEND.zip` $\rightarrow$ Right click $\rightarrow$ **Extract**.
3. In cPanel **Setup Node.js App** dashboard:
   - Click **Run NPM Install** to install dependencies automatically.

### Step 3: Configure Environment Variables in Bluehost
In the Node.js App management screen in cPanel, add the following Environment Variables under **Environment variables**:

| Key | Example Value | Description |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Production environment flag |
| `PORT` | `5000` | Server listening port |
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/coursedivine` | MongoDB Atlas Database Connection String |
| `JWT_SECRET` | `coursedivine_super_secret_jwt_key_2026` | Secret key for auth tokens |
| `CLIENT_URL` | `https://yourdomain.com` | Primary website domain |

4. Click **Restart** on the Node.js Application.

---

## 📊 Step 4: Initializing & Seeding Database

To populate default categories, courses, testimonials, and master admin account into your MongoDB Atlas database:

1. Connect to your server environment or run locally:
   ```bash
   cd server
   npm run seed
   ```
2. **Default Master Admin Login Credentials**:
   - **Email**: `admin@coursedivine.com` (or `coursedivine@admin`)
   - **Password**: `Admin@123` (or `9876543210`)

---

## ✅ Post-Deployment Checklist

- [x] Web root `public_html` contains `index.html`, `.htaccess`, and `assets/`.
- [x] `.htaccess` is present and visible (dotfiles enabled).
- [x] Free SSL Certificate (AutoSSL) is active (`https://`).
- [x] Registration, Login, Course catalog, and Logout operate cleanly.
- [x] Admin Portal access is secure and protected under `/admin`.

---

*Created for Course Divine Engineering Team.*
