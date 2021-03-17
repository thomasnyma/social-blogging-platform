import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyDno2A8FFk83htazu4Zs4zcxu2jRj9exeQ',
	authDomain: 'blogr-ab8f1.firebaseapp.com',
	projectId: 'blogr-ab8f1',
	storageBucket: 'blogr-ab8f1.appspot.com',
	messagingSenderId: '562375684461',
	appId: '1:562375684461:web:5990a7833849bff5c7ea64',
	measurementId: 'G-V8823TQEDM',
};

if (!firebase.apps.length) {
	firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider();
export const firestore = firebase.firestore();
export const fromMillis = firebase.firestore.Timestamp.fromMillis;
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp;
export const increment = firebase.firestore.FieldValue.increment;
export const storage = firebase.storage();
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED;

// Helper functions
/**`
 * Gets a users/{uid} document with username
 * @param {string} username
 */
export async function getUserWithUsername(username) {
	const usersReference = firestore.collection('users');
	const query = usersReference.where('username', '==', username).limit(1);
	const userDocument = (await query.get()).docs[0];
	return userDocument;
}

/**`
 * Gets a users/{uid} document with username
 * @param {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
	const data = doc.data();
	return {
		...data,
		// Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
		createdAt: data?.createdAt.toMillis() || 0,
		updatedAt: data?.updatedAt.toMillis() || 0,
	};
}
