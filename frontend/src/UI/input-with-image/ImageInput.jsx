import classes from "./ImageInput.module.css";

function ImageInput({ type, className, name, id, image, ...props }) {
    let inputClassName = classes.input + " " + (className || "");

    if (image === "lock") {
        inputClassName += " "  + classes.lockImage;
    } else if (image === "user") {
        inputClassName += " "  + classes.userImage;
    } else {
        return null
    }

    return (
        <div className={classes.inputWrapper}>
            <input type={ type } className={inputClassName} name={name} id={id} {...props} />
        </div>
    )
}

export default ImageInput;