import '../styles/globals.css';
import Navbar from '../components/Navbar';
import { Toaster } from 'react-hot-toast';
import { UserContext } from '../library/context';

import { useUserData } from '../library/hooks';
import React from 'react';
import Metatags from '../components/Metatags';

function MyApp({ Component, pageProps }) {
	const userData = useUserData();

	return (
		<UserContext.Provider value={userData}>
			<Metatags />
			<Navbar />
			<Component {...pageProps} />
			<Toaster />
		</UserContext.Provider>
	);
}

export default MyApp;
