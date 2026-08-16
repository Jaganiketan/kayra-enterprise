KAYRA ENTERPRISE ADMIN V3
==========================

This is a separate V3 admin panel based on the uploaded V2 admin file.

IMPORTANT:
- V2 is not modified by this package.
- Frontend JavaScript cannot provide complete security by itself.
- Before using V3 in production, configure Firestore Security Rules, Firebase App Check,
  and Cloudinary upload restrictions.
- Do NOT put Gemini or other secret API keys in frontend code.
- The current V3 keeps the existing Firebase/Cloudinary configuration from V2 so it can
  be tested against the same data, but production security rules must be verified first.

Files:
- admin-v3-secure.html
- README-V3.txt
