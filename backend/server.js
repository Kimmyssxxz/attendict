const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Make sure you create backend/serviceAccountKey.json from Firebase Console
let credential;

if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  credential = admin.credential.applicationDefault();
} else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const parsed = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    credential = admin.credential.cert(parsed);
  } catch (e) {
    console.error('Invalid FIREBASE_SERVICE_ACCOUNT env var. Must be valid JSON.');
    process.exit(1);
  }
} else {
  const localKeyPath = path.join(__dirname, 'serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    const serviceAccount = require('./serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  } else {
    console.error(
      'Missing Firebase Admin credentials. Provide GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT, or create backend/serviceAccountKey.json'
    );
    process.exit(1);
  }
}

admin.initializeApp({ credential });

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json());

async function loginWithRole(req, res, expectedRole) {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usersRef = db.collection('users');
    const snapshot = await usersRef
      .where('username', '==', username)
      .where('password', '==', password)
      .limit(1)
      .get();

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    if (user.role !== expectedRole) {
      return res.status(403).json({
        message: `You are not allowed to login here. Your role is '${user.role}', this login is for '${expectedRole}' only.`,
      });
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: user.username,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
        position: user.position,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

app.post('/auth/staff/login', async (req, res) => {
  await loginWithRole(req, res, 'staff');
});

app.post('/auth/admin/login', async (req, res) => {
  await loginWithRole(req, res, 'admin');
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
