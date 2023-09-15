import * as admin from 'firebase-admin';
import { app } from 'firebase-admin';
import * as serviceAccount from 'service-account-key.json';

export const firebaseAdmin: app.App = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});
