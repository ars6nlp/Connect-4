<div align="center">
  <h1 align="center">Connect 4 Online 🎮</h1>
  <p align="center">
    <strong>A modern, multiplayer, and highly responsive Connect Four experience.</strong>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <br/>
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Polar.sh-18181B?style=for-the-badge&logo=polar&logoColor=white" alt="Polar" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  </p>
</div>

---

## ⚠️ IMPORTANT NOTES FOR THE JURY / EVALUATORS

Thank you for reviewing our project! Due to the strict time constraints of the hackathon, please be aware of the following important notes to ensure a smooth evaluation process:

### 1. 🔄 Known UI Sync Issue (Reactivity Drop)
You might encounter a known state synchronization issue (loss of reactivity) during critical transitions. Specifically:
- **After successful Registration or Login.**
- **After the system successfully finds an Online Match.**

**The Solution:** If the interface "hangs" or does not redirect you automatically, **PLEASE PRESS F5 (Refresh the page).** 
*Why this happens:* The backend and database work flawlessly (the user is successfully authenticated, and the match is successfully created), but the frontend client sometimes drops the reactivity and requires a manual refresh to read the latest cookies/state. Once you press F5 (and re-enter credentials if prompted once more), the system will instantly let you through.

### 2. 👑 Secret PRO-Mode (Easter Egg)
Our application features premium aesthetics and skins (like Pixel Pets and Cyberpunk themes) monetized via Polar.sh. To allow the jury to test these features **without making a real payment**, we've included a hidden easter egg!
- **How to activate:** Open the **Settings** modal and click exactly **10 times** on the "Settings" title. 
- This will inject a secret flag (`is_pro_demo`) into your browser's `localStorage` and instantly unlock all PRO features for your session!

---

## ✨ Features

- **🤖 Play against AI**: Sharpen your skills by playing locally against a smart computer opponent.
- **🌐 Online Matchmaking**: Instantly find opponents and play across the globe in real-time, powered by **Supabase Realtime**.
- **💬 Ephemeral In-Game Chat**: Communicate with your opponent seamlessly during a match. Messages are transmitted instantly via **Supabase Broadcast** channels and are intentionally not stored in the database to ensure privacy and keep the database clean.
- **🎨 Custom Themes & Skins**: Personalize your game board! Includes standard 3D glass, minimal layouts, and exclusive Pixel-art avatars for our PRO users.
- **🏆 Profiles & Leaderboards**: Track your competitive journey. The system automatically records wins/losses and updates your global **ELO rating**.

---

## 🛠️ Tech Stack

This project was built with modern web development best practices in mind:

- **Frontend Framework:** [Next.js (App Router)](https://nextjs.org/) & [React](https://reactjs.org/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/) for rapid, responsive, and beautiful UI design.
- **Backend & Database:** [Supabase](https://supabase.com/)
  - *PostgreSQL* for reliable relational data storage (Profiles, Matches).
  - *Auth* for secure user registration and login.
  - *Realtime (Broadcast & Postgres Changes)* for instant multiplayer moves and ephemeral chat.
- **Monetization:** [Polar.sh](https://polar.sh/) integrated for managing PRO subscriptions.
- **Deployment:** [Vercel](https://vercel.com/) for lightning-fast edge delivery.

---

## 🚀 Getting Started

Follow these instructions to run the project locally on your machine.

### Prerequisites
- Node.js (v18+ recommended)
- A Supabase Project (Database URL and Anon Key)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ars6nlp/Connect-4.git
   cd "Connect 4"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Initialize the Database:**
   Run the setup script to create the necessary tables, enums, RLS policies, and enable Realtime in your Supabase project:
   ```bash
   DATABASE_URL="postgres://your_connection_string" node scripts/setup-db.js
   ```

5. **Start the Development Server:**
   ```bash
   npm run dev
   ```

6. **Play!**
   Open [http://localhost:3000](http://localhost:3000) in your browser and enjoy!

---
<div align="center">
  <i>Built with ❤️ for the Hackathon</i>
</div>
