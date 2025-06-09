export function Household(props) {
    const { contacts } = props;
    return (
        <form action="/households" method="post">
            <label> Name: <input type="text" name="name" required/></label>
            <label> People: 
                <select multiple>
                    {contacts.map(contact => {
                        return (
                            <option key={contact.id} value={contact.id}>
                                {contact.name}
                            </option>
                        )
                    })}
                </select>
            </label>
            <button>Create Household</button>
        </form>
    )
}