import { useState } from "react";
import classes from "./TopRatedObjects.module.css";
import Title from "../title/Title";
import ObjectsList from "../object-list/ObjectsList";
import TypesCarousel from "../types-carousel/TypesCarousel";
import Button from "../../UI/main-button/Button";
import useObjectTypes from "../../hooks/useObjectTypes";
import useObjectsList from "../../hooks/useObjectsList";


function TopRatedObjects() {
    const [selectedType, setSelectedType] = useState();
    const types = useObjectTypes(typesData => setSelectedType(typesData[0].id));
    const objectsList = useObjectsList(selectedType);

    return (
        <section className={classes.objects + " container"}>
            <Title>
                <h2 className={classes.title}>
                    Объекты с лучшим рейтингом
                </h2>
            </Title>
            <TypesCarousel types={types} selectedType={selectedType} setSelectedType={setSelectedType}/>
            <ObjectsList objectsList={objectsList}/>
            <Button to={"/"} className={classes.moreLink}>Смотреть ещё 44 варианта</Button>
        </section>
    )
}

export default TopRatedObjects;