import queryString from "query-string";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';

function useSearchFormParams() {
    const location = useLocation();
    const queryParams = queryString.parse(location.search);
    const navigate = useNavigate();

    const [dateStart, setDateStart] = useState(
        queryParams.first_day ? new Date(queryParams.first_day).toLocaleDateString('en-CA') : ""
    );
    const [dateEnd, setDateEnd] = useState(
        queryParams.last_day ? new Date(queryParams.last_day).toLocaleDateString('en-CA') : ""
    );
    const [selectedCity, setSelectedCity] = useState(
        queryParams.city ? queryParams.city : ""
    );
    const [adultsCount, setAdultsCount] = useState(
        !isNaN(Number(queryParams.adults)) ? Number(queryParams.adults) : 0
    );
    const [kidsCount, setKidsCount] = useState(
        !isNaN(Number(queryParams.kids)) ? Number(queryParams.kids) : 0
    );
    const [type, setType] = useState(
        queryParams.type ? queryParams.type : null
    );

    const updateQueryParams = () => {
        const newQueryParams = {
            ...queryParams,
            ...(dateStart && { first_day: new Date(dateStart).toLocaleDateString('en-CA') }),
            ...(dateEnd && { last_day: new Date(dateEnd).toLocaleDateString('en-CA') }),
            ...(selectedCity && { city: selectedCity }),
            ...(adultsCount && { adults: adultsCount }),
            ...(kidsCount && { kids: kidsCount }),
            ...(type && { type: type })
        };

        if (JSON.stringify(newQueryParams) !== JSON.stringify(queryParams)) {
            navigate({
                search: queryString.stringify(newQueryParams),
            });
        }
    };

    const searchFormParams = {
        dateStart,
        dateEnd,
        selectedCity,
        adultsCount,
        kidsCount,
        type,
        setDateStart,
        setDateEnd,
        setSelectedCity,
        setAdultsCount,
        setKidsCount,
        updateQueryParams,
        setType,
    };

    return searchFormParams;
}


export default useSearchFormParams;
