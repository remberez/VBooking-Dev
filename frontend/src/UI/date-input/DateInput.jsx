import Calendar from "react-calendar";
import useDropdown from "../../hooks/useDropDown";
import classes from "./DateInput.module.css";

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
                <Calendar 
                    onChange={handleDateChange}
                    value={date}
                    className={classes.calendar}
                />
            )}
        </div>
    );
}

export default DateInput;