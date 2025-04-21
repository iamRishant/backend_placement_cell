// src/middleware/verifyEmail.js

export const verifyEmail = async (req, res, next) => {
  try {
    const { idToken, email } = req.body;
    
    if (!idToken) {
      return res.status(401).json({ error: 'No ID token provided' });
    }
    
    // Verify the Firebase ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const uid = decodedToken.uid;
    
    // Verify that the email is a university email
    if (!email.endsWith('@cuchd.in')) {
      return res.status(400).json({ error: 'Not a valid university email' });
    }
    
    // Here you would update your database to mark this user's email as verified
    // For example, if using MongoDB:
    /*
    await User.findOneAndUpdate(
      { firebaseUid: uid },
      { 
        $set: { 
          emailVerified: true,
          universityEmail: email,
          verifiedAt: new Date()
        }
      },
      { upsert: true }
    );
    */
    
    return res.status(200).json({ 
      success: true, 
      message: 'University email verified successfully',
      user: {
        uid,
        email
      }
    });
  } catch (error) {
    console.error('Error verifying university email:', error);
    return res.status(500).json({ error: 'Failed to verify university email' });
  }
};