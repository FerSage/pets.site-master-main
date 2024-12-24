import React, { useState } from 'react';
import AnimalSearchForm from "../components/animalSearchForm";
import LostAnimalscards from "../components/lostAnimalscards";

const AnimalSearch = () => {
    const [searchParams, setSearchParams] = useState({});

    return (
        <div>
            <AnimalSearchForm onSearch={(params) => setSearchParams(params)} />
            {Object.keys(searchParams).length > 0 && (
                <LostAnimalscards searchParams={searchParams} />
            )}
        </div>
    );
};

export default AnimalSearch;
