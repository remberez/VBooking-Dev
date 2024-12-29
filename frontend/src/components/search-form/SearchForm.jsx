import classes from "./SearchForm.module.css";
import PeopleInput from "../../UI/people-input/PeopleInput";
import DateInput from "../../UI/date-input/DateInput";
import DropDownList from "../../UI/dropdown-list/DropDownList";
import classNames from 'classnames';
import { useState } from "react";
import Button from "../../UI/main-button/Button";

function convertDateFormat(dateString) {
    if (!dateString) return
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) {
        throw new Error("Неверный формат даты. Ожидается YYYY-MM-DD.");
    }

    const [year, month, day] = dateString.split('-');
    return `${day}.${month}.${year}`;
}

function SearchForm({ 
    cityList, 
    onSubmit, 
    formClassName, 
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
    const combinedFormClassName = classNames(classes.form, formClassName);
    const [errorMessage, setErrorMessage] = useState("");

    function handleSubmit(e) {
        if (onSubmit) {
            e.preventDefault();
            if (!selectedCity) {
                setErrorMessage("Пожалуйста, укажите название города");
                setTimeout(() => {
                    setErrorMessage("");
                }, 3000)
                return;
            }
            onSubmit();
        }
    }

    function clearError() {
        setErrorMessage("");
    }

    return (
        <form className={combinedFormClassName} onSubmit={handleSubmit} action="search" method="get">
            <DropDownList 
                inputName={"city"} 
                options={cityList.map(value => value.name)}
                selectedValue={selectedCity}
                setSelectedValue={setSelectedCity}
                containerClassName={classes.formContainerItem}
                placeHolderClassName={classes.formItem}
                onClick={clearError}
            >
                <div className={classes.formSubtitle}>Курорт</div>
                <div className={classes.formTitle}>
                    {selectedCity || 'Город не выбран'}
                </div>
                {
                    (
                        <div className={`${classes.errorWindow} ${errorMessage ? classes.show : ''}`}>
                            <div className={classes.helpArrow}></div>
                            <div>
                                {errorMessage}
                            </div>
                        </div>
                    )
                }
            </DropDownList>
            <DateInput 
                onDateSelect={setDateStart} 
                date={dateStart} 
                inputName={"first_day"} 
                containerClassName={classes.formContainerItem}
                className={classes.formItem}
            >
                <div className={classes.formSubtitle}>Заезд</div>
                <div className={classes.formTitle}>
                    {convertDateFormat(dateStart) || "Дата не выбрана"}
                </div>
            </DateInput>
            <DateInput 
                onDateSelect={setDateEnd} 
                date={dateEnd} 
                inputName={"last_day"} 
                className={classes.formItem}
                containerClassName={classes.formContainerItem}
            >
                <div className={classes.formSubtitle}>Выезд</div>
                <div className={classes.formTitle}>
                    {convertDateFormat(dateEnd) || "Дата не выбрана"}
                </div>
            </DateInput>
            <PeopleInput
                adultsCount={adultsCount}
                kidsCount={kidsCount}
                setAdultsCount={setAdultsCount}
                setKidsCount={setKidsCount}
                containerClassName={classes.formContainerItem}
                className={classes.formItem}
            >
                <div className={classes.formSubtitle}>Количество человек</div>
                <div className={classes.formTitle}>
                    { adultsCount + kidsCount || "Сколько человек?" }
                </div>
            </PeopleInput>
            <Button type="submit" className={classes.searchButton}>Найти</Button>
        </form>
    )
}

export default SearchForm;