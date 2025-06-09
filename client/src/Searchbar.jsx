import { useState } from "react";

export function Searchbar(props) {
	const {searchTerm, setSearchTerm} = props;

    return (
        <div className="searchbar">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}