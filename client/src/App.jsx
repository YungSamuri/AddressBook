import { useEffect } from 'react';
import './App.css'
import { Outlet, Link } from 'react-router-dom'

function App() {
	async function logout() {
		const res = await fetch("/registration/logout/", {
		credentials: "same-origin", // include cookies!
		});

		if (res.ok) {
		// navigate away from the single page app!
		window.location = "/registration/sign_in/";
		} else {
		// handle logout failed!
		}
	}

	useEffect(() => {
		document.title = "Address Book";
	})

	return (
		<>
			<nav>
				<span>
					<Link to="/new-contact">New Contact</Link>
					<Link to="/">Contacts</Link>
				</span>
				<Link to="/">
					Address Book
				</Link>
				<span>
					<button onClick={logout}>Logout</button>
				</span>
			</nav>
			<Outlet />
		</>
	)
}

export default App;
