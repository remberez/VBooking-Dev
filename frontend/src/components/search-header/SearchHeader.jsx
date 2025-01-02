import SearchForm from "../search-form/SearchForm";
import classes from "./SearchHeader.module.css";
import classNames from "classnames";
import Title from "../title/Title";

function SearchHeader({ 
    cityList, 
    onSubmit,
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
}) {
    return (
        <header className={classNames(classes.header)}>
            <div className={classes.headerBackground}>
                <Title>
                    <h1 className={classes.title}>
                        Поиск по Саратову
                    </h1>
                </Title>
                <SearchForm 
                    cityList={cityList} 
                    onSubmit={onSubmit} 
                    formClassName={classes.form}
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
                />
            </div>  
        </header>
    )
}

export default SearchHeader;