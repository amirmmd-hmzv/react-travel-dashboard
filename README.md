<p align="center">
  <img src="/assets/images/banner-readme.png" alt="Teal Horizon - AI-Powered Travel Platform" width="100%">
</p>

<h1 align="center">🌍 Teal Horizon</h1>

<p align="center">
  <strong>AI-Powered Travel Itinerary & Dashboard Platform</strong>
  <br>
  A full-stack React application that generates personalized day-by-day travel plans using Google Gemini AI, with an admin dashboard for analytics and management.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react" alt="React 19">
  <img src="https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter" alt="React Router 7">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss" alt="Tailwind CSS 4">
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript" alt="TypeScript 5">
  <img src="https://img.shields.io/badge/Appwrite-21-FD366E?logo=appwrite" alt="Appwrite 21">
  <img src="https://img.shields.io/badge/Gemini_AI-0F9D58?logo=google" alt="Gemini AI">
  <img src="https://img.shields.io/badge/SSR-enabled-22C55E" alt="SSR">
</p>

---

## ✨ Features

### 🤖 AI-Powered Trip Generation
- Generates complete day-by-day itineraries using **Google Gemini AI** based on destination, duration, budget, travel style, interests, and group type
- Each trip includes estimated pricing, weather info, best time to visit, and location data
- Auto-fetches relevant destination images from **Unsplash**

### 🔐 Authentication
- **Google OAuth** sign-in via Appwrite
- Secure session management with cookie sync for SSR
- User profiles with role-based access (`user` / `admin`)

### 🏠 Public Experience
- **Landing page** — hero section, featured destinations, how-it-works, testimonials, and CTA
- **Browse trips** — paginated grid of all AI-generated trips
- **Trip details** — full itinerary viewer with day-by-day breakdown, gallery, weather, and booking
- **My Bookings** — personalized list of booked trips with confirmation status

### 📊 Admin Dashboard
- **Analytics** — stats cards for total users, total trips, active users with monthly trends
- **Charts** — user growth (area/bar chart), trip trends by travel style (bar chart) with Recharts
- **User management** — paginated table with avatars, email, join date, trip count, and role badges
- **Trip management** — view all trips, create new ones via AI, view individual trip details

### 🎨 UI/UX
- **Fully responsive** — mobile sidebar, adaptive layouts, touch-friendly components
- **shadcn/ui** components — buttons, dialogs, popovers, tables, cards, skeletons
- **Interactive world map** — SVG map highlighting the selected destination on trip creation
- **Toast notifications** — real-time feedback with sonner
- **Loading states** — skeleton loaders throughout for smooth UX

### 🛡️ Error Monitoring
- Sentry integration for both frontend and backend error tracking
- Profiling support for server-side performance

---

## 🖼️ Screenshots

### Dashboard
<div align="center">
  <table>
    <tr>
      <td><img src="/assets/screenshots/1%20Dashboard.PNG" alt="Dashboard Overview" width="100%"></td>
      <td><img src="/assets/screenshots/2%20Dashboard.PNG" alt="Dashboard Charts" width="100%"></td>
    </tr>
    <tr>
      <td align="center"><em>Dashboard overview with stats</em></td>
      <td align="center"><em>Analytics charts & tables</em></td>
    </tr>
    <tr>
      <td><img src="/assets/screenshots/3%20Dashboard.PNG" alt="Admin Trips" width="100%"></td>
      <td><img src="/assets/screenshots/4%20Dashboard.PNG" alt="User Management" width="100%"></td>
    </tr>
    <tr>
      <td align="center"><em>Admin trip listing</em></td>
      <td align="center"><em>User management table</em></td>
    </tr>
  </table>
</div>

### Travel
<div align="center">
  <table>
    <tr>
      <td><img src="/assets/screenshots/1%20travel.PNG" alt="Landing Page" width="100%"></td>
      <td><img src="/assets/screenshots/2%20travel.PNG" alt="Trip Details" width="100%"></td>
    </tr>
    <tr>
      <td align="center"><em>Landing page hero</em></td>
      <td align="center"><em>Trip detail with itinerary</em></td>
    </tr>
    <tr>
      <td><img src="/assets/screenshots/3%20travel.PNG" alt="Browse Trips" width="100%"></td>
      <td><img src="/assets/screenshots/4%20travel.PNG" alt="My Bookings" width="100%"></td>
    </tr>
    <tr>
      <td align="center"><em>Browse all trips</em></td>
      <td align="center"><em>My Bookings page</em></td>
    </tr>
  </table>
</div>

---

## 🏗️ Tech Stack

### Core
| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **React Router 7** | Routing, loaders, actions, SSR |
| **TypeScript 5** | Type safety |
| **Vite 7** | Build tool & dev server |

### Styling
| Technology | Purpose |
|---|---|
| **Tailwind CSS 4** | Utility-first styling |
| **shadcn/ui** | Component primitives (Radix-based) |
| **Lucide React / React Icons** | Icon libraries |
| **Recharts** | Dashboard charts |
| **Sonner** | Toast notifications |

### Backend & APIs
| Technology | Purpose |
|---|---|
| **Appwrite 21** | Authentication, database, OAuth |
| **Google Gemini AI** | AI-powered itinerary generation |
| **Unsplash API** | Destination photography |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Node.js** | Runtime |
| **Docker** | Containerization |
| **Sentry** | Error monitoring & profiling |

---

## 🗺️ Route Structure

```
/                     → Landing page (featured + popular trips)
/sign-in              → Google OAuth sign-in
/trips                → Browse all trips (paginated)
/travel/:tripId       → Trip details + booking
/my-bookings          → User's booked trips

/admin/dashboard      → Analytics & charts
/admin/trips          → Manage all trips
/admin/trips/create   → AI trip creation form
/admin/trips/:tripId  → Trip detail view
/admin/all-users      → User management

/api/create-trip      → POST — generates trip via Gemini AI
/api/create-booking   → POST — creates a booking
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm
- Appwrite project (cloud or self-hosted)
- Google Gemini AI API key
- Unsplash API access key

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/react-travel-dashboard.git
cd react-travel-dashboard

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Environment Variables

Fill in your `.env.local`:

```env
# Appwrite
VITE_APPWRITE_API_ENDPOINTS=https://cloud.appwrite.io/v1
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
VITE_APPWRITE_USERS_COLLECTION_ID=your_users_collection_id
VITE_APPWRITE_TRIPS_COLLECTION_ID=your_trips_collection_id
VITE_APPWRITE_BOOKINGS_COLLECTION_ID=your_bookings_collection_id

# Server keys (never exposed to client)
APPWRITE_API_KEY=your_appwrite_api_key
GOOGLE_AI_API_KEY=your_gemini_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
```

### Development

```bash
npm run dev
```

Your app will be available at `http://localhost:5173`.

### Build & Production

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t teal-horizon .
docker run -p 3000:3000 teal-horizon
```

---

## 📁 Project Structure

```
├── app/
│   ├── components/
│   │   ├── layout/          # SiteHeader, NavItems, MobileSidebar, SiteFooter
│   │   ├── sections/        # LandingHero, FeaturedDestinations, WorldMap, etc.
│   │   ├── trip/            # TripCard, TripDetailsBody, TripPills, etc.
│   │   ├── ui/              # shadcn primitives (button, combobox, table, etc.)
│   │   ├── AsyncTripGrid.tsx
│   │   ├── CustomTable.tsx
│   │   ├── StatsCard.tsx
│   │   ├── EmptyState.tsx
│   │   └── ...
│   ├── hooks/               # useCurrentUser (UserContext + provider)
│   ├── routes/
│   │   ├── root/            # Public pages + sign-in
│   │   ├── admin/           # Admin pages
│   │   ├── api/             # Server actions
│   │   ├── payment/         # Booking confirmation
│   │   └── routes.ts        # Route config
│   ├── constants/           # Sidebar items, form options
│   ├── types.ts             # TypeScript interfaces
│   ├── root.tsx             # Root layout + UserProvider
│   └── app.css              # Global styles
├── lib/
│   ├── appwrite/            # Client, server, auth, trips, bookings, dashboard
│   ├── utils.ts             # cn, formatDate, parseJSON, trends
│   ├── client-user.ts       # getClientUser helper
│   └── tripDetails.ts       # Pill colors helpers
├── public/
│   ├── assets/
│   │   ├── icons/
│   │   ├── images/          # Banner, logos
│   │   └── screenshots/     # Project screenshots
│   └── ...
├── Dockerfile
├── vite.config.ts
└── react-router.config.ts
```

---

## ⚙️ How It Works

1. **Sign in** with your Google account via Appwrite OAuth
2. **Browse** AI-generated trips on the public pages or admin panel
3. **Create a trip** (admin only) by selecting a country, duration, travel style, interests, budget, and group type
4. **Gemini AI** generates a complete day-by-day itinerary with estimated pricing
5. **Unsplash** provides beautiful destination images automatically
6. **Book a trip** and view your bookings in "My Bookings"
7. **Admins** can monitor platform analytics, user growth, and trip trends on the dashboard

---

## 🤝 Contributing

This is a portfolio project. Feel free to fork, explore, and adapt it for your own use.

---

## 📄 License

MIT
