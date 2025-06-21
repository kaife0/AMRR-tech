# Deployment Guide

## Frontend Deployment (Vercel/Netlify)

1. **Build the frontend:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder** to your hosting service

3. **Set environment variables on your hosting platform:**
   ```
   VITE_WEB3FORMS_ACCESS_KEY=536c9794-b157-41d4-880b-27cc4da87b2f
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_SERVER_URL=https://your-backend-domain.com
   ```

## Backend Deployment (Railway/Render/Heroku)

1. **Deploy the `server` folder** to your hosting service

2. **Set the start script** in server/package.json:
   ```json
   {
     "scripts": {
       "start": "node dist/index.js",
       "build": "tsc",
       "dev": "nodemon src/index.ts"
     }
   }
   ```

3. **Add build command** for hosting:
   ```bash
   cd server && npm install && npm run build
   ```

## Quick Fix for Local Development

If you're still developing locally and getting 404 errors:

1. **Start the backend server:**
   ```bash
   cd server
   npx nodemon src/index.ts
   ```

2. **Check the backend is running** at http://localhost:3001/api/health

3. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Demo Mode (Frontend Only)

If you want to deploy only the frontend without backend:

1. **Comment out the API URLs** in `.env.local`:
   ```
   # VITE_API_URL=https://your-backend-domain.com/api
   # VITE_SERVER_URL=https://your-backend-domain.com
   ```

2. **The app will run in demo mode** with static data only

## Common Issues

- **404 errors**: Backend not running or wrong API URL
- **CORS errors**: Backend CORS not configured for your domain
- **Images not loading**: Check VITE_SERVER_URL matches your backend domain
