import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'vite/modulepreload-polyfill'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import { ContactForm } from './ContactForm.jsx'
import { ContactsList } from './ContactsList.jsx'
import { ContactPage } from './ContactPage.jsx'
import { Error } from './Error.jsx'


const router = createHashRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{
				path: "/",
				element: <ContactsList />
			},
			{
				path: "/new-contact",
				element: <ContactForm edit={false}/>,
			},
			{
				path: "/contact/:id",
				element: <ContactPage />,
			},
			{
				path: "/contact/:id/edit",
				element: <ContactForm edit={true}/>,
			},
			{
				path: "/error",
				element: <Error />
			}
		]
	}
])


ReactDOM.createRoot(document.getElementById('root')).render(
    <RouterProvider router={router}/>
)
