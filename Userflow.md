# Skill Swap Web Platform: User Flow

This document outlines the user flows for the Skill Swap Web Platform, detailing the key steps and interactions from onboarding to post-session activities. It is intended to provide clarity on the journey a user takes while using the platform.

---

## 1. Overview

The Skill Swap Web Platform is designed to facilitate community-driven skill exchanges. Users can register, browse skill offers, request swaps, communicate via chat, schedule sessions, conduct video calls or meet in person, and then provide feedback. The following flows cover these processes.

---

## 2. Onboarding Flow

### 2.1. New User Registration (Sign Up)
1. **Landing Page:**
   - User lands on the home page and clicks on **"Sign Up"**.
2. **Registration Form:**
   - User provides details such as Full Name, Email, Password, and selects Skill Interests/Tags.
3. **Email Verification (if applicable):**
   - A verification email is sent; the user clicks the verification link.
4. **Profile Setup:**
   - User adds a profile picture, bio, and additional skill tags.
5. **Dashboard Redirection:**
   - Upon successful registration, the user is redirected to their **Dashboard**.

### 2.2. Existing User Login
1. **Login Page:**
   - User selects **"Login"** from the landing page.
2. **Authentication:**
   - User enters Email and Password or uses a social login option (e.g., Google OAuth).
3. **Dashboard Redirection:**
   - On successful authentication, the user is directed to the **Dashboard**.

---

## 3. Exploring Skill Offers

### 3.1. Home Page Interaction
1. **Hero Section:**
   - User is greeted with a prominent search bar and a call-to-action (e.g., "Find a Skill Swap").
2. **Browsing Offers:**
   - User views a carousel or list of featured skill offers.
3. **Skill Offer Detail:**
   - By clicking on an offer, the user is taken to a detailed view showing the offer description, the offer creator's profile, and swap details.
4. **Bookmarking:**
   - User can bookmark offers for later consideration.

---

## 4. Requesting a Skill Swap

1. **Initiating the Request:**
   - From the **Skill Offer Detail Page**, the user clicks on **"Request Swap"**.
2. **Swap Request Form:**
   - The user provides additional details such as preferred session timings and mode (online/offline).
3. **Confirmation:**
   - The request is sent to the offer creator, who can then accept or reject the swap request.

---

## 5. Communication & Scheduling

### 5.1. Chat & Messaging
1. **Starting a Conversation:**
   - Once a swap request is sent or accepted, the user can access the messaging system.
2. **Real-Time Interaction:**
   - Users engage in real-time chat to discuss details, clarify session logistics, and share resources.
3. **Attachments:**
   - Users can send attachments (images, PDFs, or links) relevant to the skill exchange.

### 5.2. Scheduling a Session
1. **Scheduling Interface:**
   - Users access the built-in scheduling system to propose and confirm session times.
2. **Calendar Integration:**
   - A button allows users to sync the confirmed session with their Google Calendar.

---

## 6. Conducting the Skill Swap Session

### 6.1. Online Session (Video Call)
1. **Initiating the Video Call:**
   - At the scheduled time, the user clicks on **"Join Video Call"**.
2. **Video Interface:**
   - Users interact via a video call interface featuring mute, screen sharing, chat, and a session timer.
3. **Conducting the Session:**
   - Both users exchange skills in a structured online session.

### 6.2. Offline Session (In-Person Meetup)
1. **Confirmation:**
   - Through the chat system, users finalize the meetup details (location and time).
2. **Conducting the Session:**
   - The skill swap occurs in person at the agreed location.

---

## 7. Post-Session Activities

### 7.1. Feedback & Ratings
1. **Prompt for Review:**
   - After the session, users are prompted to leave a review and rate the swap experience.
2. **Submitting Feedback:**
   - Both participants submit their ratings and comments, which update their profiles and build trust within the community.

### 7.2. Gamification & Achievements
1. **Earning Rewards:**
   - Users receive XP points and badges based on their completed swaps.
2. **Leaderboard Updates:**
   - The user's achievements and progress are reflected on the platform's leaderboard.

---

## 8. Additional User Flows

### 8.1. Profile Management
1. **Updating Profile:**
   - Users can edit their bio, update skills, and change their profile picture.
2. **Settings:**
   - Users adjust account settings, manage notification preferences, and configure privacy options.
3. **Account Deletion:**
   - Users have the option to delete their account with proper confirmation.

### 8.2. Community & Forum Participation
1. **Engaging in Discussions:**
   - Users join forum groups, create posts, and reply to discussions related to skill exchange.
2. **Resource Sharing:**
   - Users share tips, resources, and experiences within community threads.

---

## 9. Flow Diagram Example

Below is a high-level flow diagram (using Mermaid syntax) representing the primary user journey:

```mermaid
flowchart TD
    A[Landing Page] --> B[Sign Up / Login]
    B --> C{User Registered?}
    C -- Yes --> D[Dashboard]
    C -- No --> E[Registration Flow]
    D --> F[Explore Skill Offers]
    F --> G[View Skill Offer Details]
    G --> H[Request Swap]
    H --> I[Chat & Messaging]
    I --> J[Schedule Session]
    J --> K{Session Type?}
    K -- Online --> L[Join Video Call]
    K -- Offline --> M[Arrange Meetup]
    L --> N[Conduct Session]
    M --> N[Conduct Session]
    N --> O[Provide Feedback & Ratings]
    O --> P[Profile & Gamification Updates]
