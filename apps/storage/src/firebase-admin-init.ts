import * as admin from 'firebase-admin';
import * as serviceAccount from 'service-account-key.json';

export const firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: 'gs://ghaf-f6fe9.appspot.com/',
});
