var APP_CFG = {
  APPS_SCRIPT: 'https://script.google.com/macros/s/AKfycbyJzr-H_X4cjgCkUnfOw3XHBCLL-d_WbL2lKnlu4ZbIosJJ8qPg3kx18wJeM49UcbZ4/exec',

  // Isi dari Firebase Console → Project settings → General → Your apps (Web) → "SDK setup and configuration: Config".
  // vapidKey dari Project settings → Cloud Messaging → Web Push certificates → Key pair.
  // Nilai-nilai ini BUKAN rahasia (memang dipakai di browser), aman ditaruh di GitHub.
  // Kunci rahasia (file JSON service account) TIDAK ditaruh di sini, tapi di Properti Skrip Apps Script.
  FIREBASE: {
    apiKey: 'AIzaSyD1fHfh7HJbvRZGmOFyrX60rDhS-sTDcQI',
    authDomain: 'sharelinkgan-16526.firebaseapp.com',
    projectId: 'sharelinkgan-16526',
    messagingSenderId: '770631250376',
    appId: '1:770631250376:web:7089170cb91ebb8bf090fd',
    vapidKey: 'BHmA1wGPGSjvJVP6qdMj8hz_CDWVrzJlVygzBDDMF2LaU17ZEeGiGkAMnTSLAa-iIMvSCzLRJsTpmJIMZggoioA'
  }
};
if (typeof window !== 'undefined') window.APP_CFG = APP_CFG;
