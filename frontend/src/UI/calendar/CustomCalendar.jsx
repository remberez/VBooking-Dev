import Calendar from "react-calendar";
import "./calendar.css";

function CustomCalendar({ className, ...props}) {
    return (
        <Calendar
            {...props}
            className={`${className} calendar`}
        />
    )
}

export default CustomCalendar;