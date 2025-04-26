# **App Name**: FoodConnect

## Core Features:

- User Registration and Management: Allow users to register as Donors, Receivers, or NGOs, storing minimal data (name, role, city) in Firestore.  User roles can be Donor, Receiver, or NGO. Profiles can be managed (view/edit name, city) without login for MVP.
- Food Listing and Request System: Enable Donors to list food items with details (type, quantity, expiry, city) and Receivers to browse/request listings.  Listings will be stored in Firestore, categorized for filtering by food type, city, and urgency.  NGOs can view and manage requests.
- Matching Algorithm: Implement a matching algorithm to filter listings by matching city and expiry date (prioritize earlier dates). Use Firestore queries in Cloud Functions to match listings with receivers and display matched listings for requests.

## Style Guidelines:

- Primary: Soft Green (#4CAF50), symbolizing growth and sustainability.
- Warm Orange (#FFA726) to highlight calls to action and important information.
- Background: Light Cream (#F9FBE7) for a clean, inviting backdrop.
- Text: Charcoal Gray (#424242) for readability and a professional feel.
- Accent: Sky Blue (#29B6F6) for interactive elements and visual interest.
- Mobile-first, responsive grid layout optimized for desktop viewing.
- Use Heroicons for food types and actions, ensuring clear and consistent visual cues.

## Original User Request:
Create a web application called "Zero Waste Zero Hunger" in Firebase Studio using **Next.js** for the frontend, **Firebase Cloud Functions** (Node.js/Express) for the backend, and **Firestore** for the database. The app connects food donors with receivers (NGOs or individuals) to reduce food waste and combat hunger. Implement all modules (User Management, Food Listing & Request, Matching Algorithm, Communication, Donation Management & Verification) as specified, with a compassionate, modern, mobile-first UI optimized for desktop use. Include sample data and detailed setup instructions.

### Project Requirements
1. **User Management**:
   - Users interact without authentication (MVP). Store minimal user data (name, role: Donor/Receiver/NGO, city) in Firestore.
   - Allow users to register as Donor, Receiver, or NGO via a form (name, role, city).
   - Users can manage profiles (view/edit name, city) without login.

2. **Food Listing & Request**:
   - Donors list food with details: food type (e.g., fruits, meals), quantity, expiry date, city.
   - Receivers browse and request food listings.
   - Store listings in Firestore with smart categorization (filter by food type, city, urgency).
   - NGOs view and manage requests.

3. **Matching Algorithm**:
   - Simple algorithm: Filter listings by:
     - Matching city (e.g., Donor and Receiver in the same city).
     - Expiry date (prioritize earlier expiry).
   - Use Firestore queries in Cloud Functions to match listings with receivers.
   - Display matched listings to Receivers for requesting.

4. **Communication**:
   - Enable real-time status updates (e.g., “Food Listed,” “Requested,” “Picked Up”) using Firestore’s real-time listeners.
   - Implement a simple chat system (text-based) between Donors, Receivers, and NGOs using Firestore to store messages.
   - NGOs monitor communication and coordinate pickups.

5. **Donation Management & Verification**:
   - Track donation history (e.g., food donated, receivers served) in Firestore.
   - Provide impact metrics (e.g., total food donated, beneficiaries) on a dashboard.
   - Include admin tools (accessible by NGOs) to verify donations (e.g., mark as completed).

### Tech Stack
- **Frontend**: Next.js (with Tailwind CSS for styling, Heroicons for icons).
- **Backend**: Firebase Cloud Functions (Node.js/Express) for API logic.
- **Database**: Firestore (NoSQL) for users, listings, messages, and donation data.
- **Real-Time**: Firestore real-time listeners for updates and chat.
- **Hosting**: Firebase Hosting for deploying the Next.js app.

### UI/UX Design
- **Style & Theme**:
  - Humanitarian, minimalist design with rounded cards/buttons, generous white space.
  - Mix real imagery (people, food, community) and subtle illustrations (e.g., icons for food types).
  - Responsive, mobile-first grid layout optimized for desktop.
- **Color Palette**:
  - Primary: Soft Green (#4CAF50), Warm Orange (#FFA726).
  - Background: Light Cream (#F9FBE7).
  - Text: Charcoal Gray (#424242).
  - Accent: Sky Blue (#29B6F6).
- **Pages**:
  - **Homepage**: Welcome message, call-to-action buttons (e.g., “Donate Food,” “Request Food”), impact stats (e.g., food donated).
  - **Register**: Form for user registration (name, role, city).
  - **Donor Dashboard**: Form to list food, view past listings, and chat with Receivers/NGOs.
  - **Receiver Dashboard**: Browse/request food listings, view matches, and chat.
  - **NGO Dashboard**: Manage requests, verify donations, view impact metrics, and chat.
  - **Chat Page**: Simple text-based chat interface for coordination.

### Sample Data
Seed Firestore with:
- **Users**: 2 Donors (e.g., “John, Chennai,” “Alice, Mumbai”), 2 Receivers (e.g., “Bob, Chennai,” “Clara, Mumbai”), 1 NGO (e.g., “Hope NGO, Chennai”).
- **Food Listings**: 5 listings (e.g., “Fruits, 10kg, 2025-04-28, Chennai,” “Meals, 20 servings, 2025-04-27, Mumbai”).
- **Messages**: Sample chat messages (e.g., “Hi, can I pick up the fruits tomorrow?”).
- **Donations**: 3 completed donations for impact metrics (e.g., “10kg fruits donated to Bob”).
Ensure sample data is loaded automatically during setup.

### Backend API (Cloud Functions)
- **POST /api/register**: Register a user (name, role, city).
- **POST /api/food**: Create a food listing (food type, quantity, expiry, city).
- **GET /api/food**: Retrieve listings (filter by city, food type).
- **POST /api/request**: Receivers request food.
- **GET /api/matches**: Get matched listings for a Receiver (based on city, expiry).
- **POST /api/message**: Send a chat message.
- **GET /api/messages**: Retrieve chat history for a user.
- **GET /api/donations**: Retrieve donation history and impact metrics.
- **POST /api/verify**: NGO verifies a donation (marks as completed).

### Constraints
- Use Firestore instead of MongoDB, adapting schemas (e.g., collections for users, listings, messages).
- Implement simple matching (city and expiry) via Firestore queries.
- No authentication (MVP); use user IDs (e.g., generated on registration) for tracking.
- Optimize for Firebase Studio’s AI code generation and hosting.

### Project Structure
- **/app**: Next.js frontend (pages, components).
  - `/pages/index.js`: Homepage.
  - `/pages/register.js`: Registration form.
  - `/pages/donor.js`: Donor dashboard.
  - `/pages/receiver.js`: Receiver dashboard.
  - `/pages/ngo.js`: NGO dashboard.
  - `/pages/chat.js`: Chat interface.
  - `/components`: Reusable UI components (e.g., Card, Button).
- **/functions**: Firebase Cloud Functions (Node.js/Express).
  - `/api`: API routes (register, food, matches, etc.).
  - `/utils`: Helper functions (e.g., matching logic).
- **/public**: Static assets (images, illustrations).
- **/firebase**: Firebase config and Firestore setup.
- **README.md**: Setup and usage instructions.

### Deliverables
- Fully functional app with all modules.
- Clean folder structure: `/app` (Next.js), `/functions` (Cloud Functions), `/public`, `/firebase`, `README.md`.
- Sample data seeded in Firestore.
- Basic error handling (e.g., missing fields, invalid requests).
- Deployable on Firebase Hosting with Cloud Functions and Firestore.

### Setup Instructions (README.md)
Include a `README.md` with:
1. **Prerequisites**: Node.js, Firebase CLI, Firebase account.
2. **Setup**:
   - Clone the project.
   - Run `npm install` in `/app` and `/functions`.
   - Set up Firebase project (Hosting, Firestore, Cloud Functions).
   - Configure Firebase credentials (`.env` with Firebase config).
   - Initialize Firestore with sample data (provide script).
3. **Running Locally**:
   - Run `npm run dev` in `/app` for Next.js.
   - Run `firebase emulators:start` in `/functions` for Cloud Functions.
4. **Deployment**:
   - Deploy to Firebase Hosting: `firebase deploy --only hosting`.
   - Deploy Cloud Functions: `firebase deploy --only functions`.
5. **Testing**:
   - Access app via Firebase Hosting URL.
   - Test registration, food listing, matching, chat, and donation tracking.
6. **Sample Data**: Instructions to verify seeded data in Firestore.

### Additional Notes
- Use Firebase Studio’s Gemini API to generate code, UI, and debug.
- Include real imagery (e.g., Creative Commons food/community photos) and subtle illustrations (e.g., Heroicons for food types).
- Ensure real-time updates (e.g., new listings, chat messages) using Firestore listeners.
- Test the app to ensure all modules work (e.g., listing food, requesting, chatting, tracking donations).
- Optimize for desktop but maintain mobile-first responsiveness.

Generate the complete project with all files (Next.js pages, Cloud Functions, Firestore schemas, Tailwind CSS, README.md) and provide instructions to run it in Firebase Studio.
  