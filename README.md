# FoodConnect - Zero Waste Zero Hunger (Firebase Studio)

This is a Next.js application built in Firebase Studio for the **FoodConnect** project. It connects food donors with receivers (NGOs or individuals) to reduce food waste and combat hunger, leveraging Firebase for backend services.

## Features

- **User Registration**: Register as Donor, Receiver, or NGO.
- **Food Listing**: Donors can list surplus food items.
- **Food Requesting**: Receivers can browse and request available food.
- **Matching**: Simple matching based on city and expiry date.
- **Real-time Updates**: Firestore listeners for new listings and status changes.
- **Chat**: Basic real-time chat for coordination between users.
- **Donation Tracking & Verification**: NGOs can track and verify donations.
- **Impact Metrics**: View overall impact statistics.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn/ui, Lucide Icons
- **Backend**: Firebase Cloud Functions (Node.js/Express - *to be implemented*)
- **Database**: Firestore (NoSQL)
- **Real-Time**: Firestore Real-time Listeners
- **Hosting**: Firebase Hosting

## Project Structure

```
/
├── app/                  # Next.js frontend source (using App Router)
│   ├── (dashboards)/     # Route groups for dashboards (donor, receiver, ngo)
│   │   ├── donor/page.tsx
│   │   ├── receiver/page.tsx
│   │   └── ngo/page.tsx
│   ├── chat/page.tsx     # Chat page
│   ├── register/page.tsx # Registration page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Homepage
│   └── globals.css       # Global styles & Tailwind directives
├── components/           # Reusable React components
│   ├── ui/               # Shadcn/ui components
│   └── site-header.tsx   # Site header/navigation
├── hooks/                # Custom React hooks (e.g., use-toast)
├── lib/                  # Utility functions (e.g., cn)
├── public/               # Static assets (images, icons)
├── functions/            # Firebase Cloud Functions (Node.js/Express) - *To be implemented*
│   ├── src/              # Function source code
│   ├── package.json
│   └── ...
├── firebase/             # Firebase configuration files - *To be added*
├── .env                  # Environment variables (e.g., Firebase config)
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── components.json       # Shadcn/ui configuration
├── tsconfig.json         # TypeScript configuration
├── package.json          # Project dependencies and scripts
└── README.md             # This file
```

## Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn
- Firebase CLI (`npm install -g firebase-tools`)
- A Firebase project set up on the [Firebase Console](https://console.firebase.google.com/)

## Setup

1.  **Clone the Project:**
    ```bash
    git clone <your-repository-url>
    cd foodconnect-firebase-studio
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Install Backend Dependencies (Placeholder):**
    Navigate to the `functions` directory (if it exists) and install its dependencies.
    ```bash
    cd functions
    npm install
    # or
    yarn install
    cd ..
    ```
    *(Note: Backend functions are not yet implemented in this scaffolded version).*

4.  **Set up Firebase Project:**
    - Go to the [Firebase Console](https://console.firebase.google.com/).
    - Create a new Firebase project (or use an existing one).
    - Enable the following Firebase services:
        - **Firestore Database**: Create a Firestore database (start in test mode for development, configure security rules for production).
        - **Hosting**: Set up Firebase Hosting.
        - **Cloud Functions**: Required for backend logic (Node.js runtime).
        - **Authentication** (Optional, if adding login later).
    - Register a Web App in your Firebase project settings.
    - Copy the Firebase configuration object provided.

5.  **Configure Firebase Credentials:**
    - Create a `.env.local` file in the root of the project (`/`).
    - Add your Firebase configuration keys to `.env.local`:
      ```env
      NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
      NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
      NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
      NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id # Optional
      ```
    *(Note: The frontend currently uses `localStorage` for MVP state management. Full Firebase integration requires setting up the Firebase SDK).*

6.  **Login to Firebase CLI:**
    ```bash
    firebase login
    ```

7.  **Initialize Firebase (Optional but Recommended):**
    Run `firebase init` in the project root and select Firestore, Functions, and Hosting. Associate the project with your Firebase project created in the console. Choose the correct directories (`public` for hosting build output - usually `.next` or `out`, `functions` for functions). This helps streamline deployment.

8.  **Seed Firestore with Sample Data:**
    *(Manual Setup for MVP):*
    - Go to your Firebase project's Firestore Database section in the console.
    - Manually create the following collections and documents (or create a script using Firebase Admin SDK if preferred):
        - **`users` collection:**
            - Doc ID (auto-generated): `{ name: "John", role: "Donor", city: "Chennai" }`
            - Doc ID (auto-generated): `{ name: "Alice", role: "Donor", city: "Mumbai" }`
            - Doc ID (auto-generated): `{ name: "Bob", role: "Receiver", city: "Chennai" }`
            - Doc ID (auto-generated): `{ name: "Clara", role: "Receiver", city: "Mumbai" }`
            - Doc ID (auto-generated): `{ name: "Hope NGO", role: "NGO", city: "Chennai" }`
        - **`listings` collection:**
            - Doc ID (auto-generated): `{ donorName: "John", foodType: "Fruits", quantity: "10kg", expiryDate: "2025-04-28", city: "Chennai", status: "Listed", listedAt: <Timestamp> }`
            - Doc ID (auto-generated): `{ donorName: "Alice", foodType: "Meals", quantity: "20 servings", expiryDate: "2025-04-27", city: "Mumbai", status: "Listed", listedAt: <Timestamp> }`
            - ... (add more mock listings as needed)
        - **`donations` collection:** (For completed/verified donations)
            - Doc ID (auto-generated): `{ foodType: "Fruits", quantity: "10kg", donorName: "John", receiverName: "Bob", completionDate: "2025-04-28", verified: true, city: "Chennai" }`
            - ... (add more mock donations)
        - **`messages` collection:** (Or subcollections within conversations)
            - Structure depends on your chat implementation (e.g., a `conversations` collection, each with a `messages` subcollection). Add sample messages.

## Running Locally

1.  **Start the Next.js Development Server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    The app will be available at `http://localhost:9002` (or the port specified in `package.json`).

2.  **Start Firebase Emulators (Optional but Recommended):**
    If you have backend functions or want to test Firestore locally:
    ```bash
    firebase emulators:start --only functions,firestore,hosting
    ```
    Access the Emulator UI (usually `http://localhost:4000`) to view local Firestore data. Your frontend needs to be configured to connect to the emulators during development.

## Deployment

1.  **Build the Next.js App:**
    ```bash
    npm run build
    # or
    yarn build
    ```

2.  **Deploy to Firebase Hosting:**
    ```bash
    firebase deploy --only hosting
    ```
    *(Ensure your `firebase.json` hosting configuration points to the correct build output directory, typically `.next` for SSR Next.js apps or `out` for static export).*

3.  **Deploy Cloud Functions:**
    *(Requires implementing the functions in the `/functions` directory)*
    ```bash
    firebase deploy --only functions
    ```

## Testing

1.  Access the deployed app URL provided by Firebase Hosting.
2.  **Registration:** Test registering as a Donor, Receiver, and NGO. Check if the correct data is stored (currently using `localStorage` for MVP).
3.  **Donor Dashboard:** List a new food item. Check if it appears (currently mocked).
4.  **Receiver Dashboard:** Browse available listings (filtered by city, sorted by expiry - currently mocked). Request an item. Check if it moves to the "Requested" tab (currently mocked).
5.  **NGO Dashboard:** View pending requests, verify donations (currently mocked). Check the impact stats and chart.
6.  **Chat:** Test sending messages between users (currently mocked).
7.  **Verify Data:** Check Firestore (or `localStorage` for MVP) to ensure data is being created/updated as expected.

## Additional Notes

- **Firebase Integration**: This scaffolded version primarily focuses on the frontend UI and uses `localStorage` and mock data. Full functionality requires implementing Firebase SDK integration for Firestore reads/writes, real-time listeners, and potentially Cloud Functions for backend logic (like matching or complex verification).
- **Backend Cloud Functions**: The `/functions` directory is a placeholder. You need to implement the API endpoints described in the proposal using Node.js/Express and the Firebase Functions SDK.
- **Security Rules**: Implement Firestore security rules to control data access based on user roles (even without full authentication, you can use user IDs stored locally for basic rules).
- **Error Handling**: Basic error handling is included in forms, but more robust error handling for API calls/database operations should be added.
