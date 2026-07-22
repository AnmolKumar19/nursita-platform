# Nursita

Nursing made simple — live classes, notes and DPP (Daily Practice Problems) in one platform,
built specifically for nursing students (GNM / B.Sc Nursing coursework).
MERN stack, built to run entirely on free tiers up through deployment.

Founder & Lead Instructor: **Vineeta Rani**
Developer: **Anmol Kumar**

## Stack

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas free M0 tier)
- **File storage** (notes/DPP): Cloudinary free tier
- **Live classes + recordings**: YouTube Live (unlisted) — one video ID doubles as the live stream and, once it ends, the recording

## 1. Local setup

### Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGO_URI` — from a free MongoDB Atlas cluster (Atlas dashboard → Connect → Drivers)
- `JWT_SECRET` — any long random string
- `CLOUDINARY_*` — from your free Cloudinary dashboard (needed for notes/DPP uploads)

Then:

```bash
npm run dev        # starts the API on http://localhost:5000
```

### Seed Vineeta Rani's founder account

Run once, after the backend is connected to your database:

```bash
npm run seed
```

This creates her instructor login (`vineeta@nursita.com` / `ChangeMe123!` — change the password after
first login) and one starter course, so the platform isn't empty on first run.

### Frontend

```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL should point at your backend
npm run dev             # starts on http://localhost:5173
```

## 2. Scheduling a live class

1. In YouTube Studio, create a live stream (Create → Go live), set visibility to **Unlisted**.
2. Stream to it from **OBS Studio** (free) using the stream key YouTube gives you.
3. In Nursita's teaching panel, paste the YouTube video/stream link when scheduling the class.
4. Flip the class status to **live** when you go live, and to **ended** when you finish —
   the same link keeps working afterward as the recording, since YouTube auto-saves it as a VOD.

## 3. Free deployment

| Piece | Where | Notes |
|---|---|---|
| Backend | Render (free web service) | Free tier sleeps after inactivity — fine for non-commercial use |
| Frontend | Vercel or Netlify (free) | Set `VITE_API_URL` to your deployed backend URL |
| Database | MongoDB Atlas M0 | Free forever, 512MB |
| File storage | Cloudinary free tier | ~25GB storage/bandwidth |
| Live video | YouTube Live | Free, unlimited |

Steps:
1. Push `backend/` and `frontend/` to GitHub (as one repo or two).
2. Render: New → Web Service → point at `backend/`, add the same env vars from `.env`.
3. Vercel: New Project → point at `frontend/`, set `VITE_API_URL` to your Render URL + `/api`.
4. Update `CLIENT_URL` in the backend's Render env vars to your live Vercel URL (for CORS).

## Project structure

```
nursita/
  backend/
    config/       MongoDB connection
    middleware/    JWT auth + role guards, file upload
    models/       User, Course, LiveClass, Note, Enrollment
    controllers/   route logic
    routes/        Express routers
    utils/         Cloudinary config
    seed.js        creates founder account + starter course
    server.js
  frontend/
    src/
      api/         axios instance
      context/     auth state
      components/  Navbar, Footer, CourseCard, ProtectedRoute
      pages/       Home, Login, Register, Courses, CourseDetail,
                    LiveClass, Dashboard, InstructorPanel
      assets/      Nursita logo + mark
```

## Roles

- **student** — browse/enroll in courses, watch live classes & recordings, download notes/DPP
- **instructor** — create courses, schedule classes, upload notes/DPP
- **admin** — full access (create manually in the database; there's no public admin signup)
