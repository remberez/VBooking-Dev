import Calendar from "react-calendar";
import useDropdown from "../../hooks/useDropDown";
import classes from "./DateInput.module.css";
import "./calendar.css";
import CustomCalendar from "../calendar/CustomCalendar";

function DateInput( { date, onDateSelect, inputName, children, className, containerClassName } ) {
    const { isActive, toggleDropdown, dropdownRef } = useDropdown();

    function handleDateChange(selectedDate) {
        onDateSelect(selectedDate.toLocaleDateString('en-CA'));
        toggleDropdown();
    }

    return (
        <div className={classes.calendarWrapper + " " + containerClassName} ref={dropdownRef}>
            <input 
                className="visually-hidden" 
                type="date" 
                value={date ? date : ''} 
                readOnly 
                name={ inputName } 
            />
            <button className={classes.calendarButton + " " + className} onClick={toggleDropdown} type="button">
                { children }
            </button>
            {isActive && (
                <CustomCalendar 
                    onChange={handleDateChange}
                    value={date}
                    className={`${classes.calendar} calendar`}
                />
            )}
        </div>
    );
}

export default DateInput;