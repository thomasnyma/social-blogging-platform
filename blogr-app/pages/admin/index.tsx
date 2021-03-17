import styles from '../../styles/Admin.module.css';
import AuthCheck from '../../components/AuthCheck';
import kebabCase from 'lodash.kebabcase';
import { auth, firestore, serverTimestamp } from '../../library/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import React, { useContext, useState } from 'react';
import PostFeed from '../../components/PostFeed';
import { useRouter } from 'next/router';
import { UserContext } from '../../library/context';
import toast from 'react-hot-toast';

export default function AdminPostsPage(props) {
	return (
		<main>
			<AuthCheck>
				<PostList />
				<CreateNewPost />
			</AuthCheck>
		</main>
	);
}

function PostList() {
	const reference = firestore
		.collection('users')
		.doc(auth.currentUser.uid)
		.collection('posts');
	const query = reference.orderBy('createdAt');
	const [querySnapshot] = useCollection(query);

	const posts = querySnapshot?.docs.map((doc) => doc.data());

	return (
		<>
			<h1>Manage your posts</h1>
			<PostFeed posts={posts} admin />
		</>
	);
}

function CreateNewPost() {
	const router = useRouter();
	const { username } = useContext(UserContext);
	const [title, setTitle] = useState('');

	// Ensure the slug is URL safe
	const slug = encodeURI(kebabCase(title));

	// Validate length
	const isValid = title.length > 3 && title.length < 100;

	// Create a new post in FirestoreDatabase
	const createPost = async (event) => {
		event.preventDefault();
		const uid = auth.currentUser.uid;
		const reference = firestore
			.collection('users')
			.doc(uid)
			.collection('posts')
			.doc(slug);

		const data = {
			title,
			slug,
			uid,
			username,
			published: false,
			content: '#Hello World!',
			createdAt: serverTimestamp(),
			updatedAt: serverTimestamp(),
			heartCount: 0,
		};

		await reference.set(data);

		toast.success('Post created!');

		router.push(`/admin/${slug}`);
	};

	return (
		<form onSubmit={createPost}>
			<input
				value={title}
				onChange={(event) => setTitle(event.target.value)}
				placeholder='My Awesome Articles'
				className={styles.input}
			/>
			<p>
				<strong>Slug:</strong> {slug}
			</p>
			<button type='submit' disabled={!isValid} className='btn-green'>
				Create New Post
			</button>
		</form>
	);
}
