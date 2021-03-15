import { auth, firestore, googleAuthProvider } from '../library/firebase';
import { debounce } from 'lodash';
import { useCallback, useContext, useEffect, useState } from 'react';
import { UserContext } from '../library/context';

export default function EnterPage({}) {
	const { user, username } = useContext(UserContext);

	// 1. User signed out <SignInButton />
	// 2. User signed in, but missing username <UsernameForm />
	// 3. User signed in, and has username <SignOutButton />
	return (
		<main>
			{user ? (
				!username ? (
					<UsernameForm />
				) : (
					<SignOutButton />
				)
			) : (
				<SignInButton />
			)}
		</main>
	);
}

// Sign in with Google buttton
function SignInButton() {
	const signInWithGoogle = async () => {
		await auth.signInWithPopup(googleAuthProvider);
	};

	return (
		<button className='btn-google' onClick={signInWithGoogle}>
			<img src={'/google.png'} /> Sign in with Google
		</button>
	);
}

// Sign out button
function SignOutButton() {
	return <button onClick={() => auth.signOut()}>Sign out</button>;
}

// Username form
function UsernameForm() {
	const [formValue, setFormValue] = useState('');
	const [isValid, setIsValid] = useState(false);
	const [loading, setLoading] = useState(false);

	const { user, username } = useContext(UserContext);

	useEffect(() => {
		checkUsername(formValue);
	}, [formValue]);

	const onChange = (event) => {
		// Force form value typed in form to match correct format
		const value = event.target.value.toLowerCase();
		const regEx = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

		// Only set form value if length is < 3 or it passes the regular expression
		if (value.length < 3) {
			setFormValue(value);
			setLoading(false);
			setIsValid(false);
		}

		if (regEx.test(value)) {
			setFormValue(value);
			setLoading(true);
			setIsValid(false);
		}
	};

	// Hit the database for username match after each debounced change
	// useCallback is required for debounce to work
	const checkUsername = useCallback(
		debounce(async (username) => {
			if (username.length >= 3) {
				const reference = firestore.doc(`usernames/${username}`);
				const { exists } = await reference.get();
				console.log('Firestore read executed!');
				setIsValid(!exists);
				setLoading(false);
			}
		}, 500),
		[]
	);

	const onSubmit = async (event) => {
		event.preventDefault();

		// Create references for both documents
		const userDocument = firestore.doc(`users/${user.uid}`);
		const usernameDocument = firestore.doc(`usernames/${formValue}`);

		// Commit both documents together as a batch write
		const batch = firestore.batch();
		batch.set(userDocument, {
			username: formValue,
			photoURL: user.photoURL,
			displayName: user.displayName,
		});
		batch.set(usernameDocument, { uid: user.uid });

		await batch.commit();
	};

	return (
		!username && (
			<section>
				<h3>Choose Username</h3>
				<form onSubmit={onSubmit}>
					<input
						name='username'
						placeholder='username'
						value={formValue}
						onChange={onChange}
					/>
					<UsernameMessage
						username={formValue}
						isValid={isValid}
						loading={loading}
					/>

					<button type='submit' className='btn-green' disabled={!isValid}>
						Submit
					</button>

					<h3>Debug State</h3>
					<div>
						Username: {formValue}
						<br />
						Loading: {loading.toString()}
						<br />
						Username Valid: {isValid.toString()}
					</div>
				</form>
			</section>
		)
	);
}

function UsernameMessage({ username, isValid, loading }) {
	if (loading) {
		return <p>Checking...</p>;
	} else if (isValid) {
		return <p className='text-success'>{username} is available!</p>;
	} else if (username && !isValid) {
		return <p className='text-danger'>That username is already taken!</p>;
	} else {
		return <p></p>;
	}
}
