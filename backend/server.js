const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

// Make sure you create backend/serviceAccountKey.json from Firebase Console
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

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
