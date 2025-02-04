
**Routing:**  
Utilize React Router with clearly defined routes:
- `/` – Home Page (under **General**)
- `/login`, `/signup`, `/forgot-password` – Authentication pages (under **Auth**)
- `/dashboard` – User Dashboard (under **Dashboard**)
- `/offers` – Skill Swap Listings (under **General**)
- `/offers/:id` – Single Skill Offer Detail (under **General**)
- `/messages` – Chat & Messaging (under **Dashboard**)
- `/schedule` – Scheduling and Calendar (under **General**)
- `/video-call` – Video Call Session (under **General**)
- `/profile/:username` – User Profile (under **Auth**)
- `/forum` – Community & Forum (under **General**)
- `/leaderboard` – Gamification/Leaderboard (under **General**)
- `/settings` – Account & Profile Settings (under **Dashboard** or **General**)

---

## GIG Card Thumbnail

- For a thumbnail that works well across different devices and use cases, I   recommend using a 16:9 aspect ratio with dimensions of 1280x720 pixels. This  is a standard format that:

Works well for both grid and list views
Maintains quality on high-resolution displays
Is optimized for web performance
Matches YouTube's thumbnail dimensions
Looks good on both mobile and desktop

## 3. General UI Design Rules & Principles

### A. Consistency & Modularity
- **Color Palette:**  
  - **Primary Blue (#4A90E2):** Main buttons, links, highlights  
  - **Dark Blue (#2C3E50):** Headers, primary text, navigation elements  
  - **Soft Gray (#ECF0F1):** Backgrounds for cards and sections  
  - **White (#FFFFFF):** Clean backgrounds, card elements  
  - **Success Green (#27AE60):** Success messages, verified badges  
  - **Warning Yellow (#F39C12):** Alerts, warnings  
  - **Error Red (#E74C3C):** Error messages, deletion warnings  

- **Typography:**  
  - **Primary Fonts:** Montserrat, Poppins (or similar modern sans-serif)  
  - **Font Weights:**  
    - **Bold (700):** Headings, key CTAs  
    - **Medium (500):** Subheadings, labels  
    - **Regular (400):** Body text  
  - **Line Height:** Minimum 1.5 for readability

- **Spacing & Layout:**  
  - Use a consistent spacing scale (8px, 16px, 24px, 32px)  
  - Leverage grid and flex layouts for alignment and responsiveness

- **Animations & Transitions:**  
  - Subtle hover animations (300-400ms) for buttons, links, and modals  
  - Smooth transitions for page changes and modals

### B. Accessibility
- **Color Contrast:** Ensure text/background combinations meet WCAG standards  
- **Keyboard Navigation:** All interactive elements must be focusable  
- **Readable Font Sizes:** Maintain minimum font sizes for body and headings

---

## 4. Detailed UI Pages & Sections

### A. Home Page (General)
- **Hero Section:**  
  - Prominent search bar with a CTA “Find a Skill Swap”  
  - Eye-catching headline/subheading with an appropriate background image/illustration  
- **Featured Skill Offers Carousel:**  
  - Auto-scrollable cards with rounded corners and soft shadows  
- **How It Works Section:**  
  - Visual step-by-step guide using icons/illustrations  
- **Testimonials Section:**  
  - Slider or grid layout showcasing user quotes and photos  
- **Footer:**  
  - Links to About, Contact, Terms, and social media profiles

### B. Authentication Pages (Auth)
- **Login Page:**  
  - Email and password fields, Google OAuth button (with recognizable icons)  
  - “Forgot Password” link with inline error handling
- **Sign Up Page:**  
  - Registration form including full name, email, password, and skill tags/interests  
  - Progress indicator or checklist guiding the registration steps
- **Forgot Password Page:**  
  - Simple form with clear instructions and immediate validation feedback

*UI Elements:*  
- Rounded input fields, clear labels (not just placeholders), and inline validation (Error Red for errors, Success Green for success).

### C. Dashboard Pages (Dashboard)
- **Sidebar Navigation:**  
  - Collapsible sidebar with icons and text for Dashboard, Messages, Profile, Settings, etc.
- **Main Panel:**  
  - Overview cards displaying pending swap requests, notifications, and recent activity  
  - Graphs or progress bars representing user statistics and achievements

### D. Other General Pages (General)
- **Skill Swap Listings Page:**  
  - Grid or list of cards with thumbnails, titles, descriptions, and a “Request Swap” button  
  - Filter & sort controls (by category, skills, location, mode)
- **Skill Offer Detail Page:**  
  - Detailed view with a large header, in-depth description, images, and the offer creator’s profile  
  - Prominent “Request Swap” CTA and a section for related offers
- **Messaging System:**  
  - Split view with conversation list and active chat window  
  - Real-time message updates, attachment support, and notification indicators
- **Scheduling & Calendar Integration:**  
  - Integrated calendar view for upcoming/past sessions  
  - Modal for session details and a clearly marked button for Google Calendar sync
- **Video Call Interface:**  
  - Full-screen or resizable video window with clear borders  
  - Control panel (mute, screen share, end call), chat sidebar, and session timer
- **User Profile & Settings Pages:**  
  - Profile page with user bio, skills, ratings, and profile picture  
  - Settings page with editable forms for profile, security, and notification preferences
- **Forum & Community Pages:**  
  - Categories & topics in a card or list layout, with a simple editor for posts and replies
- **Gamification & Leaderboard Pages:**  
  - Leaderboard table or grid view showing top users, XP points, badges, and progress charts

---

## 5. Interactive Elements & Animations

- **Buttons:**  
  - **Primary:** Primary Blue background with darker hover state  
  - **Secondary:** Dark Blue with border outlines  
  - **Disabled:** Grayed out appearance  
- **Cards & Forms:**  
  - Consistent padding/margins, soft shadows, rounded corners (`border-radius: 6px`), and clear labels  
- **Transitions:**  
  - Smooth hover and page transition animations (300-400ms)

---

## 6. Responsive Design & Accessibility

- **Mobile-First Approach:**  
  - Design components and layouts to scale from mobile to desktop using media queries and Tailwind CSS grid/flex utilities  
- **Accessibility Standards:**  
  - Ensure adequate text contrast, proper ARIA attributes, and keyboard navigability

---

## 7. Additional Frontend Integrations

- **Notifications:**  
  - Use react-toastify for real-time notifications (success, error, info)
- **Iconography:**  
  - Consistent use of react-icons (or Font Awesome) across the UI
- **State Management:**  
  - Consider React Context or Redux for global state (e.g., user auth, notifications)

---

*This document should be updated as design iterations progress and as new components are added to ensure all team members align with the visual and interactive goals of the Skill Swap Web Platform.*
