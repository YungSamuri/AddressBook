import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import * as cookie from "cookie";

export function ContactForm(props) {
    const params = useParams();
    const { edit } = props;

    const [households, setHouseholds] = useState([]);
    const [newHousehold, setNewHousehold] = useState(false)

    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [household, setHousehold] = useState("None")
    const [address1, setAddress1] = useState("")
    const [address2, setAddress2] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [zip, setZip] = useState("")
    const [country, setCountry] = useState("")
    const [email, setEmail] = useState("")
    const [cellPhone, setCellPhone] = useState("")
    const [workPhone, setWorkPhone] = useState("")
    const [notes, setNotes] = useState("")

    const [householdName, setHouseholdName] = useState("")

    const [errors, setErrors] = useState([])

    const navigate = useNavigate();


    function popUpCreateHousehold(e) {
        e.preventDefault();
        if (e.target.value === "New") {
            setNewHousehold(true);
        }
        else {
            setNewHousehold(false);
            setHousehold(e.target.value);
        }
    }

    async function createContact() {
        const res = await fetch("/new-contact/", {
            method: "POST",
            body: JSON.stringify({
                firstName,
                lastName,
                household,
                address1,
                address2,
                city,
                state,
                zip,
                country,
                email,
                cellPhone,
                workPhone,
                notes,
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            },
        });
        const body = await res.json();
        if (body.errors) {
            setErrors(body.errors);
            return;
        }
        navigate("/")
    }

    async function createHousehold(e) {
        e.preventDefault();
        const res = await fetch("/new-household/", {
            method: "post",
            body: JSON.stringify({
                householdName,
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            },
        });
        const body = await res.json();
        getHouseholds();
        setHousehold(body.household.name);
        setNewHousehold(false);
    }

    async function getHouseholds() {
        const res = await fetch("/households/", {
            credentials: "same-origin",
        });
        const body = await res.json();
        setHouseholds(body.households);
    }

    async function submitForm(e) {
        e.preventDefault();
        if (edit) {
            editContact();
        }
        else {
            createContact();
        }
    }
    
    async function getContact() {
        const res = await fetch(`/contact/${params.id}`, {
            credentials: "same-origin",
        });
        const data = await res.json();
        const contact = data.contact;
        setFirstName(contact.firstName);
        setLastName(contact.lastName);
        setHousehold(data.household.name);
        setAddress1(contact.addressLine1);
        setAddress2(contact.addressLine2);
        setCity(contact.city);
        setState(contact.state);
        setZip(contact.zip);
        setCountry(contact.country);
        setEmail(contact.email);
        setCellPhone(contact.cellPhone);
        setWorkPhone(contact.workPhone);
        setNotes(contact.notes);
    }

    async function editContact() {
        const res = await fetch(`/contact/${params.id}/edit`, {
            method: "PUT",
            body: JSON.stringify({
                firstName,
                lastName,
                household,
                address1,
                address2,
                city,
                state,
                zip,
                country,
                email,
                cellPhone,
                workPhone,
                notes,
            }),
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": cookie.parse(document.cookie).csrftoken,
            },
        });
        const body = await res.json();
        if (body.errors) {
            setErrors(body.errors);
            return;
        }
        navigate(`/contact/${params.id}`);
    }

    useEffect(() => {
        getHouseholds();
        if (edit) {
            getContact();
            // setHouseholdName("");
            setNewHousehold(false);
            setErrors([]);
        }
        else {
            setFirstName("");
            setLastName("");
            setHousehold("None");
            setAddress1("");    
            setAddress2("");
            setCity("");
            setState("");
            setZip("");
            setCountry("");
            setEmail("");
            setCellPhone("");
            setWorkPhone("");
            setNotes("");
            // setHouseholdName("");
            setNewHousehold(false);
            setErrors([]);
        }
    }, [edit]);




    return (
        <div className="contacts-form">
            <form onSubmit={submitForm}>
                <h1>{edit ? `${firstName} ${lastName}` : "New Contact"}</h1>
                <span>
                    <label> First Name: <input type="text" name="first-name" value={firstName} onChange={e => setFirstName(e.target.value)} required/> </label>
                    <label> Last Name: <input type="text" name="last-name" value={lastName} onChange={e => setLastName(e.target.value)} /></label>
                </span>
                <label> Household: 
                    <select name="household" onChange={popUpCreateHousehold} value={household}>
                        <option className="new-household-option" value="New">New</option>
                        <option value="None" disabled>None</option>
                        {households.map(household => {
                            return (
                                <option key={household.id} value={household.name}>
                                    {household.name}
                                </option>
                            )
                        })}
                    </select>
                </label>
                <label> Address Line 1: <input type="text" name="address-1" value={address1} onChange={e => setAddress1(e.target.value)} /> </label>
                <label> Address Line 2: <input type="text" name="address-2"  value={address2} onChange={e => setAddress2(e.target.value)}/> </label>
                <label> City/State/Zip: 
                    <input type="text" name="city" value={city} onChange={e => setCity(e.target.value)}/> 
                    <input type="text" name="state" value={state} onChange={e => setState(e.target.value)}/> 
                    <input type="text" name="zip" value={zip} onChange={e => setZip(e.target.value)}/> 
                </label>
                <label> Country: <input type="text" name="country" value={country} onChange={e => setCountry(e.target.value)}/> </label>
                <label> Email: <input type="email" name="email" value={email} onChange={e => setEmail(e.target.value)}/></label>
                <label> Cell Phone: <input type="tel" name="cell-phone" value={cellPhone} onChange={e => setCellPhone(e.target.value)}/></label>
                <label> Work Phone: <input type="tel" name="work-phone" value={workPhone} onChange={e => setWorkPhone(e.target.value)}/></label>
                <label> Notes: <textarea name="notes" value={notes} onChange={e => setNotes(e.target.value)}></textarea></label>
                <button>{edit ? "Save" : "Create"} Contact</button>
            </form>

            {errors.map(error => {
                return (
                    <div key={error} className="error">
                        <span>{error}</span>
                    </div>
                )
            })}

            {newHousehold && (
                <div className="new-household-form">
                    <h2>Create New Household</h2>
                    <form onSubmit={createHousehold}>
                        <label> Household Name: <input type="text" name="name" value={householdName} onChange={e => setHouseholdName(e.target.value)} required/> </label>
                        <span>
                        <button onClick={createHousehold}>Create Household</button>
                        <button onClick={() => setNewHousehold(false)}>Cancel</button>
                        </span>
                    </form>
                </div>
            )}
        </div>
    );
}