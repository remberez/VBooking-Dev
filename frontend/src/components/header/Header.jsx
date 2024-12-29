import classes from "./Header.module.css";
import Title from "../title/Title";
import SearchForm from "../search-form/SearchForm";
import useSearchFormParams from "../../hooks/useSearchFormParams";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";


function Header({ cityList }) {
    const {
        dateStart,
        dateEnd,
        selectedCity,
        adultsCount,
        kidsCount,
        setDateStart,
        setDateEnd,
        setSelectedCity,
        setAdultsCount,
        setKidsCount,
        updateQueryParams,
    } = useSearchFormParams();
    const navigate = useNavigate();

    const handleSubmit = () => {
        const params = new URLSearchParams({
            city: selectedCity,
            first_day: dateStart,
            last_day: dateEnd,
            adults: adultsCount,
            kids: kidsCount,
        }).toString();

        navigate(`/search?${params}`);
    };
    return (
        <header className={classes.header}>
            <div className="container">
                <Title>
                    <h2 className={classes.headerTitle}>
                        Ваш идеальный отдых начинается здесь!
                    </h2>
                </Title>
                <SearchForm 
                    cityList={cityList}
                    dateStart={dateStart}
                    dateEnd={dateEnd}
                    selectedCity={selectedCity}
                    adultsCount={adultsCount}
                    kidsCount={kidsCount}
                    setDateStart={setDateStart}
                    setDateEnd={setDateEnd}
                    setSelectedCity={setSelectedCity}
                    setAdultsCount={setAdultsCount}
                    setKidsCount={setKidsCount}
                    updateQueryParams={updateQueryParams}
                    onSubmit={handleSubmit}
                />
            </div>
        </header>
    )
}

export default Header;