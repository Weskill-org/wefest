# 🚀 WeFest: The Digital Backbone of College Festivals

**WeFest** is a comprehensive, end-to-end management ecosystem designed specifically for the college festival landscape. It serves as a closed-network platform that connects students, organizers, and sponsors through a verified, identity-based infrastructure.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Stack: TanStack Start](https://img.shields.io/badge/Stack-TanStack%20Start-FF4154?logo=react&logoColor=white)](https://tanstack.com/router/latest/docs/framework/react/start/overview)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

---

## 🌟 Vision
To become the official digital infrastructure layer for college festivals globally—streamlining everything from planning and sponsorship to ticketing and real-time analytics. WeFest isn't just an app; it's a data intelligence engine for brands and a seamless experience for students.

## ✨ Key Capabilities

### 🎓 For Students
- **Identity-Verified Access**: Secure signup linked to specific college identities.
- **Event Discovery**: Personalized recommendations for fests across the campus network.
- **Smart Ticketing**: Seamless purchase and QR-based entry verification.
- **Talent Showcase**: Dedicated spotlight for student talent and leadership.

### 🏢 For Organizers
- **Event Management**: Professional tools for hosting, updating, and managing festivals.
- **Society Controls**: Integrated team and society management systems.
- **Financial Dashboard**: Real-time tracking of ticket sales and revenue.
- **Analytics**: Heatmaps and student engagement metrics to optimize fest performance.

### 🤝 For Sponsors
- **Sponsor Matching**: AI-driven discovery to connect brands with the right festivals.
- **ROI Tracking**: Deep-dive analytics on brand visibility and student interaction.
- **Direct Engagement**: Targeted marketing within campus-specific ad networks.

### 🛡️ For Admins
- **Multi-Tenant Control**: Role-based access control (Student, Organizer, Sponsor, Admin).
- **College Approval System**: End-to-end verification logic for onboarding new institutions.
- **Content Moderation**: Centralized management of ads, blogs, and event listings.

---

## 🛠️ Tech Stack

WeFest is built on a high-performance, scalable architecture:

- **Framework**: [TanStack Start](https://tanstack.com/router/latest/docs/framework/react/start/overview) (React 19, TanStack Router, TanStack Query)
- **Runtime**: [Bun](https://bun.sh/)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Styling**: [Tailwind CSS 4.0](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/) (Radix UI)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Payments**: [Razorpay](https://razorpay.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

---

## 🚀 Getting Started

### Prerequisites
- [Bun](https://bun.sh/) installed on your machine.
- A [Supabase](https://supabase.com/) project for backend services.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Weskill-org/wefest.git
   cd wefest
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
   VITE_SUPABASE_PROJECT_ID=your_project_id
   ```

4. **Start the development server:**
   ```bash
   bun run dev
   ```

The application will be available at `http://localhost:3000`.

---

## 📂 Project Structure

```text
src/
├── components/     # Reusable UI components (Shadcn + Custom)
├── hooks/          # Custom React hooks
├── lib/            # Utility functions and shared logic
├── routes/         # File-based routing (TanStack Router)
├── types/          # TypeScript definitions
└── supabase/       # Edge functions and database migrations
```

---

## 📈 Roadmap & Marketing

WeFest is continuously evolving. Key focus areas include:
- **SEO Optimization**: Dynamic meta tags and JSON-LD schema for all events.
- **Legal Compliance**: Comprehensive Privacy, Refund, and Cookie policies.
- **Campus Ambassador Program (CAP)**: Gamified rewards for student leaders across 500+ colleges.
- **The WeFest Blog**: "The Campus Pulse" – a high-authority blog for event mastery and student spotlights.

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.

---
Built with ❤️ for the college community by [Weskill](https://github.com/Weskill-org).
