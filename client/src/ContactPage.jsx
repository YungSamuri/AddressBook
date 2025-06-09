import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { Contact } from "./Contact";

export function ContactPage() {
    const params = useParams();
    const navigate = useNavigate();
    const [contact, setContact] = useState({})
    const [household, setHousehold] = useState({})
    const [householdMembers, setHouseholdMembers] = useState([])

    useEffect(() => {
        async function getContact() {
            const res = await fetch(`/contact/${params.id}`, {
                credentials: "same-origin",
            })
            const data = await res.json()
            setContact(data.contact)
            setHousehold(data.household)
            setHouseholdMembers(data.householdMembers)
        }

        getContact();
    }, [params.id]);

    async function deleteContact() {
        const res = await fetch(`/contact/${contact.id}/delete`, {
            credentials: "same-origin",
        });
        const data = await res.json();
        if ("error" in data) {
            navigate('/error');
        }
        else {
            navigate('/');
        }

    }

    return (
        <div className="contact-page">
            <h1>{contact.firstName} {contact.lastName}</h1>
            <div className="contact-info">
                <span><strong>Address:</strong> {contact.addressLine1} {contact.addressLine2} {contact.city}, {contact.state} {contact.zip}</span>
                {contact.country != "United States" && <span><strong>Country:</strong> {contact.country}</span>}
                <span><strong>Email:</strong> {contact.email}</span>
                <span><strong>Cell Phone:</strong> {contact.cellPhone}</span>
                {contact.workPhone == contact.cellPhone && <span><strong>Work Phone:</strong> {contact.workPhone}</span>}
                <span><strong>Notes:</strong> {contact.notes}</span>
            </div>
            <span>
                <button onClick={() => navigate(`/contact/${contact.id}/edit`)}>Edit</button>
                <button onClick={deleteContact}>Delete</button>
            </span>
            {household !== null && householdMembers.length > 0 && (<><h2>{household.name} Household</h2>
            <div className="household-members">
                {householdMembers.map(member => {
                    return (
                        <div key={member.id} className="household-member">
                            <Contact contact={member} />
                        </div>
                    )
                })}
            </div></>)}
        </div>
    )
}