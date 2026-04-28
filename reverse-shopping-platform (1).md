# 🔁 Reverse Shopping Platform — Let Sellers Compete

> **"Don't search for products. Post what you want. Let the market come to you."**

---

## 📌 Table of Contents

1. [Problem Statement](#problem-statement)
2. [The Big Idea](#the-big-idea)
3. [Why It Stands Out](#why-it-stands-out)
4. [Core Features](#core-features)
5. [System Architecture](#system-architecture)
6. [Database Design](#database-design)
7. [API Design](#api-design)
8. [Real-Time Engine](#real-time-engine)
9. [Scalability Strategy](#scalability-strategy)
10. [Security & Trust](#security--trust)
11. [Tech Stack](#tech-stack)
12. [Revenue Model](#revenue-model)
13. [Roadmap](#roadmap)

---

## 🚨 Problem Statement

Customers today face **three invisible taxes** when shopping:

| Pain Point | Impact |
|---|---|
| Comparing prices across 5–10 apps | Wastes 30–60 mins per purchase |
| Sellers control what gets seen (ads, SEO) | Buyers get manipulated, not informed |
| No negotiation power for individuals | Bulk buyers win, regular users lose |

> The current model: **Buyer searches → Seller wins.**
> The new model: **Buyer declares → Sellers compete.**

---

## 💡 The Big Idea

A **Demand-First Marketplace** where:

```
User posts a "Buy Request" → Sellers receive intent signal
     → Sellers send competitive offers
          → Buyer reviews, negotiates, accepts
               → Transaction completes
```

This **flips the Amazon model** entirely. Instead of sellers listing products and buyers finding them, buyers list their needs and sellers find them.

---

## 🌟 Why It Stands Out

- **Business model innovation**, not just technology
- Puts **negotiation power** back in the buyer's hands
- Sellers gain **qualified leads** instead of paying for impressions
- Works across categories: electronics, groceries, services, B2B procurement
- Reduces **information asymmetry** between buyer and seller

---

## ⚙️ Core Features

### 1. 📋 Buy Request System
- Buyer posts a structured request: product name, specs, budget range, deadline
- Visibility controls: public, regional, or category-specific
- Request expiry timer (1hr / 6hr / 24hr / custom)

### 2. 💰 Price Bidding Engine
- Real-time blind auction (sellers can't see competitor offers)
- Seller submits: price, quantity, delivery ETA, warranty
- Buyer sees ranked offers after minimum 3 bids or deadline

### 3. ⭐ Seller Rating System
- Post-transaction ratings (speed, accuracy, price honesty)
- Verified badge for KYC-approved sellers
- Bid win/loss ratio tracked to detect fake low offers

### 4. 💬 Negotiation Chat
- Private 1:1 chat per offer (buyer ↔ seller)
- Chat auto-expires when deal is accepted or rejected
- Offer amendment allowed once per seller before buyer decision

### 5. 🔔 Smart Notification Layer
- Push alerts to sellers matching buy request category
- Buyer notified when new offer arrives or offer nears expiry
- ML-based matching to surface relevant sellers first

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                             │
│   [Mobile App]     [Web App]     [Seller Dashboard]             │
│   React Native     Next.js          React + Vite                │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY                                │
│           Kong / AWS API Gateway (Rate Limiting, Auth)          │
└──────┬─────────────────┬──────────────────┬─────────────────────┘
       │                 │                  │
┌──────▼──────┐  ┌───────▼──────┐  ┌───────▼──────┐
│  Auth        │  │  Buy Request │  │  Offer       │
│  Service     │  │  Service     │  │  Service     │
│  (JWT/OAuth) │  │  (CRUD +     │  │  (Bid Engine │
│              │  │   Matching)  │  │   + Ranking) │
└──────┬───────┘  └───────┬──────┘  └───────┬──────┘
       │                  │                 │
┌──────▼──────┐  ┌────────▼─────┐  ┌────────▼─────┐
│  Chat        │  │  Notification│  │  Rating      │
│  Service     │  │  Service     │  │  Service     │
│  (WebSocket) │  │  (Push/Email)│  │  (Review +   │
│              │  │              │  │   Analytics) │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
┌──────▼─────────────────▼─────────────────▼───────────────────┐
│                    MESSAGE BROKER                              │
│                  Apache Kafka                                  │
│   Topics: buy_requests | offers | chat | notifications        │
└────────────────────────┬──────────────────────────────────────┘
                         │
┌────────────────────────▼──────────────────────────────────────┐
│                    DATA LAYER                                  │
│                                                                │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────────┐ │
│  │ PostgreSQL  │  │    Redis     │  │    Elasticsearch      │ │
│  │ (Core Data) │  │  (Cache +    │  │  (Full-text Search +  │ │
│  │             │  │   Sessions)  │  │   Offer Discovery)    │ │
│  └─────────────┘  └──────────────┘  └───────────────────────┘ │
│                                                                │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │         MongoDB (Chat History + Unstructured Data)      │  │
│  └─────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

### Microservices Breakdown

| Service | Responsibility | Tech |
|---|---|---|
| **Auth Service** | Login, JWT, OAuth, KYC | Node.js + Passport |
| **Buy Request Service** | Post/manage requests, seller matching | Go |
| **Offer Service** | Bid handling, ranking, blind auction | Go |
| **Chat Service** | Real-time 1:1 negotiation | Node.js + Socket.io |
| **Notification Service** | Push, email, in-app alerts | Python + Firebase |
| **Rating Service** | Review submission, score aggregation | Python |
| **Analytics Service** | Dashboards, fraud detection | Python + Spark |

---

## 🗃️ Database Design

### PostgreSQL — Core Entities

```sql
-- Buyers & Sellers unified
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role          ENUM('buyer', 'seller', 'both') NOT NULL,
  name          VARCHAR(255),
  email         VARCHAR(255) UNIQUE NOT NULL,
  phone         VARCHAR(20),
  kyc_verified  BOOLEAN DEFAULT FALSE,
  rating_score  DECIMAL(3,2) DEFAULT 0.00,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Buyer posts a need
CREATE TABLE buy_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id        UUID REFERENCES users(id),
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  category        VARCHAR(100),
  budget_min      DECIMAL(12,2),
  budget_max      DECIMAL(12,2),
  quantity        INTEGER DEFAULT 1,
  location        GEOGRAPHY(Point, 4326),
  expires_at      TIMESTAMPTZ NOT NULL,
  status          ENUM('open','under_review','closed','fulfilled') DEFAULT 'open',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Seller responds with an offer
CREATE TABLE offers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id      UUID REFERENCES buy_requests(id),
  seller_id       UUID REFERENCES users(id),
  price           DECIMAL(12,2) NOT NULL,
  delivery_days   INTEGER,
  warranty_days   INTEGER,
  note            TEXT,
  status          ENUM('pending','accepted','rejected','withdrawn') DEFAULT 'pending',
  submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Post-deal ratings
CREATE TABLE ratings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reviewer_id     UUID REFERENCES users(id),
  reviewee_id     UUID REFERENCES users(id),
  offer_id        UUID REFERENCES offers(id),
  score           SMALLINT CHECK (score BETWEEN 1 AND 5),
  comment         TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Redis — Caching Strategy

```
Key Pattern                         TTL        Purpose
─────────────────────────────────────────────────────────────
request:{id}:offers                 5 min      Cached offer list per request
user:{id}:session                   24 hrs     JWT session data
seller:{id}:active_bids             10 min     Seller's current open bids
category:{name}:top_sellers         1 hr       Pre-ranked sellers per category
```

### MongoDB — Chat Collections

```json
{
  "collection": "chats",
  "document": {
    "_id": "ObjectId",
    "offer_id": "UUID",
    "buyer_id": "UUID",
    "seller_id": "UUID",
    "messages": [
      {
        "sender": "buyer",
        "text": "Can you reduce the price by 5%?",
        "timestamp": "ISODate",
        "read": true
      }
    ],
    "status": "active | archived",
    "created_at": "ISODate"
  }
}
```

---

## 🔌 API Design

### RESTful Endpoints

```
POST   /api/v1/requests              → Create a buy request
GET    /api/v1/requests/:id          → Get request details
GET    /api/v1/requests/:id/offers   → Get all offers (buyer only)
POST   /api/v1/offers                → Submit an offer (seller)
PATCH  /api/v1/offers/:id            → Amend an offer (once only)
POST   /api/v1/offers/:id/accept     → Buyer accepts offer
POST   /api/v1/ratings               → Submit rating post-deal
GET    /api/v1/sellers/:id/profile   → Public seller profile
```

### WebSocket Events (Chat)

```
Event                      Direction    Payload
────────────────────────────────────────────────────────
chat:message               Bi-directional  { text, timestamp }
chat:typing                Bi-directional  { userId }
offer:amended              Server → Buyer  { offerId, newPrice }
deal:accepted              Server → Both   { offerId, buyerId }
request:expired            Server → Seller { requestId }
```

---

## ⚡ Real-Time Engine

### Kafka Topics & Flow

```
[Buyer posts request]
       │
       ▼
  Topic: buy_requests
       │
       ├──► Matching Consumer → finds relevant sellers by category + location
       │                      → publishes to: seller_notifications
       │
       └──► Search Consumer  → indexes request in Elasticsearch

[Seller submits offer]
       │
       ▼
  Topic: offers
       │
       ├──► Offer Ranker    → scores by price, rating, speed
       │                    → updates Redis cache
       │
       └──► Buyer Notifier  → triggers push notification to buyer

[Chat message sent]
       │
       ▼
  Topic: chat_messages
       │
       └──► Stored in MongoDB + delivered via WebSocket
```

### Seller Matching Algorithm

```python
def match_sellers(request):
    candidates = elasticsearch.search({
        "query": {
            "bool": {
                "must": [
                    {"match": {"categories": request.category}},
                    {"range": {"avg_price": {
                        "gte": request.budget_min * 0.8,
                        "lte": request.budget_max * 1.2
                    }}}
                ],
                "should": [
                    {"geo_distance": {
                        "distance": "50km",
                        "location": request.location
                    }}
                ]
            }
        }
    })

    # Score = (rating * 0.4) + (response_rate * 0.3) + (location_score * 0.3)
    return ranked_by_composite_score(candidates)
```

---

## 📈 Scalability Strategy

### Horizontal Scaling

```
Load Balancer (NGINX / AWS ALB)
        │
   ┌────┴────┐
   ▼         ▼
[App Pod 1] [App Pod 2]  ← Kubernetes HPA (auto-scale on CPU/RPS)
   ▼         ▼
[DB Read Replicas] ← All read queries routed here
[DB Primary]       ← Write operations only
```

### Caching Layers

```
Request →  CDN (static assets, 99% cache hit)
        →  Redis L1 (hot data: 10ms response)
        →  PostgreSQL Read Replica (cold queries: 50ms)
        →  Elasticsearch (full-text search: 30ms)
```

### Estimated Load Handling

| Metric | Capacity |
|---|---|
| Concurrent WebSocket connections | 100,000+ |
| Buy requests per second | 5,000 RPS |
| Offers per second (peak) | 20,000 RPS |
| Kafka throughput | 1M messages/sec |
| Redis cache hit target | > 85% |

---

## 🔐 Security & Trust

### Anti-Fraud Mechanisms

- **Seller bid velocity check**: Max 50 offers per hour per seller
- **Price sanity filter**: Offers 80% below market median are flagged
- **KYC gate**: Sellers need phone + business verification to bid on orders > ₹10,000
- **Buyer intent verification**: Buyers with >30% abandonment rate get flagged

### Data Security

```
- All passwords: bcrypt (cost factor 12)
- JWT tokens: RS256 signed, 15-min access + 7-day refresh
- Chat messages: AES-256 encrypted at rest
- PII data: Tokenized before storing in analytics pipelines
- HTTPS: TLS 1.3 only
- SQL Injection: Parameterized queries only (no raw SQL from user input)
```

---

## 🛠️ Tech Stack

### Full Stack Overview

```
Layer               Technology              Why
────────────────────────────────────────────────────────────────────
Frontend (Web)      Next.js 14              SSR, SEO, performance
Frontend (Mobile)   React Native + Expo     Cross-platform
API Gateway         Kong                    Rate limiting, auth plugins
Auth Service        Node.js + Passport      OAuth2, JWT
Core Services       Go (Golang)             High throughput, low latency
Chat Service        Node.js + Socket.io     WebSocket simplicity
ML Matching         Python + scikit-learn   Seller relevance scoring
Message Broker      Apache Kafka            Async, durable, scalable
Primary DB          PostgreSQL 16           ACID, relational integrity
Cache               Redis 7                 Sub-ms latency
Search              Elasticsearch 8         Full-text + geo queries
Chat Storage        MongoDB Atlas           Flexible document schema
File Storage        AWS S3                  Product images in requests
Infra               Kubernetes + Helm       Container orchestration
CI/CD               GitHub Actions          Automated pipelines
Monitoring          Prometheus + Grafana    Metrics & alerting
Logging             ELK Stack              Centralized log management
```

---

## 💵 Revenue Model

| Stream | Mechanism | % of Revenue |
|---|---|---|
| **Success Fee** | 2–5% commission on completed deals | 60% |
| **Seller Boost** | Pay to appear in top 3 offer slots | 20% |
| **Premium Seller Plan** | Unlimited bids + analytics dashboard | 12% |
| **B2B SaaS API** | Procurement teams embed the engine | 8% |

---

## 🗺️ Roadmap

### Phase 1 — MVP (Month 1–3)
- [ ] User auth (buyers + sellers)
- [ ] Buy request creation
- [ ] Offer submission (no real-time yet)
- [ ] Manual chat via in-app messaging
- [ ] Basic star rating

### Phase 2 — Real-Time (Month 4–6)
- [ ] WebSocket offer notifications
- [ ] Kafka-powered seller matching
- [ ] Offer ranking algorithm
- [ ] Redis caching layer
- [ ] Seller KYC flow

### Phase 3 — Intelligence (Month 7–9)
- [ ] ML-based seller-request matching
- [ ] Price anomaly detection (fraud)
- [ ] Buyer preference learning
- [ ] Seller analytics dashboard

### Phase 4 — Scale (Month 10–12)
- [ ] B2B procurement API
- [ ] Multi-region deployment
- [ ] Native mobile app
- [ ] White-label solution for enterprises

---

## 🧠 Unique Architecture Decisions

### Why Blind Bidding?
Sellers can't see each other's offers. This prevents collusion and ensures genuinely competitive pricing — similar to Vickrey auctions used in ad tech, applied to e-commerce.

### Why Go for Core Services?
Buy Request and Offer Services handle the most time-sensitive operations. Go's goroutines allow handling 10,000+ concurrent offer submissions with minimal memory footprint.

### Why Kafka over RabbitMQ?
Kafka retains events for 7 days (configurable). If a notification consumer is down, it replays missed events when it comes back — no lost seller notifications.

### Why Separate Chat in MongoDB?
Chat threads are unbounded in message count and have no fixed schema. MongoDB's document model handles this naturally without complex JOINs or table migrations.

---

> **Built for the buyer. Powered by competition. Trusted through transparency.**

---

*Version 1.0 — Reverse Shopping Platform System Design*
*Open for contribution, feedback, and forks.*
