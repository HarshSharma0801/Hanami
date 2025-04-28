# Hanami Affiliate Marketing Platform

Hanami is a comprehensive affiliate marketing platform that empowers both brands and affiliates to track, manage, and optimize their campaigns and traffic. The platform provides robust analytics, campaign management, affiliate onboarding, and transparent conversion tracking, all in a modern, scalable architecture.

---

## Table of Contents
- [Features](#features)
- [Architecture Overview](#architecture-overview)
- [Monorepo Structure](#monorepo-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Overview](#api-overview)
- [Database Schema](#database-schema)
- [Tracking SDK](#tracking-sdk)
- [Contributing](#contributing)

---

## Features
- **Campaign Management:** Brands can create, manage, and analyze affiliate campaigns.
- **Affiliate Onboarding:** Affiliates can register, receive invites, and join campaigns.
- **Comprehensive Analytics:** Real-time dashboards for traffic, conversions, revenue, and campaign performance.
- **Conversion Tracking:** End-to-end tracking of clicks and sales via a lightweight SDK.
- **Multi-Channel Support:** Track traffic from WhatsApp, Instagram, YouTube, and more.
- **Secure Authentication:** Role-based access for brands and affiliates.

---

## Architecture Overview

![Hanami](https://github.com/user-attachments/assets/772d93b6-2dd8-4d39-8a43-5b5c05ff1fdd)


**Key Components:**
- **Hanami Frontend:** Next.js-based dashboard for brands and affiliates to view analytics, manage campaigns, and access documentation.
- **Hanami API:** Go-based REST API serving all business logic, analytics, authentication, and campaign management.
- **Brand Application:** Integrates the Hanami Tracking SDK to capture traffic and conversions from multiple channels.
- **Hanami Tracking SDK:** Lightweight JavaScript SDK for tracking user actions and conversions, setting cookies, and sending data to the Hanami API.
- **Traffic Sources:** WhatsApp, Instagram, YouTube, and other platforms drive traffic to the brand's application, tracked via unique links.

**Data Flow:**
1. Brands and affiliates interact with the Hanami Frontend.
2. The Frontend communicates with the Hanami API for all data operations.
3. The Brand's own application integrates the Hanami Tracking SDK, which collects cookies/events and sends conversion data to the API.
4. Traffic from various sources is tracked and attributed to the correct affiliate/campaign.

---

## Monorepo Structure
```
Hanami/
├── client/         # Next.js frontend (dashboard)
├── server/         # Go backend (REST API)
├── tracking-sdk/   # Lightweight JS SDK for tracking
├── hanami.sql      # Database schema (PostgreSQL)
```

---

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS, Chart.js, Tremor, Radix UI, React Query
- **Backend:** Go (Gin, SQLC), PostgreSQL
- **SDK:** JavaScript (compatible with Next.js)

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- Go (v1.23+)
- PostgreSQL

### 1. Clone the repository
```bash
git clone <repo-url>
cd Hanami
```

### 2. Setup the Database
- Use the provided `hanami.sql` to set up the PostgreSQL schema.

### 3. Start the Backend
```bash
cd server
cp .env.example .env # Update DB_URL, DRIVER, etc.
go run main.go
```

### 4. Start the Frontend
```bash
cd ../client
npm install
npm run dev
```

### 5. Tracking SDK Integration
- For brands, integrate the SDK from `tracking-sdk/loader.js` into your application to enable event and conversion tracking.

---

## API Overview
The Hanami API exposes REST endpoints for:
- **User & Authentication:** Register/login for brands and affiliates
- **Campaigns:** Create, update, delete, and list campaigns
- **Invites:** Send and manage campaign invites
- **Tracking Links:** Generate and manage unique tracking links
- **Analytics:** Retrieve real-time metrics for traffic, revenue, conversions, and more
- **Conversions:** Record and fetch conversion data

See [server/api/](server/api/) for detailed handler implementations.

---

## Database Schema
- See [`hanami.sql`](hanami.sql) for a detailed schema including users, brands, affiliates, campaigns, tracking links, clicks, conversions, and sales.

---

## Tracking SDK
- The SDK is designed to be easily integrated into any web application.
- Usage example (see `tracking-sdk/loader.js`):
  ```html
  <script src="/tracking-sdk/loader.js"></script>
  ```
- The SDK will automatically set cookies and send conversion/click data to the Hanami API.

---

## Contributing
1. Fork the repo
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

---

## License
MIT

---

## Contact
For questions, reach out to the maintainer.

---

Hanami © 2025
