# Referral Tracker & Leaderboard Web App

A production-grade referral tracker and leaderboard built with React (Vite), Tailwind CSS, and Firebase (Auth + Firestore).

## 🚀 Features

- Email/Password & Google Authentication
- Unique referral code generation
- Referral tracking and validation
- Firestore-based leaderboard (top 10)
- Protected dashboard for users
- Mobile-first, clean UI with Tailwind CSS

## 🛠️ Tech Stack

- React (Vite)
- Tailwind CSS
- Firebase Auth & Firestore

## 📦 Folder Structure

```
src/
├── firebase.js           # Firebase config and initialization
├── App.jsx               # Router with protected routes
└── pages/
    ├── Login.jsx         # Login page
    ├── Signup.jsx        # Signup page with referral logic
    ├── Dashboard.jsx     # User dashboard (protected)
    └── Leaderboard.jsx   # Public leaderboard
```

## 🔥 Firebase Setup

1. [Create a Firebase project](https://console.firebase.google.com/)
2. Enable **Authentication** (Email/Password & Google)
3. Enable **Cloud Firestore**
4. Copy your Firebase config to `src/firebase.js`:

```js
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};
```

## 🏗️ Local Development

```bash
npm install
npm run dev
```

## 🗄️ Firestore Structure

- `/users/{uid}`

```json
{
  "name": "John Doe",
  "referralCode": "ABC123",
  "referralCount": 2
}
```

- `/referrals/{referralCode}`

```json
{
  "referrerUserId": "uid123",
  "usedBy": ["uid456", "uid789"]
}
```

## 🔑 Logic Summary

- On signup, generate a referral code: `uid.slice(0, 6)`
- Users can join with a referral code (input or `?ref=CODE` in URL)
- On referral use:
  - Validate code
  - Prevent self-referral
  - Add new user to `usedBy` in `/referrals/{referralCode}`
  - Increment `referralCount` in `/users/{referrerUserId}`
- Dashboard shows user info, code, count, and share/copy buttons
- Leaderboard shows top 10 users by referral count

## 🎨 UI

- Mobile-first, responsive, minimal
- Tailwind CSS for all components
- Buttons with hover states and transitions

---

**Ready to deploy!**
