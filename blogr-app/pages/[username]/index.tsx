import UserProfile from '../../components/UserProfile';
import PostFeed from '../../components/PostFeed';
import { getUserWithUsername, postToJSON } from '../../library/firebase';
import Metatags from '../../components/Metatags';

export async function getServerSideProps({ query }) {
	const { username } = query;

	const userDocument = await getUserWithUsername(username);

	// If no user, short circuit to 404 page
	if (!userDocument) {
		return {
			notFound: true,
		};
	}

	// JSON serializable data
	let user = null;
	let posts = null;

	if (userDocument) {
		user = userDocument.data();
		const postsQuery = userDocument.ref
			.collection('posts')
			.where('published', '==', true)
			.orderBy('createdAt', 'desc')
			.limit(5);

		posts = (await postsQuery.get()).docs.map(postToJSON);
	}

	return {
		props: { user, posts }, // will be passed to the page component as props
	};
}

export default function UsernamePage({ user, posts }) {
	return (
		<main>
			<Metatags />
			<UserProfile user={user} />
			<PostFeed posts={posts} admin />
		</main>
	);
}
