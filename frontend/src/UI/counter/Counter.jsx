import CalcButton from "../calc-button/CalcButton";
import classes from "./Counter.module.css";

function Counter( { placeholder, count, setCount } ) {

    return (
        <div className={classes.counterWrapper}>
            <CalcButton className={classes.button} onClick={ () => setCount(count - 1) } type="button" >
                -
            </CalcButton>
            <div className={classes.placeholder}>
                { count } { placeholder }
            </div>
            <CalcButton className={classes.button} onClick={ () => setCount(count + 1) } type="button" >
                +
            </CalcButton>
        </div>
    )
}

export default Counter;