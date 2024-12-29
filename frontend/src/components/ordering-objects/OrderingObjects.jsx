import classes from "./OrderingObjects.module.css";

function OrderingObjects({ totalCount, selectOrdering, handleOrderingChange }) {
    return (
        <div className={classes.header}>
            <p className={classes.totalCount}>Найдено {totalCount} вариантов жилья.</p>
            <ul className={classes.orderingList}>
                <li className={classes.orderingItem}>
                    <button 
                        className={`${classes.orderingButton} ${selectOrdering === "popularity" ? classes.active : ""}`} 
                        onClick={() => handleOrderingChange('popularity')}
                    >
                        По популярности
                    </button>
                </li>   
                <li className={classes.orderingItem}>
                    <button 
                        className={`${classes.orderingButton} ${selectOrdering === "rating" ? classes.active : ""}`} 
                        onClick={() => handleOrderingChange("rating")}
                    >
                        По рейтингу
                    </button>
                </li>
                <li className={classes.orderingItem}>
                    <button 
                        className={`${classes.orderingButton} ${selectOrdering === "min_price" ? classes.active : ""}`} 
                        onClick={() => handleOrderingChange("min_price")}
                    >
                        По цене
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default OrderingObjects;