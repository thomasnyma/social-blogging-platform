import styles from '../../styles/Post.module.css';
import PostContent from '../../components/PostContent';
import {
	firestore,
	getUserWithUsername,
	postToJSON,
} from '../../library/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import Metatags from '../../components/Metatags';
import AuthCheck from '../../components/AuthCheck';
import React from 'react';
import HeartButton from '../../components/HeartButton';
import Link from 'next/link';

export async function getStaticProps({ params }) {
	const { username, slug } = params;
	const userDocument = await getUserWithUsername(username);

	let post;
	let path;

	if (userDocument) {
		const postReference = userDocument.ref.collection('posts').doc(slug);
		post = postToJSON(await postReference.get());

		path = postReference.path;
	}

	return {
		props: { post, path },
		revalidate: 5000,
	};
}

export async function getStaticPaths() {
	// Improve by using Admin SDK to select empty docs
	const snapshot = await firestore.collectionGroup('posts').get();

	const paths = snapshot.docs.map((doc) => {
		const { slug, username } = doc.data();
		return {
			params: { username, slug },
		};
	});

	return {
		paths,
		fallback: 'blocking',
	};
}

export default function Post(props) {
	const postReference = firestore.doc(props.path);
	const [realtimePost] = useDocumentData(postReference);

	const post = realtimePost || props.post;

	return (
		<main className={styles.container}>
			<Metatags />
			<section>
				<PostContent post={post} />
			</section>

			<aside className='card'>
				<p>
					<strong>{post.heartCount || 0} 💗</strong>
				</p>

				<AuthCheck
					fallback={
						<Link href='/enter'>
							<button>💗 Sign Up</button>
						</Link>
					}
				>
					<HeartButton postRef={postReference} />
				</AuthCheck>
			</aside>
		</main>
	);
}
