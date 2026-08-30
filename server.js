/**
 * Unified backend for BOTH apps (ValorTrust + Portfolio).
 *
 * Both frontends previously talked to Supabase directly and there was no
 * shared server. This single Express server now acts as the "main backend"
 * for both applications. It exposes:
 *
 *   - Legacy / shared endpoints              ->  /news, /health
 *   - ValorTrust app endpoints               ->  /api/valortrust/*
 *   - Portfolio app endpoints                ->  /api/portfolio/*
 *
 * Both apps share the same Firebase project, so a single Firebase Admin
 * instance is used server-side. Point both frontends at this server's base URL.
 */

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Load environment variables from a local .env file when present.
try {
  require("dotenv").config();
} catch (_) {
  /* dotenv is optional; env vars may be provided by the host (e.g. Render) */
}

// ---------------------------------------------------------------------------
// Firebase Admin SDK initialisation
// ---------------------------------------------------------------------------
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT || "./serviceAccountKey.json";

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} catch (err) {
  // Fallback: use application default credentials (e.g. on Cloud Run, GCE)
  console.warn("No service account file found, using application default credentials.");
  admin.initializeApp();
}

const firestore = admin.firestore();

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// CORS: allow both app frontends (dev + production).
// ---------------------------------------------------------------------------
const allowedOrigins = (process.env.ALLOWED_ORIGINS ||
  [
    "http://127.0.0.1:5173", // valortrust dev
    "http://127.0.0.1:5174", // portfolio dev
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:8080",
  ].join(",")
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser tools (no origin) and any whitelisted origin.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(null, true); // relaxed by default; tighten in production
    },
    credentials: true,
  })
);

// Small helper to keep route handlers tidy.
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

// Helper: convert Firestore snapshot to array of plain objects
function snapToArray(snapshot) {
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// ---------------------------------------------------------------------------
// Health + legacy endpoints (kept for backwards compatibility).
// ---------------------------------------------------------------------------
app.get("/health", (req, res) => res.json({ status: "ok", uptime: process.uptime() }));

app.get("/news", (req, res) => {
  res.json([{ id: 1, title: "First News", content: "Hello from the unified backend!" }]);
});

// ===========================================================================
// VALORTRUST APP  ->  /api/valortrust/*
// ===========================================================================
const vt = express.Router();

vt.get("/blog", handle(async (req, res) => {
  const snapshot = await firestore.collection("blog_posts")
    .orderBy("created_at", "desc")
    .get();
  res.json(snapToArray(snapshot));
}));

vt.get("/portfolio", handle(async (req, res) => {
  const snapshot = await firestore.collection("portfolio")
    .orderBy("created_at", "desc")
    .get();
  res.json(snapToArray(snapshot));
}));

vt.get("/testimonials", handle(async (req, res) => {
  const snapshot = await firestore.collection("testimonials")
    .orderBy("created_at", "desc")
    .get();
  res.json(snapToArray(snapshot));
}));

vt.get("/sectors", handle(async (req, res) => {
  const snapshot = await firestore.collection("sectors").get();
  res.json(snapToArray(snapshot));
}));

vt.post("/enquiries", handle(async (req, res) => {
  const data = {
    ...req.body,
    status: req.body.status || "unread",
    created_at: new Date().toISOString(),
  };
  await firestore.collection("enquiries").add(data);
  res.status(201).json({ success: true });
}));

vt.post("/subscribers", handle(async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: "email is required" });

  // Check for duplicate
  const existing = await firestore.collection("subscribers")
    .where("email", "==", email)
    .limit(1)
    .get();

  if (!existing.empty) {
    return res.status(200).json({ success: true, message: "Already subscribed" });
  }

  await firestore.collection("subscribers").add({
    email,
    created_at: new Date().toISOString(),
  });
  res.status(201).json({ success: true });
}));

app.use("/api/valortrust", vt);

// ===========================================================================
// PORTFOLIO APP  ->  /api/portfolio/*
// ===========================================================================
const pf = express.Router();

pf.get("/skills", handle(async (req, res) => {
  const snapshot = await firestore.collection("skills").get();
  res.json(snapToArray(snapshot));
}));

pf.get("/profile", handle(async (req, res) => {
  const snapshot = await firestore.collection("profiles").limit(1).get();
  if (snapshot.empty) return res.status(404).json({ error: "No profile found" });
  const doc = snapshot.docs[0];
  res.json({ id: doc.id, ...doc.data() });
}));

pf.get("/bio", handle(async (req, res) => {
  const snapshot = await firestore.collection("site_bio").limit(1).get();
  if (snapshot.empty) return res.status(404).json({ error: "No bio found" });
  const doc = snapshot.docs[0];
  res.json({ id: doc.id, ...doc.data() });
}));

pf.get("/contacts", handle(async (req, res) => {
  const snapshot = await firestore.collection("contact_submissions")
    .orderBy("created_at", "desc")
    .get();
  res.json(snapToArray(snapshot));
}));

pf.post("/contacts", handle(async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message)
    return res.status(400).json({ error: "name, email and message are required" });
  await firestore.collection("contact_submissions").add({
    name, email, subject, message,
    created_at: new Date().toISOString(),
  });
  res.status(201).json({ success: true });
}));

app.use("/api/portfolio", pf);

// ---------------------------------------------------------------------------
// Start server.
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Unified backend running on port ${PORT}`);
  console.log(`  ValorTrust API:  /api/valortrust/*`);
  console.log(`  Portfolio API:   /api/portfolio/*`);
});
