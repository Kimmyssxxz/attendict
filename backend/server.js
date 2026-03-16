const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

 const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

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
  const localKeyPath = path.join(__dirname, 'config', 'serviceAccountKey.json');
  if (fs.existsSync(localKeyPath)) {
    const serviceAccount = require('./config/serviceAccountKey.json');
    credential = admin.credential.cert(serviceAccount);
  } else {
    console.error(
      'Missing Firebase Admin credentials. Provide GOOGLE_APPLICATION_CREDENTIALS, FIREBASE_SERVICE_ACCOUNT, or create backend/config/serviceAccountKey.json'
    );
    process.exit(1);
  }
}

admin.initializeApp({ credential });

const db = admin.firestore();
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use((err, req, res, next) => {
  if (err && err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  return next(err);
});

const geoReverseCache = new Map();
let lastGeoReverseFetchAt = 0;

function normalizeGeoKey(lat, lon) {
  const latNum = typeof lat === 'number' ? lat : parseFloat(lat);
  const lonNum = typeof lon === 'number' ? lon : parseFloat(lon);
  if (!Number.isFinite(latNum) || !Number.isFinite(lonNum)) return null;
  return `${latNum.toFixed(6)},${lonNum.toFixed(6)}`;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchNominatimReverse(url) {
  const r = await fetch(url, {
    headers: {
      'User-Agent': 'Attendict/1.0 (contact: attendict@example.com)',
      Accept: 'application/json',
      'Accept-Language': 'en',
      Referer: 'http://localhost:3001/',
    },
  });
  return r;
}

async function fetchJson(url, options = {}) {
  const r = await fetch(url, {
    headers: {
      Accept: 'application/json',
      'User-Agent': 'Attendict/1.0 (contact: attendict@example.com)',
      ...(options.headers || {}),
    },
    ...options,
  });
  if (!r.ok) {
    const text = await r.text().catch(() => '');
    return { ok: false, status: r.status, text };
  }
  const json = await r.json().catch(() => null);
  return { ok: true, status: r.status, json };
}

function normalizeReverseResponse({ displayName, lat, lon, raw, provider }) {
  const addressFromObject = (obj) => {
    if (!obj || typeof obj !== 'object') return null;
    const parts = [
      obj.house_number,
      obj.road || obj.street || obj.pedestrian || obj.path,
      obj.neighbourhood || obj.quarter,
      obj.suburb || obj.village || obj.locality || obj.hamlet,
      obj.city_district || obj.district,
      obj.city || obj.town || obj.municipality,
      obj.state || obj.region || obj.province,
      obj.postcode,
      obj.country
    ].filter(Boolean);
    const uniqueParts = [...new Set(parts)];
    return uniqueParts.length ? uniqueParts.join(', ') : null;
  };

  let cleanAddress = null;
  
  if (provider === 'photon' && raw && Array.isArray(raw.features) && raw.features.length > 0) {
    cleanAddress = addressFromObject(raw.features[0].properties);
  } else if (raw && raw.address) {
    cleanAddress = addressFromObject(raw.address);
  } else if (raw && raw.properties) {
    cleanAddress = addressFromObject(raw.properties);
  } else {
    cleanAddress = addressFromObject(raw);
  }

  // Use the cleanly rebuilt address first. If it fails, fallback to standard display_name.
  let finalDisplayName = cleanAddress;

  if (!finalDisplayName) {
    finalDisplayName = typeof displayName === 'string' ? displayName.trim() : '';
    // Basic fallback strip if present
    if (raw && raw.address && raw.category) {
      const poiCategories = ['amenity', 'building', 'shop', 'office', 'leisure', 'historic', 'tourism', 'craft'];
      if (poiCategories.includes(raw.category)) {
        const poiName = raw.name || raw.address[raw.category] || raw.address[raw.type] || raw.address.poi;
        if (poiName && finalDisplayName.startsWith(poiName + ', ')) {
          finalDisplayName = finalDisplayName.substring(poiName.length + 2).trim();
        } else if (poiName === finalDisplayName) {
          finalDisplayName = '';
        }
      }
    }
  }

  if (!finalDisplayName) return null;
  
  return {
    display_name: finalDisplayName,
    lat: typeof lat === 'string' || typeof lat === 'number' ? String(lat) : undefined,
    lon: typeof lon === 'string' || typeof lon === 'number' ? String(lon) : undefined,
    raw: raw || null,
    provider: provider || 'unknown',
  };
}

app.get('/geo/reverse', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) return res.status(400).json({ error: 'Missing lat/lon' });

    const key = normalizeGeoKey(lat, lon);
    if (!key) return res.status(400).json({ error: 'Invalid lat/lon' });

    const cached = geoReverseCache.get(key);
    if (cached && cached.expiresAt > Date.now()) {
      return res.json(cached.data);
    }

    const now = Date.now();
    const waitMs = Math.max(0, 1100 - (now - lastGeoReverseFetchAt));
    if (waitMs > 0) await sleep(waitMs);

    const baseLat = encodeURIComponent(key.split(',')[0]);
    const baseLon = encodeURIComponent(key.split(',')[1]);
    const contactEmail = encodeURIComponent(process.env.NOMINATIM_EMAIL || 'attendict@example.com');
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${baseLat}&lon=${baseLon}&zoom=18&addressdetails=1&namedetails=1&email=${contactEmail}`;
    const fallbackUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${baseLat}&lon=${baseLon}&zoom=18&addressdetails=1&email=${contactEmail}`;

    let r = await fetchNominatimReverse(url);
    lastGeoReverseFetchAt = Date.now();

    if (!r.ok && (r.status === 403 || r.status === 429)) {
      await sleep(2500);
      r = await fetchNominatimReverse(url);
      lastGeoReverseFetchAt = Date.now();
    }

    if (!r.ok && (r.status === 403 || r.status === 429)) {
      await sleep(2500);
      r = await fetchNominatimReverse(fallbackUrl);
      lastGeoReverseFetchAt = Date.now();
    }

    if (!r.ok && r.status === 403) {
      await sleep(3500);
      r = await fetchNominatimReverse(fallbackUrl);
      lastGeoReverseFetchAt = Date.now();
    }

    if (!r.ok) {
      if (r.status === 403 || r.status === 429) {
        const errors = [];

        const photonUrl = `https://photon.komoot.io/reverse?lat=${baseLat}&lon=${baseLon}`;
        const photon = await fetchJson(photonUrl);
        if (photon.ok && photon.json) {
          const feature = Array.isArray(photon.json?.features) ? photon.json.features[0] : null;
          const label = feature?.properties?.name || feature?.properties?.label || null;
          const normalized = normalizeReverseResponse({
            displayName: label,
            lat: key.split(',')[0],
            lon: key.split(',')[1],
            raw: photon.json,
            provider: 'photon',
          });
          if (normalized) {
            geoReverseCache.set(key, {
              expiresAt: Date.now() + 1000 * 60 * 60,
              data: normalized,
            });
            return res.json(normalized);
          }
          errors.push({ provider: 'photon', status: photon.status, details: 'No label in response' });
        } else {
          errors.push({ provider: 'photon', status: photon.status, details: photon.text });
        }

        const altUrl = `https://geocode.maps.co/reverse?lat=${baseLat}&lon=${baseLon}`;
        const alt = await fetchJson(altUrl);
        if (alt.ok && alt.json) {
          const normalized = normalizeReverseResponse({
            displayName: alt.json?.display_name || alt.json?.displayName || alt.json?.label || alt.json?.address,
            lat: alt.json?.lat || key.split(',')[0],
            lon: alt.json?.lon || key.split(',')[1],
            raw: alt.json,
            provider: 'geocode.maps.co',
          });
          if (normalized) {
            geoReverseCache.set(key, {
              expiresAt: Date.now() + 1000 * 60 * 60,
              data: normalized,
            });
            return res.json(normalized);
          }
          errors.push({ provider: 'geocode.maps.co', status: alt.status, details: 'No display_name in response' });
        } else {
          errors.push({ provider: 'geocode.maps.co', status: alt.status, details: alt.text });
        }

        const text = await r.text();
        return res.json({
          error: 'Reverse geocoding blocked',
          status: r.status,
          details: text,
          fallbacks: errors,
        });
      }

      const text = await r.text();
      return res.json({
        error: 'Nominatim error',
        status: r.status,
        details: text,
      });
    }

    const data = await r.json();

    const normalizedData = normalizeReverseResponse({
      displayName: data.display_name || data.name,
      lat: data.lat || key.split(',')[0],
      lon: data.lon || key.split(',')[1],
      raw: data,
      provider: 'nominatim'
    }) || data;

    geoReverseCache.set(key, {
      expiresAt: Date.now() + 1000 * 60 * 60,
      data: normalizedData,
    });

    return res.json(normalizedData);
  } catch (e) {
    return res.status(500).json({ error: e.message || 'Unknown error' });
  }
});

// Simple startup test to verify Firestore credentials and connectivity
(async () => {
  try {
    const testSnap = await db.collection('users').limit(1).get();
    console.log('Firestore startup test OK. Users docs found:', testSnap.size);
  } catch (e) {
    console.error('Firestore startup test FAILED:', e);
  }
})();

function getTodayInfo() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateString = `${year}-${month}-${day}`;
  const timeString = now.toTimeString().slice(0, 8); // HH:MM:SS
  return { now, dateString, timeString };
}

function parseUserAgent(ua) {
  if (!ua || typeof ua !== 'string') {
    return {
      device: 'Unknown device',
      browser: 'Unknown',
    };
  }

  let browser = 'Unknown';
  if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('OPR/') || ua.includes('Opera')) browser = 'Opera';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('MSIE') || ua.includes('Trident/')) browser = 'Internet Explorer';

  let device = 'Unknown device';
  if (/Windows NT/i.test(ua)) device = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) device = 'Mac';
  else if (/Android/i.test(ua)) device = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) device = 'iOS';

  return { device, browser };
}

// Create a notification document for a specific user and role
async function createUserNotification(userId, { title, message, type, metadata }) {
  try {
    if (!userId) return;

    let role = null;
    try {
      const userSnap = await db.collection('users').doc(userId).get();
      if (userSnap.exists) {
        const user = userSnap.data();
        role = user.role || null;
      }
    } catch (e) {
      console.error('Fetch user for notification failed:', e);
    }

    const payload = {
      userId,
      role: role || null,
      title: title || '',
      message: message || '',
      type: type || 'info',
      metadata: metadata || null,
      isRead: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection('notifications').add(payload);
  } catch (err) {
    console.error('Create notification error:', err);
  }
}

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
        middleName: user.middleName,
        lastName: user.lastName,
        position: user.position,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

// Unified login for intern (student) and staff
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const usernameNormalized = String(username || '').trim();
    const passwordNormalized = String(password || '').trim();

    if (!usernameNormalized || !passwordNormalized) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const usersRef = db.collection('users');

    const usernameCandidates = Array.from(
      new Set([
        usernameNormalized,
        usernameNormalized.toLowerCase(),
        usernameNormalized.toUpperCase(),
      ])
    ).slice(0, 10);

    let snapshot = await usersRef.where('username', 'in', usernameCandidates).limit(1).get();
    if (snapshot.empty) {
      snapshot = await usersRef.where('email', '==', usernameNormalized).limit(1).get();
    }

    if (snapshot.empty) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const userDoc = snapshot.docs[0];
    const user = userDoc.data();

    const storedPassword = String(user?.password || '').trim();
    if (!storedPassword || storedPassword !== passwordNormalized) {
      return res.status(401).json({ message: 'Invalid username or password' });
    }

    const normalizedRole = user.role === 'intern' ? 'student' : user.role;

    if (normalizedRole !== 'student' && normalizedRole !== 'staff') {
      return res.status(403).json({ message: 'Only intern and staff accounts may log in here.' });
    }

    return res.json({
      message: 'Login successful',
      user: {
        id: userDoc.id,
        username: user.username,
        role: normalizedRole,
        firstName: user.firstName,
        middleName: user.middleName,
        lastName: user.lastName,
        position: user.position,
      },
    });
  } catch (err) {
    console.error('Unified login error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Enroll fingerprint template for a staff user
app.post('/staff/fingerprint/enroll', async (req, res) => {
  try {
    const { staffId, username, email, template } = req.body || {};

    const staffIdNormalized = String(staffId || '').trim();
    const usernameNormalized = String(username || '').trim();
    const emailNormalized = String(email || '').trim();
    const templateBase64 = String(template || '').trim();

    if (!staffIdNormalized && !usernameNormalized && !emailNormalized) {
      return res.status(400).json({ message: 'staffId or username/email is required' });
    }

    if (!templateBase64) {
      return res.status(400).json({ message: 'template is required' });
    }

    let userRef = null;
    let userSnap = null;

    if (staffIdNormalized) {
      userRef = db.collection('users').doc(staffIdNormalized);
      userSnap = await userRef.get();
    }

    if (!userSnap || !userSnap.exists) {
      const usersRef = db.collection('users');
      let snap = null;

      if (usernameNormalized) {
        snap = await usersRef.where('username', '==', usernameNormalized).limit(1).get();
      }

      if ((!snap || snap.empty) && emailNormalized) {
        snap = await usersRef.where('email', '==', emailNormalized).limit(1).get();
      }

      if (!snap || snap.empty) {
        return res.status(404).json({ message: 'Staff user not found' });
      }

      userSnap = snap.docs[0];
      userRef = userSnap.ref;
    }

    const user = userSnap.data() || {};
    const roleNormalized = user.role === 'intern' ? 'student' : user.role;
    if (roleNormalized !== 'staff') {
      return res.status(403).json({ message: 'Only staff users can enroll fingerprint' });
    }

    await userRef.update({
      fingerprintTemplateBase64: templateBase64,
      fingerprintEnrolledAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    const resolvedStaffId = userSnap.id;

    await createUserNotification(resolvedStaffId, {
      title: 'Fingerprint Enrolled',
      message: 'Your fingerprint has been enrolled successfully.',
      type: 'fingerprint_enrollment',
      metadata: {},
    });

    return res.json({ message: 'Fingerprint enrolled successfully', staffId: resolvedStaffId });
  } catch (err) {
    console.error('Fingerprint enrollment error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/users/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const { userAgent, location } = req.body || {};
    const { device, browser } = parseUserAgent(userAgent || '');

    const sessionsRef = db.collection('sessions');

    const existingSnap = await sessionsRef
      .where('userId', '==', id)
      .where('isCurrent', '==', true)
      .limit(1)
      .get();

    const now = new Date();

    let sessionDocRef;
    if (!existingSnap.empty) {
      sessionDocRef = existingSnap.docs[0].ref;
      await sessionDocRef.update({
        device,
        browser,
        location: location || 'Philippines',
        lastActive: admin.firestore.Timestamp.fromDate(now),
      });
    } else {
      const payload = {
        userId: id,
        device,
        browser,
        location: location || 'Philippines',
        isCurrent: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastActive: admin.firestore.Timestamp.fromDate(now),
      };
      sessionDocRef = await sessionsRef.add(payload);
    }

    const currentSnap = await sessionDocRef.get();
    return res.json({
      message: 'Session recorded',
      session: { id: currentSnap.id, ...currentSnap.data() },
    });
  } catch (err) {
    console.error('Create/update session error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/users/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('sessions')
      .where('userId', '==', id)
      .get();

    const sessions = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const ta = a.lastActive && a.lastActive.toMillis ? a.lastActive.toMillis() : 0;
        const tb = b.lastActive && b.lastActive.toMillis ? b.lastActive.toMillis() : 0;
        return tb - ta;
      });

    return res.json({
      message: 'Sessions fetched',
      sessions,
    });
  } catch (err) {
    console.error('Fetch sessions error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/users/:id/sessions/:sessionId', async (req, res) => {
  try {
    const { id, sessionId } = req.params;
    if (!id || !sessionId) {
      return res.status(400).json({ message: 'User id and sessionId are required' });
    }

    const sessionRef = db.collection('sessions').doc(sessionId);
    const snap = await sessionRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const data = snap.data();
    if (data.userId !== id) {
      return res.status(403).json({ message: 'Session does not belong to this user' });
    }
    await sessionRef.delete();
    return res.json({ message: 'Session revoked' });
  } catch (err) {
    console.error('Delete session error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.delete('/users/:id/sessions', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('sessions')
      .where('userId', '==', id)
      .get();

    if (snap.empty) {
      return res.json({ message: 'No sessions to revoke', deleted: 0 });
    }

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return res.json({ message: 'All sessions revoked', deleted: snap.size });
  } catch (err) {
    console.error('Delete all sessions error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete all notifications for a specific user
app.delete('/notifications/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('notifications')
      .where('userId', '==', id)
      .get();

    if (snap.empty) {
      return res.json({ message: 'No notifications to delete', deleted: 0 });
    }

    const batch = db.batch();
    snap.docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    return res.json({ message: 'Notifications deleted', deleted: snap.size });
  } catch (err) {
    console.error('Delete notifications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete selected notifications for a specific user, matched by message text
app.post('/notifications/user/:id/delete-selected', async (req, res) => {
  try {
    const { id } = req.params;
    const { messages } = req.body || {};

    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'messages array is required' });
    }

    // Firestore "in" filter supports up to 10 values; if more, we'll chunk
    const chunkSize = 10;
    let totalDeleted = 0;

    for (let i = 0; i < messages.length; i += chunkSize) {
      const chunk = messages.slice(i, i + chunkSize);
      const snap = await db
        .collection('notifications')
        .where('userId', '==', id)
        .where('message', 'in', chunk)
        .get();

      if (snap.empty) continue;

      const batch = db.batch();
      snap.docs.forEach((doc) => batch.delete(doc.ref));
      await batch.commit();
      totalDeleted += snap.size;
    }

    return res.json({ message: 'Selected notifications deleted', deleted: totalDeleted });
  } catch (err) {
    console.error('Delete selected notifications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch notifications for a specific user
app.get('/notifications/user/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const snap = await db
      .collection('notifications')
      .where('userId', '==', id)
      .get();

    const notifications = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const ta = a.createdAt && a.createdAt.toMillis ? a.createdAt.toMillis() : 0;
        const tb = b.createdAt && b.createdAt.toMillis ? b.createdAt.toMillis() : 0;
        return tb - ta;
      });

    return res.json({
      message: 'Notifications fetched',
      notifications,
    });
  } catch (err) {
    console.error('Fetch notifications error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Admin login only; staff and intern login endpoints have been removed
app.post('/auth/admin/login', async (req, res) => {
  await loginWithRole(req, res, 'admin');
});

app.post('/auth/intern/register', async (req, res) => {
  try {
    const {
      username,
      firstName,
      middleName,
      lastName,
      email,
      schoolOrUniversity,
      assignedOffice,
      position,
      password,
    } = req.body;

    if (!username || !firstName || !lastName || !email || !schoolOrUniversity || !assignedOffice || !position || !password) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const usersRef = db.collection('users');

    const existingSnap = await usersRef.where('username', '==', username).limit(1).get();
    if (!existingSnap.empty) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    const docRef = await usersRef.add({
      username,
      firstName,
      middleName: middleName || '',
      lastName,
      email,
      schoolOrUniversity,
      assignedOffice,
      position,
      role: 'student',
      tagging: 'Normal Hours',
      password,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return res.status(201).json({
      message: 'Intern registered successfully',
      userId: docRef.id,
    });
  } catch (err) {
    console.error('Intern register error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch full user document by ID (for name formatting, etc.)
app.get('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const userRef = db.collection('users').doc(id);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({
      message: 'User fetched',
      user: { id: snap.id, ...snap.data() },
    });
  } catch (err) {
    console.error('Fetch user error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/attendance/intern/time-in', async (req, res) => {
  try {
    const { internId, location } = req.body;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { now, dateString, timeString } = getTodayInfo();

    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('attendance').doc(docId);
    const snapshot = await attendanceRef.get();

    // Decide session purely from current clock time
    const hour = now.getHours();
    const minute = now.getMinutes();
    const session = hour < 12 ? 'AM' : 'PM';

    let payload;
    let existing = null;

    if (snapshot.exists) {
      existing = snapshot.data();

      if (existing.isLocked) {
        return res.status(400).json({ message: 'Attendance already locked for this date.' });
      }

      const { timeInAM, timeInPM } = existing;

      // Prevent multiple time-ins for the same session
      if (session === 'AM' && timeInAM) {
        return res.status(400).json({ message: 'You have already timed in for AM today.' });
      }
      if (session === 'PM' && timeInPM) {
        return res.status(400).json({ message: 'You have already timed in for PM today.' });
      }
    }

    const isLate = hour > 8 || (hour === 8 && minute > 0);

    if (!existing) {
      payload = {
        internId,
        date: dateString,
        timeInAM: session === 'AM' ? timeString : null,
        timeOutAM: null,
        timeInPM: session === 'PM' ? timeString : null,
        timeOutPM: null,
        totalMinutesAM: null,
        totalMinutesPM: null,
        totalMinutes: null,
        statusAM: session === 'AM' ? (isLate ? 'Late' : 'Present') : null,
        statusPM: session === 'PM' ? (isLate ? 'Late' : 'Present') : null,
        locationAM: session === 'AM' && location ? location : null,
        locationPM: session === 'PM' && location ? location : null,
        isLocked: false,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };
    } else {
      payload = {
        ...existing,
        internId,
        date: dateString,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      };

      if (session === 'AM') {
        payload.timeInAM = timeString;
        payload.statusAM = isLate ? 'Late' : 'Present';
        if (location) {
          payload.locationAM = location;
        }
      } else {
        payload.timeInPM = timeString;
      }
    }

    await attendanceRef.set(payload, { merge: true });

    const statusForSession = isLate ? 'Late' : 'Present';

    // Build a plain JSON snapshot of the attendance record without Firestore FieldValue
    const responseRecord = {
      internId,
      date: dateString,
      timeInAM: payload.timeInAM || null,
      timeOutAM: payload.timeOutAM || null,
      timeInPM: payload.timeInPM || null,
      timeOutPM: payload.timeOutPM || null,
      totalMinutesAM: payload.totalMinutesAM ?? null,
      totalMinutesPM: payload.totalMinutesPM ?? null,
      totalMinutes: payload.totalMinutes ?? null,
      statusAM: payload.statusAM || null,
      statusPM: payload.statusPM || null,
      locationAM: payload.locationAM || null,
      locationPM: payload.locationPM || null,
      isLocked: !!payload.isLocked,
    };

    // Also write a notification for this time in (saved per user & role)
    await createUserNotification(internId, {
      title: 'Time In Recorded',
      message: `You timed in for ${session} at ${timeString} on ${dateString}.`,
      type: 'time_in',
      metadata: {
        date: dateString,
        session,
        time: timeString,
        attendanceDocId: docId,
        status: statusForSession,
      },
    });

    // Return only plain JSON values (no FieldValue objects)
    return res.json({
      message: 'Time in recorded',
      data: {
        date: dateString,
        session,
        timeIn: session === 'AM' ? timeString : timeString,
        timeOut: null,
        lastActionTime: timeString,
        status: statusForSession,
        record: responseRecord,
      },
    });
  } catch (err) {
    console.error('Time-in error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/attendance/intern/time-out', async (req, res) => {
  try {
    const { internId } = req.body;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { now, dateString, timeString } = getTodayInfo();

    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('attendance').doc(docId);
    const snapshot = await attendanceRef.get();

    if (!snapshot.exists) {
      return res.status(400).json({ message: 'No time-in record found for today.' });
    }

    const data = snapshot.data();

    if (data.isLocked) {
      return res.status(400).json({ message: 'Attendance already locked for this date.' });
    }

    let session = null;
    let timeInForSession = null;

    // Determine which session is currently open (AM first, then PM)
    if (data.timeInAM && !data.timeOutAM) {
      session = 'AM';
      timeInForSession = data.timeInAM;
    } else if (data.timeInPM && !data.timeOutPM) {
      session = 'PM';
      timeInForSession = data.timeInPM;
    } else if (!data.timeInAM && !data.timeInPM) {
      return res.status(400).json({ message: 'Cannot time out without time in.' });
    } else {
      return res.status(400).json({ message: 'You have already timed out for all sessions today.' });
    }

    const [inHour, inMinute, inSecond] = timeInForSession.split(':').map(Number);
    const timeInDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), inHour, inMinute, inSecond || 0);
    const diffMs = now.getTime() - timeInDate.getTime();
    const totalMinutesForSession = Math.max(0, Math.round(diffMs / 60000));

    const updated = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (session === 'AM') {
      updated.timeOutAM = timeString;
      updated.totalMinutesAM = totalMinutesForSession;
    } else {
      updated.timeOutPM = timeString;
      updated.totalMinutesPM = totalMinutesForSession;
    }

    const totalMinutesAM = updated.totalMinutesAM ?? data.totalMinutesAM ?? 0;
    const totalMinutesPM = updated.totalMinutesPM ?? data.totalMinutesPM ?? 0;
    updated.totalMinutes = totalMinutesAM + totalMinutesPM;

    await attendanceRef.set(updated, { merge: true });

    // Determine status for the session from existing doc plus our updates
    const merged = { ...data, ...updated };
    const statusForSession = session === 'AM' ? (merged.statusAM || '') : (merged.statusPM || '');

    // Build a plain JSON snapshot of the attendance record without Firestore FieldValue
    const responseRecord = {
      internId: merged.internId,
      date: merged.date,
      timeInAM: merged.timeInAM || null,
      timeOutAM: merged.timeOutAM || null,
      timeInPM: merged.timeInPM || null,
      timeOutPM: merged.timeOutPM || null,
      totalMinutesAM: merged.totalMinutesAM ?? null,
      totalMinutesPM: merged.totalMinutesPM ?? null,
      totalMinutes: merged.totalMinutes ?? null,
      statusAM: merged.statusAM || null,
      statusPM: merged.statusPM || null,
      locationAM: merged.locationAM || null,
      locationPM: merged.locationPM || null,
      isLocked: !!merged.isLocked,
    };

    // Also write a notification for this time out (saved per user & role)
    await createUserNotification(internId, {
      title: 'Time Out Recorded',
      message: `You timed out for ${session} at ${timeString} on ${dateString}.`,
      type: 'time_out',
      metadata: {
        date: dateString,
        session,
        time: timeString,
        attendanceDocId: docId,
        status: statusForSession,
      },
    });

    // Return only plain JSON values (no FieldValue objects)
    return res.json({
      message: 'Time out recorded',
      data: {
        date: dateString,
        session,
        // For convenience, include both times for this day
        timeIn: session === 'AM' ? merged.timeInAM : merged.timeInPM,
        timeOut: session === 'AM' ? merged.timeOutAM : merged.timeOutPM,
        lastActionTime: timeString,
        status: statusForSession,
        record: responseRecord,
      },
    });
  } catch (err) {
    console.error('Time-out error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});

// Update basic user info (school, phone, email, etc.)
app.put('/users/:id/info', async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }

    const {
      schoolOrUniversity,
      phoneNumber,
      email,
      requiredHours,
      ojtRequiredHours,
    } = req.body;

    const userRef = db.collection('users').doc(id);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatePayload = {};
    if (typeof schoolOrUniversity === 'string') updatePayload.schoolOrUniversity = schoolOrUniversity;
    if (typeof phoneNumber === 'string') updatePayload.phoneNumber = phoneNumber;
    if (typeof email === 'string') updatePayload.email = email;
    if (requiredHours !== undefined) {
      const parsedRequired = Number(requiredHours);
      if (Number.isFinite(parsedRequired) && parsedRequired > 0) {
        updatePayload.requiredHours = parsedRequired;
      }
    }
    if (ojtRequiredHours !== undefined) {
      const parsedOjt = Number(ojtRequiredHours);
      if (Number.isFinite(parsedOjt) && parsedOjt > 0) {
        updatePayload.ojtRequiredHours = parsedOjt;
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return res.status(400).json({ message: 'No updatable fields provided' });
    }

    updatePayload.updatedAt = admin.firestore.FieldValue.serverTimestamp();

    await userRef.update(updatePayload);

    const updatedSnap = await userRef.get();
    const updatedUser = { id: updatedSnap.id, ...updatedSnap.data() };

    // Create a notification that profile info was updated
    await createUserNotification(id, {
      title: 'Profile Updated',
      message: 'Your profile information was updated.',
      type: 'profile_update',
      metadata: {
        updatedFields: Object.keys(updatePayload),
      },
    });

    return res.json({
      message: 'User info updated',
      user: updatedUser,
    });
  } catch (err) {
    console.error('Update user info error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Change user password with current password verification
app.post('/users/:id/change-password', async (req, res) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!id) {
      return res.status(400).json({ message: 'User id is required' });
    }
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    const userRef = db.collection('users').doc(id);
    const snap = await userRef.get();
    if (!snap.exists) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = snap.data();
    if (user.password !== currentPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    await userRef.update({
      password: newPassword,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Create a notification that password was changed
    await createUserNotification(id, {
      title: 'Password Changed',
      message: 'Your account password was changed.',
      type: 'password_change',
      metadata: {},
    });

    return res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error('Change password error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch today's attendance record for an intern
app.get('/attendance/intern/today', async (req, res) => {
  try {
    const { internId } = req.query;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const { dateString } = getTodayInfo();
    const docId = `${internId}_${dateString}`;
    const attendanceRef = db.collection('attendance').doc(docId);
    const snapshot = await attendanceRef.get();

    if (!snapshot.exists) {
      return res.json({
        message: 'No attendance record for today',
        data: null,
      });
    }

    const data = snapshot.data();

    const responseRecord = {
      internId: data.internId,
      date: data.date,
      timeInAM: data.timeInAM || null,
      timeOutAM: data.timeOutAM || null,
      timeInPM: data.timeInPM || null,
      timeOutPM: data.timeOutPM || null,
      totalMinutesAM: data.totalMinutesAM ?? null,
      totalMinutesPM: data.totalMinutesPM ?? null,
      totalMinutes: data.totalMinutes ?? null,
      tagAM: data.tagAM || null,
      tagPM: data.tagPM || null,
      locationAM: data.locationAM || null,
      locationPM: data.locationPM || null,
      isLocked: !!data.isLocked,
    };

    return res.json({
      message: 'Attendance for today',
      data: responseRecord,
    });
  } catch (err) {
    console.error('Fetch today attendance error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// Fetch full attendance history for an intern
app.get('/attendance/intern/history', async (req, res) => {
  try {
    const { internId } = req.query;

    if (!internId) {
      return res.status(400).json({ message: 'internId is required' });
    }

    const snap = await db
      .collection('attendance')
      .where('internId', '==', internId)
      .get();

    if (snap.empty) {
      return res.json({
        message: 'No attendance records found',
        data: [],
      });
    }

    const records = snap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a, b) => {
        const da = a.date || '';
        const dbDate = b.date || '';
        if (da < dbDate) return -1;
        if (da > dbDate) return 1;
        return 0;
      });

    return res.json({
      message: 'Attendance history fetched',
      data: records,
    });
  } catch (err) {
    console.error('Fetch attendance history error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});
