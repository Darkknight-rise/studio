import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as express from "express";
import * as cors from "cors";

admin.initializeApp();
const db = admin.firestore();

const app = express();
app.use(cors({ origin: true })); // Allow requests from your frontend domain

// --- API Endpoints (Placeholders - Implement actual logic) ---

// POST /api/register
app.post("/register", async (req, res) => {
  try {
    const { name, role, city } = req.body;
    if (!name || !role || !city) {
      return res.status(400).send({ error: "Missing required fields: name, role, city" });
    }
    // Basic validation example
    if (!['Donor', 'Receiver', 'NGO'].includes(role)) {
       return res.status(400).send({ error: "Invalid role specified." });
    }

    // TODO: Add user to Firestore 'users' collection
    const newUserRef = db.collection("users").doc(); // Auto-generate ID
    await newUserRef.set({
      id: newUserRef.id, // Store the ID within the document as well
      name,
      role,
      city,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    functions.logger.info(`User registered: ${newUserRef.id} - ${name}`);
    // Return the newly created user ID (or the full user object)
    res.status(201).send({ id: newUserRef.id, name, role, city });
  } catch (error) {
    functions.logger.error("Error registering user:", error);
    res.status(500).send({ error: "Failed to register user." });
  }
});

// POST /api/food (Create Listing)
app.post("/food", async (req, res) => {
  try {
    // TODO: Get donorId from request (e.g., custom auth token or passed in body - needs secure implementation)
    const { donorId, donorName, foodType, quantity, expiryDate, city, description } = req.body;
    if (!donorId || !donorName || !foodType || !quantity || !expiryDate || !city) {
       return res.status(400).send({ error: "Missing required fields for food listing." });
    }

     // Basic validation/parsing
    const expiryTimestamp = admin.firestore.Timestamp.fromDate(new Date(expiryDate));

    // TODO: Add listing to Firestore 'listings' collection
     const newListingRef = db.collection("listings").doc();
     await newListingRef.set({
        id: newListingRef.id,
        donorId,
        donorName,
        foodType,
        quantity,
        expiryDate: expiryTimestamp,
        city,
        description: description || null,
        status: "Listed", // Initial status
        listedAt: admin.firestore.FieldValue.serverTimestamp(),
     });

    functions.logger.info(`Food listed: ${newListingRef.id} by ${donorName}`);
    res.status(201).send({ id: newListingRef.id, message: "Food listed successfully." });
  } catch (error) {
    functions.logger.error("Error listing food:", error);
    res.status(500).send({ error: "Failed to list food." });
  }
});

// GET /api/food (Retrieve Listings - with filtering)
app.get("/food", async (req, res) => {
  try {
     const { city, foodType, status = 'Listed', limit = 10 } = req.query; // Default status to 'Listed'
     let query: admin.firestore.Query = db.collection("listings");

     if (city) {
        query = query.where("city", "==", city as string);
     }
     if (foodType) {
         query = query.where("foodType", "==", foodType as string);
     }
     if (status) {
         query = query.where("status", "==", status as string);
     }

     // Optionally filter out expired items on the backend too
     // query = query.where("expiryDate", ">=", admin.firestore.Timestamp.now());

     query = query.orderBy("expiryDate", "asc").limit(Number(limit)); // Order by expiry, soonest first

     const snapshot = await query.get();
     const listings = snapshot.docs.map((doc) => {
        const data = doc.data();
        // Convert Firestore Timestamps to ISO strings for JSON response
        return {
            id: doc.id,
            ...data,
            listedAt: data.listedAt?.toDate().toISOString(),
            expiryDate: data.expiryDate?.toDate().toISOString(),
        };
     });

    res.status(200).send(listings);
  } catch (error) {
    functions.logger.error("Error retrieving food listings:", error);
    res.status(500).send({ error: "Failed to retrieve listings." });
  }
});


// GET /api/matches (Example - Simple match by city & expiry for a specific receiver)
app.get("/matches", async (req, res) => {
     try {
        // TODO: Get receiverId/city from request (needs secure implementation)
        const { receiverCity, limit = 10 } = req.query;
        if (!receiverCity) {
            return res.status(400).send({ error: "Missing required query parameter: receiverCity" });
        }

        const now = admin.firestore.Timestamp.now();
        const snapshot = await db.collection("listings")
            .where("city", "==", receiverCity as string)
            .where("status", "==", "Listed") // Only show available items
            .where("expiryDate", ">=", now) // Don't show expired items
            .orderBy("expiryDate", "asc") // Prioritize soon-to-expire items
            .limit(Number(limit))
            .get();

         const matches = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                 ...data,
                listedAt: data.listedAt?.toDate().toISOString(),
                expiryDate: data.expiryDate?.toDate().toISOString(),
            };
         });
        res.status(200).send(matches);
     } catch (error) {
         functions.logger.error("Error getting matches:", error);
         res.status(500).send({ error: "Failed to get matches." });
     }
});


// POST /api/request (Receiver requests food)
app.post("/request", async (req, res) => {
     try {
        // TODO: Get receiverId/Name from request (needs secure implementation)
        const { listingId, receiverId, receiverName } = req.body;
         if (!listingId || !receiverId || !receiverName) {
            return res.status(400).send({ error: "Missing required fields: listingId, receiverId, receiverName" });
        }

        const listingRef = db.collection("listings").doc(listingId);
        const listingDoc = await listingRef.get();

        if (!listingDoc.exists || listingDoc.data()?.status !== "Listed") {
            return res.status(404).send({ error: "Listing not found or already requested." });
        }

        // TODO: Update listing status and add receiver info
         await listingRef.update({
            status: "Requested",
            receiverId: receiverId,
            receiverName: receiverName,
            requestedAt: admin.firestore.FieldValue.serverTimestamp(),
        });

        functions.logger.info(`Food request: Listing ${listingId} requested by ${receiverName}`);
        // TODO: Send notification to Donor/NGO

         res.status(200).send({ message: "Food requested successfully." });
    } catch (error) {
        functions.logger.error("Error requesting food:", error);
        res.status(500).send({ error: "Failed to request food." });
    }
});


// POST /api/message (Send Chat Message)
app.post("/message", async (req, res) => {
    // TODO: Implement chat message sending logic
    // - Requires conversation structure (e.g., /conversations/{convoId}/messages)
    // - Validate senderId, conversationId, text
     // - Add message to Firestore subcollection
    res.status(501).send({ error: "Chat message sending not implemented." });
});

// GET /api/messages (Retrieve Chat History)
app.get("/messages", async (req, res) => {
     // TODO: Implement chat message retrieval logic
     // - Requires conversationId and potentially pagination
    // - Query Firestore messages subcollection
    res.status(501).send({ error: "Chat message retrieval not implemented." });
});


// GET /api/donations (Retrieve Donation History & Impact)
app.get("/donations", async (req, res) => {
    // TODO: Implement donation history retrieval and impact aggregation
    // - Query 'donations' collection (filter by NGO, Donor, Receiver?)
    // - Aggregate data for impact stats
    res.status(501).send({ error: "Donation history retrieval not implemented." });
});


// POST /api/verify (NGO Verifies Donation)
app.post("/verify", async (req, res) => {
     try {
        // TODO: Get NGOId from request (needs secure implementation)
        const { donationId, ngoId } = req.body;
        if (!donationId || !ngoId) {
            return res.status(400).send({ error: "Missing required fields: donationId, ngoId" });
        }

        // TODO: Check if user making request is actually an NGO (using ngoId)

        const donationRef = db.collection("donations").doc(donationId);
        const donationDoc = await donationRef.get();

         if (!donationDoc.exists) {
            return res.status(404).send({ error: "Donation record not found." });
        }

        // TODO: Update donation status to verified
         await donationRef.update({
            verified: true,
            verifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            verifiedBy: ngoId, // Record which NGO verified
        });

        functions.logger.info(`Donation verified: ${donationId} by NGO ${ngoId}`);
        res.status(200).send({ message: "Donation verified successfully." });
    } catch (error) {
        functions.logger.error("Error verifying donation:", error);
        res.status(500).send({ error: "Failed to verify donation." });
    }
});


// --- Export the Express API as a Cloud Function ---
export const api = functions.https.onRequest(app);

// --- You might add other background functions here ---
// e.g., functions.firestore.document('listings/{listingId}').onCreate(...)
// e.g., functions.firestore.document('listings/{listingId}').onUpdate(...)

// Example: Function triggered when a listing status changes to 'Requested'
export const onListingRequested = functions.firestore
    .document('listings/{listingId}')
    .onUpdate(async (change, context) => {
        const newValue = change.after.data();
        const previousValue = change.before.data();

        // Check if status changed to 'Requested'
        if (previousValue.status !== 'Requested' && newValue.status === 'Requested') {
            const listingId = context.params.listingId;
            const donorId = newValue.donorId;
            const receiverName = newValue.receiverName;
            const foodType = newValue.foodType;

            functions.logger.info(`Listing ${listingId} (${foodType}) was requested by ${receiverName}. Notifying donor ${donorId}.`);

            // TODO: Implement notification logic here
            // - Send an in-app notification, email, or push notification to the donor (donorId)
            // - Could create a 'notifications' collection entry for the donor
            // Example:
            /*
            await db.collection('users').doc(donorId).collection('notifications').add({
                type: 'REQUEST_RECEIVED',
                listingId: listingId,
                foodType: foodType,
                receiverName: receiverName,
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                read: false,
            });
            */
        }
        return null;
    });
