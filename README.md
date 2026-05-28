# 🌱 Prithvi — Action for the Earth

A full-stack social platform for eco-activists to share actions, join campaigns, donate to green causes, and compete on leaderboards.

---

## 🚀 Live Demo

| Service | URL |
|---|---|
| Frontend | [prithvi-orcin.vercel.app](https://prithvi-orcin.vercel.app) |
| Backend API | Deployed on Render |

---
Some Glimpse : 


<img width="484" height="760" alt="image" src="https://github.com/user-attachments/assets/fe8fe119-9113-4c8d-8ccd-62e329f0123f" />
<img width="490" height="753" alt="image" src="https://github.com/user-attachments/assets/c2ad1d77-68f1-408a-8d75-eed59b70b1e2" />
<img width="1880" height="877" alt="image" src="https://github.com/user-attachments/assets/06312e5d-18bd-4da9-8875-1fee4c0e8a97" />



---

## ✨ Features

### 👤 Authentication
- **Google OAuth** via Supabase
- **Username & Password** — register and login with credentials
- **Guest Mode** — read-only access without signing in

### 📸 Social Feed
- Post eco-actions with images and videos
- Like posts (authenticated users only)
- Featured posts highlighted by admin

### 🎯 Campaigns
- Create and manage environmental campaigns
- Join campaigns via request system (accept/reject)
- Donate directly to campaigns via Razorpay
- Track progress, members, and funds raised
- Leave feedback and ratings on completed campaigns

### 💰 Donation Pool
- Community donation pool funded by user contributions
- Admin allocates pool funds to campaigns
- Top leaderboard users receive rewards from the pool
- Full transaction tracker — see exactly where money goes

### 🏆 Leaderboard
- Monthly and all-time rankings based on post likes
- Top 3 eco-heroes rewarded from the donation pool

### 🤖 AI Assistant
- Ask questions about the platform, campaigns, and users
- Powered by Claude → ChatGPT → Gemini → Groq (fallback chain)

### 🛡️ Admin Panel
- Overview of users, campaigns, and pool balance
- Allocate funds to campaigns via Razorpay
- **AI-powered scam detection** — 11 risk signals including:
  - New account age
  - Zero posts
  - Donation velocity
  - Same IP detection
  - AI title/description analysis
  - Poor past feedback
- Flag or remove suspicious campaigns

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Node.js, Express 5 |
| Database | MongoDB + Mongoose |
| Auth | Supabase (Google OAuth) + JWT |
| Payments | Razorpay |
| File Storage | ImageKit |
| AI | Claude, OpenAI, Gemini, Groq |
| Frontend Deploy | Vercel |
| Backend Deploy | Render |

---

## 📁 Project Structure

```
Prithvi/
├── frontend/               # React app
│   └── src/
│       ├── components/     # All page components
│       ├── hooks/          # useGuestGuard
│       ├── auth.js         # Token & guest helpers
│       ├── supabase.js     # Supabase client
│       └── main.jsx        # Routes
├── backend/
│   ├── src/
│   │   ├── app.js          # All API routes
│   │   └── routes/
│   │       └── payment.js  # Razorpay order creation
│   ├── db/
│   │   ├── model.js        # Mongoose schemas
│   │   └── db.js           # MongoDB connection
│   └── server.js           # Entry point
└── render.yaml             # Render deployment config
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js 18+
- MongoDB URI
- Supabase project
- Razorpay account
- ImageKit account

### Backend

```bash
cd backend
npm install
```

Create `backend/.env`:
```env
MONGO_URI=your_mongodb_uri
PRIVATE_KEY=your_jwt_secret
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
ClaudeAPI=your_claude_key
OpenaiAPI=your_openai_key
GeminiAPI=your_gemini_key
GrokAPI=your_groq_key
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

```bash
npm start
```

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

```bash
npm run dev
```

---

## 🔌 API Reference

### Auth
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/auth/supabase-session` | — | Exchange Supabase token for backend JWT |
| GET | `/auth/user` | ✅ | Get current user |
| POST | `/auth/logout` | ✅ | Logout |
| POST | `/user/login` | — | Username/password login |
| POST | `/user/signup` | — | Register new account |

### Posts
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/post/view` | — | Get all posts |
| POST | `/post/create` | ✅ | Create a post |
| PUT | `/post/like/:postId` | ✅ | Like/unlike a post |
| GET | `/post/myposts` | ✅ | Get current user's posts |

### Campaigns
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/campaign/all` | — | Get all campaigns |
| POST | `/campaign/create` | ✅ | Create a campaign |
| PUT | `/campaign/update/:id` | ✅ | Update campaign |
| POST | `/campaign/join/:id` | ✅ | Send join request |
| PUT | `/campaign/donate/:id` | ✅ | Record donation to campaign |
| POST | `/campaign/feedback/:id` | ✅ | Submit feedback |

### Donations
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/donation/pool` | — | Get pool balance |
| GET | `/donation/transactions` | — | Get all transactions |
| POST | `/donation/verify` | ✅ | Verify Razorpay payment |

### Leaderboard
| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/leaderboard/monthly` | — | Monthly rankings |
| GET | `/leaderboard/alltime` | — | All-time rankings |

---

## 🔐 Access Levels

| Action | Guest | Signed In |
|---|---|---|
| View posts & feed | ✅ | ✅ |
| View campaigns | ✅ | ✅ |
| View leaderboard | ✅ | ✅ |
| Like posts | ❌ | ✅ |
| Create posts | ❌ | ✅ |
| Create/join campaigns | ❌ | ✅ |
| Donate | ❌ | ✅ |
| AI assistant | ❌ | ✅ |

---

## 🚢 Deployment

### Frontend → Vercel
Push to GitHub — Vercel auto-deploys. Set env vars in Vercel dashboard.

### Backend → Render
`render.yaml` at the repo root handles everything. Set the `sync: false` env vars manually in the Render dashboard.

---

## 👨‍💻 Author

Built by **Alpha** — [github.com/Alpha6024](https://github.com/Alpha6024)
