import classes from "./TransparentButton.module.css";

function TransparentButton( { className, ...props } ) {
    const buttonClassName = className + " " + classes.button;
    return (
        <button className={buttonClassName} {...props}>x</button>
    )
}

export default TransparentButton;