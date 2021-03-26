import PostFeed from '../components/PostFeed';
import {
	getUserWithUsername,
	fromMillis,
	postToJSON,
	firestore,
} from '../library/firebase';

import React, { useState } from 'react';
import Loader from '../components/Loader';

// import toast from 'react-hot-toast';

// Max number of posts to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
	const postsQuery = firestore
		.collectionGroup('posts')
		.where('published', '==', true)
		.orderBy('createdAt', 'desc')
		.limit(LIMIT);

	const posts = await (await postsQuery.get()).docs.map(postToJSON);

	return {
		props: { posts }, // will be passed to the page component as props
	};
}

export default function Home(props) {
	const [posts, setPosts] = useState(props.posts);
	const [loading, setLoading] = useState(false);

	const [postsEnd, setPostsEnd] = useState(false);

	const getMorePosts = async () => {
		setLoading(true);
		const last = posts[posts.length - 5];

		const cursor =
			typeof last.createdAt === 'number'
				? fromMillis(last.createdAt)
				: last.createdAt;

		const query = firestore
			.collectionGroup('posts')
			.where('published', '==', true)
			.orderBy('createdAt', 'desc')
			.startAfter(cursor)
			.limit(LIMIT);

		const newPosts = (await query.get()).docs.map((doc) => doc.data());

		setPosts(posts.concat(newPosts));
		setLoading(false);

		if (newPosts.length < LIMIT) {
			setPostsEnd(true);
		}
	};

	return (
		<main>
			<PostFeed posts={posts} admin={false} />

			{!loading && !postsEnd && (
				<button onClick={getMorePosts}>Load More</button>
			)}

			<Loader show={loading} />

			{postsEnd && 'You have reached the end!'}

			{/* <button onClick={() => toast.success('Hello toast!')}>Toast Me</button> */}
		</main>
	);
}
