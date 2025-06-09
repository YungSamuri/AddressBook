import { Link } from "react-router-dom"

export function Contact(props) {
    const {contact} = props
    return (
        <Link to={`/contact/${contact.id}`} className="contact">
            <span className="contact-name">
                <span className="bold">Name: </span>{contact.firstName} {contact.lastName}
            </span>
            <span className="cell-phone">
                <span className="bold">Phone: </span>{contact.cellPhone}
            </span>
            <span className="email">
                <span className="bold">Email: </span>{contact.email}
            </span>
            <span className="address">
                <span className="bold">Address: </span>{contact.addressLine1} {contact.addressLine2} {contact.city}, {contact.state} {contact.zip}
            </span>
        </Link>
    )
}