KAYRA ENTERPRISE V3 FINAL PACKAGE
=================================

Files:
- index-v3.html              Customer storefront
- admin-v3-final.html        Full admin panel
- firebase.js                Firebase initialization
- firestore.rules            Firestore security rules
- README-V3.txt              Setup notes

IMPORTANT SECURITY
------------------
1. V2 is not modified by this package.
2. Firebase web API keys are not passwords, but Firestore Rules are the real database boundary.
3. Apply firestore.rules in Firebase Console before production use.
4. Enable Firebase App Check for production.
5. Cloudinary unsigned upload presets are client-visible. Restrict the preset by format/size/folder.
   For maximum security, use signed uploads through a server-side function.
6. Do NOT put Gemini API secrets in HTML/JS. The admin AI button expects a secure backend endpoint:
   POST /api/gemini
   { "prompt": "..." }
   The backend should hold GEMINI_API_KEY and call the Gemini API.
7. GitHub Pages cannot run /api/gemini by itself. Use Firebase Cloud Functions, Cloud Run, or another
   serverless backend for Gemini.
8. WhatsApp promotional campaigns should only use customers who explicitly opted in. Provide an
   unsubscribe/opt-out mechanism and comply with applicable messaging rules.

DEPLOYMENT
----------
Recommended V3 branch:
- Put index-v3.html at the root and test it first.
- Rename/copy to index.html only after testing, or keep the current V2 index.html untouched while
  testing at a separate path.
- Put admin-v3-final.html at root.
- Keep V2 files as backup.

CATEGORY BEHAVIOR
-----------------
Admin creates categories/subcategories.
Customer storefront only shows active categories that have at least one product.

PHOTO EDIT
----------
Admin Edit Product supports:
- existing photo list
- remove individual photos
- add multiple new photos
- save updated image list

CURRENT LIMITATION
------------------
This package preserves the existing Cloudinary upload-preset architecture from V2. It adds client-side
file type/size validation but cannot make an unsigned Cloudinary preset secret. Configure Cloudinary
restrictions and migrate to signed uploads for stronger production security.

DATA COMPATIBILITY
------------------
Existing products using `category`/`image`/`images` are read. New products also store categoryId.
Existing order fields are tolerated by the rules.
