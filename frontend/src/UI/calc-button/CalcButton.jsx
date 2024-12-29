import classes from "./CalcButton.module.css";

function CalcButton( { children, className, ...props } ) {
    return (
        <button className={classes.button + " " + className} {...props}>
            { children }
        </button>
    )
}

export default CalcButton;