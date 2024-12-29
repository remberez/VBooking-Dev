import useCityList from "../../hooks/useCityList";
import useInfiniteScroll from "../../hooks/useInfiniteScroll";
import useSearchFormParams from "../../hooks/useSearchFormParams";
import { useEffect, useState } from "react";
import SearchHeader from "../search-header/SearchHeader";
import classes from "./ObjectsFilterSearch.module.css";
import ObjectFilter from "../object-filter/ObjectFilter";
import OrderingObjects from "../ordering-objects/OrderingObjects";
import SearchObjectList from "../search-object-list/SearchObjectList";
import Button from "../../UI/main-button/Button";
import ObjectService from "../../api/objectsService";
import TypesOfObjectsCarousel from "../TypesOfObjectsCarousel/TypesOfObjectsCarousel";
import { useLocation, useNavigate } from "react-router-dom";
import ObjectsByTypesCarousel from "../ObjectsByTypesCarousel/ObjectsByTypesCarousel";

function ObjectsFilterSearch() {
    const [cityList, setCityList] = useCityList();
    const [selectedOrdering, setSelectedOrdering] = useState("");
    const location = useLocation();
    const navigate = useNavigate();

    const {
        dateStart,
        dateEnd,
        selectedCity,
        adultsCount,
        kidsCount,
        type,
        setDateStart,
        setDateEnd,
        setSelectedCity,
        setAdultsCount,
        setKidsCount,
        updateQueryParams,
        setType,
    } = useSearchFormParams();
    const { 
        dataList: objectsList, 
        isLoading, 
        totalCount: objectCount, 
        isFetchUp,
        handleScroll,
        shouldReset,
    } = useInfiniteScroll(getObjects);

    async function onSubmit() {
        const initalPage = 1;
        shouldReset(async () => await getObjects(initalPage, 3), initalPage);
        updateQueryParams();
    }

    async function getObjects(page, pageSize) {
        const params = { 
            city: selectedCity, 
            first_day: dateStart, 
            last_day: dateEnd, 
            adults: adultsCount, 
            kids: kidsCount, 
            page: page, 
            page_size: pageSize, 
            ordering: selectedOrdering,
            type: type,
        }
        try {
            const response = await ObjectService.getObjects(params);
            return response;
        } catch (error) {
            console.error(error);
        }
    }

    function onCategoryClick(value) {
        setType(value);
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        const searchParams = new URLSearchParams(location.search);
        searchParams.set("type", value);
        navigate(`${location.pathname}?${searchParams.toString()}`);
    }

    useEffect(() => {
        const initialPage = 1;
        shouldReset(async () => await getObjects(initialPage, 3), initialPage);
    }, [type]); 
    
    useEffect(() => {
        const initialPage = 1;
        shouldReset(async () => await getObjects(initialPage, 3), initialPage);
        updateQueryParams(); 
    }, [selectedOrdering]);
    const stillLeft = objectCount - objectsList.length;

    return (
        <>
            <SearchHeader 
                cityList={cityList}
                onSubmit={onSubmit} 
                dateStart={dateStart}
                dateEnd={dateEnd}
                selectedCity={selectedCity}
                adultsCount={adultsCount}
                kidsCount={kidsCount}
                setDateStart={setDateStart}
                setDateEnd={setDateEnd}
                setSelectedCity={setSelectedCity}
                setAdultsCount={setAdultsCount}
                setKidsCount={setKidsCount}
                updateQueryParams={updateQueryParams}
            />
            <div className={`${classes.listWrapper} container`}>
                <ObjectFilter />
                <div className={classes.objectsWrapper}>
                    <OrderingObjects 
                        totalCount={objectCount} 
                        selectOrdering={selectedOrdering} 
                        handleOrderingChange={setSelectedOrdering}
                    />
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
            <TypesOfObjectsCarousel clickHandle={onCategoryClick} />
            <ObjectsByTypesCarousel city={selectedCity}/>
        </> 
    )
}

export default ObjectsFilterSearch;