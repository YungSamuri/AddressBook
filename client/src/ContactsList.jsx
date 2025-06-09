import  { useState, useEffect } from "react"
import { Contact } from "./Contact"
import { Searchbar } from "./Searchbar";

export function ContactsList() {
    const [contacts, setContacts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    async function getContacts() {
        const res = await fetch(`/contacts/${searchTerm}`, {
            credentials: "same-origin",
        });
        const data = await res.json();
        setContacts(data.contacts);
    }

    useEffect(() => {
        getContacts();
    }, [searchTerm]);
    
    return (
        <div className="contact-list">
            <h1>Contacts</h1>
            <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            {contacts.map(contact => (
                <Contact key={contact.id} contact={contact} />
            ))}
        </div>
    );
}