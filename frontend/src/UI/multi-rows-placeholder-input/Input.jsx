import { useEffect, useState } from "react";
import classes from "./input.module.css";

function Input({ children, className, value, setValue, error, ...props }) {
    const [placeholderIsVisible, setPlaceholderIsVisible] = useState(true);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        setPlaceholderIsVisible(!(newValue.length > 0));
    };

    useEffect(() => {
        setPlaceholderIsVisible(!value)
    }, [value])

    return (
        <div className={classes.inputWrapper}>
            <input 
                className={`${classes.input} ${className}`} 
                value={value}
                onFocus={() => setPlaceholderIsVisible(false)}
                onBlur={() => setPlaceholderIsVisible(value.length === 0)}
                onChange={handleChange}
                {...props}
            />
            <div className={`${classes.placeholder} ${!placeholderIsVisible ? classes.unvisible : ""}`}>
                {children}
            </div>
            {error && <div className={classes.error}>{error}</div>}
        </div>
    );
}

export default Input;