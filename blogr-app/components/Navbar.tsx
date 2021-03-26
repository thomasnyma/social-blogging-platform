import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../library/context';
import { auth } from '../library/firebase';

// Top Navbar
export default function Navbar() {
	const { user, username } = useContext(UserContext);

	const signOut = () => {
		auth.signOut();
	};

	return (
		<nav className='navbar'>
			<ul>
				<li>
					<Link href='/'>
						<button className='btn-logo'>BLOGR</button>
					</Link>
				</li>

				{username && (
					<>
						<li className='push-left'>
							<Link href='/'>
								<button className='btn-blue' onClick={signOut}>
									Sign Out
								</button>
							</Link>
						</li>
						<li>
							<Link href='/admin'>
								<button className='btn-blue'>Write Posts</button>
							</Link>
						</li>
						<li>
							<Link href={`/${username}`}>
								<img src={user?.photoURL} />
							</Link>
						</li>
					</>
				)}

				{!username && (
					<li>
						<Link href='/enter'>
							<button className='btn-blue'>Log in</button>
						</Link>
					</li>
				)}
			</ul>
		</nav>
	);
}
