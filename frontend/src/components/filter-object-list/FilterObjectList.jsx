import classNames from "classnames";
import SearchObjectList from "../search-object-list/SearchObjectList";
import classes from "./FilterObjectList.module.css";
import ObjectService from "../../api/objectsService";
import ObjectFilter from "../object-filter/ObjectFilter";
import OrderingObjects from "../ordering-objects/OrderingObjects";
import { useEffect, useState } from "react";
import Button from "../../UI/main-button/Button";

function FilterObjectList( { 
    objectsList, 
    isLoading, 
    objectCount, 
    isFetchUp, 
    handleScroll,
    selectedOrdering,
    setSelectedOrdering,
} ) {
    const stillLeft = objectCount - objectsList.length;

    return (
        <div className={classNames(classes.listWrapper, "container")}>
            <ObjectFilter />
            <div className={classes.objectsWrapper}>
                <OrderingObjects totalCount={objectCount} selectOrdering={selectedOrdering} handleOrderingChange={setSelectedOrdering}/>
                <SearchObjectList 
                    objectsList={objectsList} 
                    loading={isLoading}
                    bottomLoading={isFetchUp}
                />
                {
                    stillLeft > 0 &&
                    <Button onClick={handleScroll} className={classes.moreButton}>
                        Показать ещё {stillLeft} объектов
                    </Button>
                }
            </div>
        </div>
    )
}

export default FilterObjectList;