# MeetEase — Appointment Scheduling Platform

> A hackathon-ready MERN + Kafka project where **Hosts** share available timeslots and **Visitors** book them & pay in real time.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Axios, CSS / Tailwind |
| Backend | Express.js, Node.js |
| Database | MongoDB (Atlas) |
| Auth | bcryptjs, jsonwebtoken |
| Payments | Stripe / Razorpay |
| Real-time | Apache Kafka + WebSockets (Socket.io) |

---

## 📋 Task List

> **Total estimated time: ~2 hours**  
> Tasks are ordered by implementation flow. Follow them top to bottom.

---

### Phase 1 — Project Setup ⏱️ ~15 min

| # | Task | Details |
|---|---|---|
| 1 | **Bootstrap the project** | Init React app (Vite), create Express server, connect MongoDB Atlas, install all dependencies |
| 2 | **Configure environment** | Set up `.env` with `MONGO_URI`, `JWT_SECRET`, payment API keys, and Kafka broker URL |
| 3 | **Define DB schemas** | Create Mongoose models: `User` (with role: `host` / `visitor`), `Slot`, and `Booking` |

---

### Phase 2 — Authentication ⏱️ ~20 min

| # | Task | Details |
|---|---|---|
| 4 | **Auth API routes** | `POST /api/auth/register` and `POST /api/auth/login` — hash passwords with bcrypt, return signed JWT |
| 5 | **Auth UI** | Register and Login pages with a **role selector** (Host / Visitor). Store JWT in app state |
| 6 | **Auth middleware** | `verifyToken` middleware to protect private routes |

---

### Phase 3 — Host Flow ⏱️ ~25 min

| # | Task | Details |
|---|---|---|
| 7 | **Host Dashboard UI** | After login, show a form: pick a **date**, pick a **time range**, submit to create a slot |
| 8 | **Create Slot API** | `POST /api/slots` — saves the slot in MongoDB, linked to the authenticated host's `userId` |
| 9 | **Display Host's Slots** | Fetch and list the host's own created slots on the dashboard. Include a **delete** option for each |

---

### Phase 4 — Visitor Flow ⏱️ ~25 min

| # | Task | Details |
|---|---|---|
| 10 | **Browse Slots UI** | Visitor landing page — fetch and display all **available (unbooked)** slots. Show host name, date, and time |
| 11 | **Book & Pay Card** | Clicking a slot opens a confirmation card with a **"Book & Pay"** button |
| 12 | **Payment + Booking API** | On confirm → call Stripe / Razorpay API → on success, `POST /api/bookings` (links slot + visitor + payment ID) and mark the slot as `booked` |

---

### Phase 5 — Real-Time Updates with Kafka ⏱️ ~20 min

> **Why Kafka?** When a visitor books a slot, other visitors still browsing should see it disappear instantly — no manual refresh needed.

| # | Task | Details |
|---|---|---|
| 13 | **Kafka Producer (Backend)** | After a successful booking (`POST /api/bookings`), publish an event to a Kafka topic `slot-booked` with the payload `{ slotId, bookedBy, timestamp }` |
| 14 | **Kafka Consumer + WebSocket Bridge** | A consumer listens on `slot-booked`. On receiving a message, emit a **Socket.io event** `slot-update` to all connected visitor clients |
| 15 | **Frontend WebSocket Listener** | On the Browse Slots page, listen for `slot-update` events. When received, **remove the booked slot from the local state** in real time — no refresh required |

```
┌──────────┐   books    ┌───────────┐  publishes  ┌───────┐
│ Visitor A │──────────►│  Express  │────────────►│ Kafka │
└──────────┘            │  Server   │             │ Topic │
                        └───────────┘             │slot-  │
                                                  │booked │
                        ┌───────────┐             └───┬───┘
                        │  Kafka    │◄────────────────┘
                        │ Consumer  │
                        └─────┬─────┘
                              │ emits Socket.io event
                              ▼
                        ┌───────────┐
                        │ Visitor B │  ← sees slot disappear instantly
                        │ (Browser) │
                        └───────────┘
```

---

### Phase 6 — Polish & Edge Cases ⏱️ ~10 min

| # | Task | Details |
|---|---|---|
| 16 | **Filter booked slots** | Ensure already-booked slots never appear on the browse page (both via API filter and real-time removal) |
| 17 | **My Bookings** | Add a section on the Visitor dashboard to view all their confirmed bookings |
| 18 | **Error & loading states** | Add loading spinners and error messages across all API calls and pages |
| 19 | **Responsive layout** | Quick pass using flexbox/grid or Tailwind to make it usable on mobile |

---

### Phase 7 — Deploy & Test ⏱️ ~10 min

| # | Task | Details |
|---|---|---|
| 20 | **End-to-end test** | Register as Host → create slots → open new tab → register as Visitor → browse → book → confirm payment → verify real-time update |
| 21 | **Deploy** | Frontend → Vercel / Netlify. Backend → Railway / Render. Point frontend env to deployed backend URL. Ensure Kafka broker is accessible (use a managed service like Confluent Cloud for hackathon) |

---

## 📁 Suggested Project Structure

```
meetease/
├── client/                 # React (Vite) frontend
│   └── src/
│       ├── pages/          # Login, Register, HostDashboard, BrowseSlots, MyBookings
│       ├── components/     # SlotCard, BookingModal, Navbar
│       ├── api/            # Axios wrapper / API calls
│       └── socket.js       # Socket.io client setup
├── server/                 # Express backend
│   ├── routes/             # auth, slots, bookings
│   ├── middleware/         # verifyToken
│   ├── models/             # User, Slot, Booking (Mongoose)
│   ├── kafka/
│   │   ├── producer.js     # Publishes to 'slot-booked'
│   │   └── consumer.js     # Consumes and emits via Socket.io
│   └── app.js
├── .env
└── README.md
```

---

## ⚡ Quick Start

```bash
# 1. Clone & install
git clone <repo-url> && cd meetease
cd client && npm install
cd ../server && npm install

# 2. Add your .env values (see Phase 1, Task 2)

# 3. Run everything
cd server && npm run dev        # Express + Kafka consumer
cd ../client && npm run dev     # React dev server
```

---

## ✅ Summary

| Phase | Focus | Time |
|---|---|---|
| 1 | Setup | 15 min |
| 2 | Auth | 20 min |
| 3 | Host Flow | 25 min |
| 4 | Visitor Flow | 25 min |
| 5 | Kafka Real-Time | 20 min |
| 6 | Polish | 10 min |
| 7 | Deploy & Test | 10 min |
| **Total** | | **~2 hrs** |