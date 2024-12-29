import classes from "./Title.module.css";

function Title({children, className, ...props}) {
    return (
        <div className={classes.title + " " + className} {...props}>
            { children }
        </div>
    )
}

export default Title;