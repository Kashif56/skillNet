# SkillNet API Endpoint Explanations & Database Models

This document provides detailed explanations of the API endpoints and database models used in the SkillNet (Skill Swap) project. Use this as a blueprint to build robust, secure, and scalable backend services.

---
## APPS FOR DJANGO
- core - for general api endpoints
- chats - for chat related endpoints
- userprofile - for user profile related endpoints
- gigs - for gig related endpoints
- dashboard - for dashboard related endpoints

## 1. API Endpoints

Each endpoint is versioned (e.g., `/api/`) and follows RESTful design principles using the appropriate HTTP methods (GET, POST, PUT, DELETE).

---

### A. Authentication & User Management

#### `POST /api/v1/auth/login`
- **Purpose:** Authenticate a user using provided credentials (typically email and password).
- **Process:**
  - Accepts a JSON payload with user credentials.
  - Verifies credentials and returns a JWT token upon success.
  - Handles errors such as invalid credentials.

#### `POST /api/v1/auth/signup`
- **Purpose:** Register a new user in the system.
- **Process:**
  - Accepts registration details (name, email, password, etc.) via a JSON payload.
  - Creates a new user record along with an associated user profile.
  - May trigger additional actions (e.g., sending a verification email).

#### `POST /api/v1/auth/logout`
- **Purpose:** Log out the authenticated user.
- **Process:**
  - Invalidates the current JWT token.
  - Optionally clears session data on the server.

#### `POST /api/v1/auth/refresh`
- **Purpose:** Refresh the JWT token when it is nearing expiration.
- **Process:**
  - Accepts a refresh token or the current token.
  - Validates and returns a new access token.

#### `GET /api/v1/auth/profile`
- **Purpose:** Retrieve the profile details of the authenticated user.
- **Process:**
  - Uses the JWT token for authentication.
  - Returns user profile data such as name, bio, skills, and profile picture.

#### `PUT /api/v1/auth/profile`
- **Purpose:** Update the authenticated user's profile.
- **Process:**
  - Accepts a JSON payload with fields to update (e.g., bio, skills, profile picture).
  - Validates and updates the user profile in the database.

#### Third-Party OAuth Integration (Google OAuth via Django Allauth)
- **Purpose:** Allow users to sign in using Google credentials.
- **Process:**
  - Manages OAuth callbacks and token exchanges.
  - Integrates into the authentication flow using Django Allauth.

---

### B. Skill Offers & Listings

#### `GET /api/v1/gigs?search=`
- **Purpose:** Retrieve a list of all available skill swap offers.
- **Process:**
  - Supports query parameters for filtering (e.g., category, skill tags, location, mode).
  - Returns a paginated list of offers with basic details.

#### `POST /api/v1/create-gig/`
- **Purpose:** Create a new skill offer.
- **Process:**
  - Accepts a JSON payload with details such as title, description, offered skills, desired skills, and mode (online/offline).
  - Associates the offer with the authenticated user.

#### `GET /api/v1/gigs/<gig_id>/`
- **Purpose:** Retrieve detailed information for a specific offer.
- **Process:**
  - Uses `<gig_id>` to fetch full details, including creator information and timestamps.

#### `PUT /api/v1/gigs/<gig_id>/`
- **Purpose:** Update an existing skill offer.
- **Process:**
  - Accepts a JSON payload with updates.
  - Validates that the authenticated user is the owner before updating the record.

#### `DELETE /api/v1/gigs/<gig_id>/`
- **Purpose:** Delete a specific offer.
- **Process:**
  - Validates user permissions.
  - Removes the offer from the database while handling any cascading relationships.

---

### C. Chat & Messaging

#### `GET /api/v1/messages/`
- **Purpose:** List all conversation threads for the authenticated user.
- **Process:**
  - Retrieves conversation summaries, including metadata like the last message timestamp.

#### `GET /api/v1/messages/<thread_id>/`
- **Purpose:** Retrieve all messages within a specific conversation thread.
- **Process:**
  - Returns the complete conversation including sender details and timestamps.

#### `POST /api/v1/messages/<thread_id>/`
- **Purpose:** Send a new message in an existing conversation.
- **Process:**
  - Accepts message content (and optional file attachments) as a JSON payload.
  - Saves the message in the database and may trigger real-time updates via WebSockets.

#### Real-Time Messaging (via Django Channels)
- **Purpose:** Provide live chat updates and notifications.
- **Process:**
  - Manages WebSocket connections.
  - Authenticates connections using JWT tokens.

#### File Attachments (if separate)
- **Purpose:** Handle file uploads associated with messages.
- **Process:**
  - Processes file uploads and links them to the corresponding message records.

---

### D. Skill Swap Requests & Scheduling

#### `POST /api/v1/swaps/`
- **Purpose:** Initiate a new skill swap request.
- **Process:**
  - Accepts a JSON payload with details (e.g., requestor, responder, proposed time).
  - Creates a swap request with an initial status (e.g., pending).

#### `GET /api/v1/swaps/`
- **Purpose:** List swap requests for the authenticated user.
- **Process:**
  - Retrieves swaps where the user is either the requestor or responder.
  - May include filtering by status.

#### `PUT /api/v1/swaps/<swap_id>/`
- **Purpose:** Update the status of an existing swap request.
- **Process:**
  - Accepts a JSON payload to update the status (e.g., accept, reject, reschedule).
  - Ensures that only involved users can modify the swap.

#### `POST /api/v1/swaps/<swap_id>/sync-calendar`
- **Purpose:** Synchronize the scheduled swap session with Google Calendar.
- **Process:**
  - Uses the Google Calendar API to create or update an event.
  - Requires proper OAuth tokens and error handling for calendar operations.

---

### E. Video Call & Session Management

#### `POST /api/v1/video-calls/`
- **Purpose:** Initiate a new video call session.
- **Process:**
  - Generates a unique session/room ID.
  - Creates tokens for participants if necessary.
  - Optionally integrates with a signaling server for WebRTC handshakes.

#### `GET /api/v1/video-calls/<session_id>/`
- **Purpose:** Retrieve details for a specific video call session.
- **Process:**
  - Returns session information such as participant list, session timing, and authentication tokens.
  - Used by the frontend to display session details or allow users to join the call.

---

### F. Community, Forums & Reviews

#### `GET /api/v1/forums/`
- **Purpose:** List forum categories, topics, or discussion threads.
- **Process:**
  - Provides an overview of community discussions with metadata such as the number of posts and last updated timestamps.

#### `POST /api/v1/forums/`
- **Purpose:** Create a new discussion thread.
- **Process:**
  - Accepts a JSON payload with the thread title and initial post.
  - Creates a new thread associated with the author.

#### `GET /api/v1/forums/<thread_id>/`
- **Purpose:** Retrieve all posts and replies within a specific discussion thread.
- **Process:**
  - Returns the complete discussion including nested replies.

#### `POST /api/v1/reviews/`
- **Purpose:** Submit a review or rating following a skill swap.
- **Process:**
  - Accepts details such as reviewer, reviewee, rating, and comments.
  - Associates the review with a completed swap request.

#### `GET /api/v1/reviews/<user_id>/`
- **Purpose:** Retrieve all reviews for a specific user.
- **Process:**
  - Returns a list of reviews and ratings for the user.

---

### G. Gamification & User Achievements

#### `GET /api/v1/leaderboard/`
- **Purpose:** Retrieve a ranking of top skill swappers.
- **Process:**
  - Returns a sorted list of users based on their swap activity or accumulated ratings.

#### `GET /api/v1/achievements/`
- **Purpose:** Retrieve available badges and the authenticated user's progress.
- **Process:**
  - Provides a list of achievements along with criteria and progress indicators.

#### `POST /api/v1/achievements/`
- **Purpose:** Award or update badges based on user activity.
- **Process:**
  - Accepts updates related to achievements.
  - Processes and updates user achievements accordingly.

---

## 2. Database Models

Below is an overview of the key database models and their fields. These models define the structure of your data and the relationships between different entities.

---

### A. UserProfile Model
- **Description:**  
  Extends the default user model with additional profile information.
- **Fields:**
  - **name:** The user's full name.
  - **email:** The user's email address.
  - **phone:** (Optional) The user's phone number.
  - **address:** (Optional) The physical address.
  - **profile_picture:** URL or file reference to the user’s avatar.
  - **bio:** A short biography or description.
  - **skills:** A list or many-to-many relationship representing the skills offered.
  - **ratings:** Aggregated user ratings from reviews.
  - **bannerImage:** (Optional) A banner image for the user’s profile.

---

### B. Gig Model (Gigs)
- **Description:**  
  Represents a skill offer or listing created by a user.
- **Fields:**
  - **title:** The title of the offer.
  - **description:** Detailed description of the offer.
  - **images:** One or more images related to the offer.
  - **offered_skills:** The skills the user is offering.
  - **desired_skills:** The skills the user is seeking in exchange.
  - **mode:** Indicates whether the session is online or offline.
  - **created_by:** A reference to the UserProfile or User who created the offer.
  - **timestamps:** Fields to record creation and update times.

---

### C. SwapRequest Model (Swaps)
- **Description:**  
  Represents a skill swap request between two users.
- **Fields:**
  - **requestor:** The user who initiates the swap.
  - **responder:** The user being requested for the swap.
  - **status:** Current status (e.g., pending, accepted, rejected).
  - **scheduled_time:** The proposed date and time for the swap.
  - **createdAt / updatedAt:** Timestamps for creation and updates.

---

### D. Message Model
- **Description:**  
  Represents a chat message within a conversation thread.
- **Fields:**
  - **thread_id:** Identifier linking the message to a conversation thread.
  - **sender:** Reference to the user who sent the message.
  - **recipient:** Reference to the intended recipient.
  - **message_content:** The text content of the message.
  - **timestamp:** When the message was sent.
  - **attachment_reference:** (Optional) Reference to an attached file.

---

### E. Review Model
- **Description:**  
  Stores reviews and ratings provided after a skill swap.
- **Fields:**
  - **reviewer:** The user giving the review.
  - **reviewee:** The user receiving the review.
  - **rating:** A numerical or star-based rating.
  - **comments:** Textual feedback.
  - **associated_swap_request:** Reference to the swap request linked to the review.

---

### F. Session/VideoCall Model
- **Description:**  
  Represents a video call session.
- **Fields:**
  - **session_id:** Unique identifier for the video call session.
  - **participants:** A list of users participating in the session.
  - **token_details:** Authentication or session tokens required for the call.
  - **session_duration:** Planned or actual duration of the call.
  - **timestamps:** Records for when the session was created and last updated.

---

## 3. Best Practices

- **Authentication & Permissions:**  
  Secure endpoints using JWT and enforce appropriate permission checks (e.g., `IsAuthenticated` or custom ownership permissions).

- **Input Validation:**  
  Use Django REST Framework serializers to validate incoming data and provide clear error messages.

- **Error Handling:**  
  Return standardized error responses with appropriate HTTP status codes.

- **Rate Limiting & CORS:**  
  Implement rate limiting on sensitive endpoints and configure CORS settings to restrict access to trusted frontends.

- **Real-Time Updates:**  
  Use Django Channels for real-time chat updates and notifications, ensuring that WebSocket connections are authenticated via JWT tokens.
