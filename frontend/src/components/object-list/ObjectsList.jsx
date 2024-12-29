import classes from "./ObjectsList.module.css";
import ObjectCart from "../object-cart/ObjectCart";

function ObjectsList({ objectsList }) {
    return (
        <>
        {
            objectsList.length > 0 ?
            <ul className={classes.objectsList}>
                {
                    objectsList.map(obj => (
                        <li key={obj.id} className={classes.objectsItem}>
                            <ObjectCart obj={obj}/>
                        </li>
                    ))
                }
            </ul>
            : "Загрузка"
        }
        </>
    )
}

export default ObjectsList;