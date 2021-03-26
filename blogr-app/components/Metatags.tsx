import Head from 'next/head';

export default function Metatags({
	title = 'BLOGR - The Social Blogging Platform',
	description = 'A Social Blogging Platform suited for your needs.',
	image = 'https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
}) {
	return (
		<Head>
			<title>{title}</title>
			<meta name='twitter:card' content='summary' />
			<meta name='twitter:title' content={title} />
			<meta name='twitter:description' content={description} />
			<meta name='twitter:image' content={image} />

			<meta
				property='og:url'
				content='https://social-blogging-platform.vercel.app/'
			/>
			<meta property='og:type' content='app' />
			<meta property='og:title' content={title} />
			<meta property='og:description' content={description} />
			<meta property='og:image' content={image} />
		</Head>
	);
}
