import { Link } from "react-router-dom";
import classes from "./UnderLineLink.module.css";

function UnderLineLink({ children, className, ...props }) {
    return (
        <Link className={`${classes.link} ${className}`} {...props}>{ children }</Link>
    )
}

export default UnderLineLink;