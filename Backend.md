# Backend API Integration & Implementation Guidelines

This document details the backend architecture, API design, endpoints, and integration details for the Skill Swap Web Platform. It serves as a blueprint for backend developers to implement robust, secure, and scalable services.

---

## 1. Overview

**Project:** Skill Swap Web Platform  
**Purpose:** Provide a secure, API-driven backend for facilitating community-driven skill exchanges.  
**Tech Stack:**  
- **Framework:** Django with Django REST Framework (DRF)  
- **Authentication:** Django Allauth for OAuth and JWT for session management  
- **Database:** PostgreSQL  
- **Real-time Features:** WebSockets (via Django Channels)  
- **External Integrations:** Google Calendar API, WebRTC (for video calls)

---

## 2. API Design Principles

- **RESTful Architecture:**  
  - Resource-based endpoints using appropriate HTTP verbs (GET, POST, PUT, DELETE)  
- **Versioning:**  
  - Versioned endpoints (e.g., `/api/v1/...`) to enable future enhancements without breaking existing clients  
- **Security:**  
  - Use robust authentication (JWT) and permission classes  
  - Validate all inputs and handle errors gracefully
- **Scalability:**  
  - Modular viewsets and serializers  
  - Optimize queries and consider caching where needed

---

## 3. Endpoints & Routing

### A. Authentication & User Management
- **Endpoints:**
  - `POST /api/v1/auth/login` – User login (issues a JWT token)
  - `POST /api/v1/auth/signup` – Register a new user
  - `POST /api/v1/auth/logout` – Log out the user
  - `POST /api/v1/auth/refresh` – Refresh JWT token
  - `GET /api/v1/auth/profile` – Retrieve the authenticated user's profile
  - `PUT /api/v1/auth/profile` – Update user profile (bio, skills, profile picture)
- **Third-Party OAuth:**
  - Integrate Google OAuth via Django Allauth (handle callbacks and token exchange)

### B. Skill Offers & Listings
- **Endpoints:**
  - `GET /api/v1/offers/` – List all skill swap offers
  - `POST /api/v1/offers/` – Create a new skill offer
  - `GET /api/v1/offers/<offer_id>/` – Retrieve details for a specific offer
  - `PUT /api/v1/offers/<offer_id>/` – Update an existing offer
  - `DELETE /api/v1/offers/<offer_id>/` – Delete an offer
- **Filtering & Sorting:**  
  - Support query parameters (category, skill tags, location, mode)

### C. Chat & Messaging
- **Endpoints:**
  - `GET /api/v1/messages/` – List conversation threads for the user
  - `GET /api/v1/messages/<thread_id>/` – Retrieve messages for a specific conversation
  - `POST /api/v1/messages/<thread_id>/` – Send a new message
- **Real-time Communication:**
  - Use WebSockets (Django Channels) for live chat updates and notifications
- **File Attachments:**
  - Endpoint to handle file uploads associated with messages

### D. Skill Swap Requests & Scheduling
- **Endpoints:**
  - `POST /api/v1/swaps/` – Create a skill swap request
  - `GET /api/v1/swaps/` – List pending/confirmed swap requests
  - `PUT /api/v1/swaps/<swap_id>/` – Update the swap status (accept/reject, reschedule)
- **Calendar Integration:**
  - `POST /api/v1/swaps/<swap_id>/sync-calendar` – Sync session with Google Calendar using the Calendar API

### E. Video Call & Session Management
- **Endpoints:**
  - `POST /api/v1/video-calls/` – Initiate a new video call session (create room, generate tokens)
  - `GET /api/v1/video-calls/<session_id>/` – Retrieve session details (for UI display and session timing)
- **Integration:**
  - Integrate with a signaling server (if necessary) for WebRTC handshake and token distribution

### F. Community, Forums & Reviews
- **Endpoints:**
  - `GET /api/v1/forums/` – List forum categories and topics
  - `POST /api/v1/forums/` – Create a new discussion thread
  - `GET /api/v1/forums/<thread_id>/` – Retrieve posts and replies for a thread
  - `POST /api/v1/reviews/` – Submit a review/rating after a skill swap
  - `GET /api/v1/reviews/<user_id>/` – Retrieve reviews for a specific user

### G. Gamification & User Achievements
- **Endpoints:**
  - `GET /api/v1/leaderboard/` – Retrieve the ranking of top skill swappers
  - `GET /api/v1/achievements/` – Retrieve available badges and user progress
  - `POST /api/v1/achievements/` – Update or award badges based on user activity

---

## 4. Database Schema & Models

Define models to reflect key resources:

- **User Model:**  
  - Extend Django’s default User model or use a custom user model with fields such as bio, skill tags, profile picture, and ratings.

- **SkillOffer Model:**  
  - Fields: title, description, images, offered skills, desired skills, mode (online/offline), created_by, timestamps

- **SwapRequest Model:**  
  - Fields: requestor, responder, status (pending, accepted, rejected), scheduled_time, calendar event ID

- **Message Model:**  
  - Fields: thread ID, sender, recipient, message content, timestamp, attachment reference

- **Review Model:**  
  - Fields: reviewer, reviewee, rating, comments, associated swap request

- **Session/VideoCall Model:**  
  - Fields: session ID, participants, token details, session duration, timestamps

Ensure proper relationships (foreign keys), indexing for search/filter operations, and data integrity constraints.

---

## 5. API Authentication & Security

- **JWT Authentication:**  
  - Secure endpoints using JSON Web Tokens and configure DRF permission classes (e.g., `IsAuthenticated`, `IsOwner`)
- **Input Validation:**  
  - Use DRF serializers to validate input and return meaningful error messages
- **Rate Limiting & CORS:**  
  - Implement rate limiting for sensitive endpoints and configure CORS to allow frontend access only
- **Error Handling:**  
  - Standardize error responses with proper HTTP status codes and descriptive messages

---

## 6. Real-Time Features & External Integrations

### A. WebSockets & Chat Integration
- Use Django Channels to handle real-time messaging and notifications.
- Authenticate WebSocket connections using JWT tokens.

### B. Google Calendar API Integration
- Implement endpoints to interact with Google Calendar for syncing scheduling details.
- Secure calendar operations using OAuth tokens.

### C. Video Call Integration (WebRTC)
- Provide endpoints for session creation and management.
- Integrate with a signaling server (if needed) to handle WebRTC handshakes and token distribution.

---

## 7. Example Code Snippets & Best Practices

### A. Sample Serializer for Skill Offers

```python
from rest_framework import serializers
from .models import SkillOffer

class SkillOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillOffer
        fields = ['id', 'title', 'description', 'offered_skills', 'desired_skills', 'mode', 'created_by', 'created_at']
        read_only_fields = ['id', 'created_by', 'created_at']
