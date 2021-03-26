// UI component for user profile
export default function UserProfile({ user }) {
	console.log(user.photoURL);

	const photo = user.photoURL.replace('s96-c', 's400-c');

	return (
		<div className='box-center'>
			<img src={photo} className='card-img-center' />
			<p>
				<i>@{user.username}</i>
			</p>
			<h1>{user.displayName}</h1>
		</div>
	);
}
