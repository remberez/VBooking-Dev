import classes from "./ObjectCart.module.css";
import { Link } from "react-router-dom";

function ObjectCart( { obj } ) {
    return (
       <div className={classes.objectContainer}>
            <div className={classes.imageWrapper}>
                <img src={obj.images.length > 0 ? obj.images[0].media : null} className={classes.objectImage}/>
                <div className={classes.rating}>
                    5.0
                </div>
            </div>
            <div className={classes.objectName}>
                <Link>
                    {obj.name}
                </Link>
            </div>
            <div className={classes.objectGeolocation}>
                Саратов, {obj.address.sea_distance} до моря
            </div>
            <div className={classes.objectPrice}>
                {obj.min_price ? (
                    <>
                        {`От ${obj.min_price}₽ `}
                        <span>в сутки</span>
                    </>
                ) : (
                    "Цена не указана"
                )}
            </div>
       </div>
    )
}

export default ObjectCart;