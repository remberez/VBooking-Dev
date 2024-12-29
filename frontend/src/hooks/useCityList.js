import { useState, useEffect } from "react";
import CityService from "../api/ciyService";

function useCityList() {
    const [cityList, setCityList] = useState([]);
    
    useEffect(
        () => {
            async function getCities() {
                const response = await CityService.getCities();
                setCityList(response);
            }
            getCities();
        }, []
    );

    return [cityList, setCityList];
}

export default useCityList;