const functions = require('firebase-functions');
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();

exports.lineSignIn = functions.https.onCall(async (data, context) => {
  const { accessToken } = data;
  
  if (!accessToken) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with an access token.');
  }

  try {
    // ดึงข้อมูลผู้ใช้จาก LINE API
    const response = await axios.get('https://api.line.me/v2/profile', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const { userId, displayName } = response.data;

    // สร้าง custom token
    const firebaseToken = await admin.auth().createCustomToken(userId, { displayName });

    return { token: firebaseToken };

  } catch (error) {
    console.error('Error during LINE sign-in:', error);

    // ตรวจสอบประเภทข้อผิดพลาดและส่งกลับข้อความที่เหมาะสม
    if (error.response) {
      // ข้อผิดพลาดจาก LINE API
      throw new functions.https.HttpsError('unauthenticated', 'Invalid access token or failed to verify access token with LINE.');
    } else {
      // ข้อผิดพลาดจาก Firebase Admin SDK หรืออื่นๆ
      throw new functions.https.HttpsError('internal', 'Failed to sign in with LINE.');
    }
  }
});
