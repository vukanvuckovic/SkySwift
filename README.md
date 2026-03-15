# Flight Booking App

A full-stack flight booking platform where users can search for flights, book seats, and manage their reservations. Built as a portfolio project to demonstrate end-to-end Next.js development with GraphQL and MongoDB.

**Live Demo:** [https://skyswift-psi.vercel.app/](https://skyswift-psi.vercel.app/)

---

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **API:** GraphQL (Apollo Server + Apollo Client)
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (HTTP-only cookies)
- **State:** Redux Toolkit
- **UI:** Tailwind CSS, Radix UI, Ant Design, GSAP animations
- **Testing:** Jest, React Testing Library, Cypress

## Key Features

- Search flights by origin, destination, and date
- Book flights and manage reservations
- User authentication (register / login)
- Booking confirmation with animated success screen
- Fully responsive — mobile, tablet, desktop

## Running Locally

**Prerequisites:** Node.js 18+, a MongoDB Atlas cluster

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in CONNECTION_URL and JWT_SECRET in .env.local

# Start the dev server
npm run dev
```

App runs at [http://localhost:3000](http://localhost:3000).

## Demo Credentials

Register a new account on the sign-up page — no seed data required.

## Environment Variables

| Variable | Description |
|---|---|
| `CONNECTION_URL` | MongoDB Atlas connection string |
| `JWT_SECRET` | Secret key for signing JWT tokens |

## Scripts

```bash
npm run dev       # Development server
npm run build     # Production build
npm test          # Unit tests (Jest)
npm run test:e2e  # End-to-end tests (Cypress)
```
