import classes from "./Button.module.css";
import { Link } from "react-router-dom";

const Button = ({ to, onClick, children, className, color, ...props }) => {
    const isLink = !!to;
    let buttonClassName = classes.button + " " + ( className || "" );
    
    if (color === "white") {
        buttonClassName += " " + classes.white
    } else {
        buttonClassName += " " + classes.blue
    }

    return isLink ? (
        <Link to={to} className={buttonClassName} {...props}>
            {children}
        </Link>
    ) : (
        <button onClick={onClick} className={buttonClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;