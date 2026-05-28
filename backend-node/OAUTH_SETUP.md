# OAuth Setup Guide

## Why the `invalid_client` error happened

The backend Passport strategy was reading OAuth credentials before environment variables were loaded, and it fell back to mock placeholder client IDs. Google rejected that client ID, so the browser landed on `Access blocked: Authorization Error` with `invalid_client`.

## Required environment variables

Set these in `backend-node/.env`:

- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GOOGLE_CALLBACK_URL`
- `FACEBOOK_APP_ID`
- `FACEBOOK_APP_SECRET`
- `FACEBOOK_CALLBACK_URL`
- `FRONTEND_URL`
- `BASE_URL`

## Google Cloud Console setup

1. Open Google Cloud Console and select the correct project.
2. Enable the Google OAuth consent screen and publish it for testing or production as needed.
3. Create an OAuth client of type `Web application`.
4. Add authorized JavaScript origins:
   - `http://localhost:5173`
   - `https://dom-shop.khuyoudom.dev`
5. Add authorized redirect URIs:
   - `http://localhost:4000/api/auth/google/callback`
   - `https://<your-backend-domain>/api/auth/google/callback`
6. Copy the client ID and client secret into `backend-node/.env`.

## Facebook setup

1. Create a Facebook app in Meta Developers.
2. Add Facebook Login.
3. Add valid OAuth redirect URIs:
   - `http://localhost:4000/api/auth/facebook/callback`
   - `https://<your-backend-domain>/api/auth/facebook/callback`
4. Copy the App ID and App Secret into `backend-node/.env`.

## Production-safe flow

1. Frontend button sends the browser to `GET /api/auth/google`.
2. Passport redirects to Google with the real client ID and callback URL.
3. Google returns to `/api/auth/google/callback`.
4. Backend creates or links the local user, signs a JWT, and redirects to the frontend root with `?token=...`.
5. React reads the token, calls `/api/auth/me`, stores the session, and clears the query string.

## Debugging checklist

- Confirm the OAuth client exists in the Google Cloud project you expect.
- Confirm the client ID in `backend-node/.env` matches exactly what Google shows.
- Confirm `GOOGLE_CALLBACK_URL` matches the redirect URI registered in Google Cloud Console.
- Confirm the frontend button uses `GET /api/auth/google` on the live backend domain.
- Confirm the backend logs show the request to `/api/auth/google` and then `/api/auth/google/callback`.
- Confirm the browser lands back on the frontend with `?token=...` after a successful login.
- Confirm `GET /api/auth/me` succeeds with the returned token.

## Local `.env` example

```env
PORT=4000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/ecommerce
JWT_SECRET=change-me
JWT_EXPIRES_IN=7d
BASE_URL=http://localhost:4000
FRONTEND_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:4000/api/auth/google/callback

FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_CALLBACK_URL=http://localhost:4000/api/auth/facebook/callback
```