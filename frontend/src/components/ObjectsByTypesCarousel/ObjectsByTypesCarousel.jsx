import { useCallback, useEffect, useState } from "react";
import useObjectTypes from "../../hooks/useObjectTypes";
import TypesCarousel from "../types-carousel/TypesCarousel";
import classes from "./Style.module.css";
import Carousel from "../../UI/carousel/Carousel";
import Title from "../title/Title";
import ObjectService from "../../api/objectsService";
import ObjectCart from "../object-cart/ObjectCart";

function CarouselTitlte({ types, selectedType, setSelectedType }) {

    return (
        <>
            <Title>Объекты Саратова по категориям</Title>
            <TypesCarousel 
                types={types} 
                selectedType={selectedType} 
                setSelectedType={setSelectedType} 
                className={classes.typesList}
            />
        </>
    )
}

function ObjectsByTypesCarousel({ city }) {
    const types = useObjectTypes();
    const [selectedType, setSelectedType] = useState(null);
    const [objectsList, setObjectsList] = useState([]);

    useEffect(() => {
        if (types && types.length > 0 && selectedType === null) {
            setSelectedType(types[0].id);
        }
    }, [types]);

    useEffect(() => {
        async function fetchObjects() {
            const data = await ObjectService.getObjects({ page: 1, page_size: 20, type: selectedType, city });
            setObjectsList(data.results);
        }
        fetchObjects();
    }, [selectedType, city]);

    return (
        
        <Carousel 
            title={
                <CarouselTitlte 
                    types={types} 
                    selectedType={selectedType} 
                    setSelectedType={setSelectedType}
                />
            } 
            slidesToShow={4} 
            className={classes.carousel}
        >
            {
                objectsList.map(
                    value => (
                        <ObjectCart obj={value} key={value}/>
                    )
                )
            }
        </Carousel>
    )
}

export default ObjectsByTypesCarousel;