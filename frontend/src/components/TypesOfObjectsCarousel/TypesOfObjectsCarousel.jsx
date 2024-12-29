import Carousel from "../../UI/carousel/Carousel";
import Title from "../title/Title";
import classes from "./TypesOfObjectsCarousel.module.css";
import useObjectTypes from "../../hooks/useObjectTypes";

function TypesOfObjectsCarousel({ clickHandle }) {
    const typesList = useObjectTypes();

    return (
        <Carousel title={<Title className={classes.title}>Снять жилье в Саратове</Title>} slidesToShow={4} className={classes.carousel}>
            {
                typesList.map(value => (
                    <div className={classes.carouselItem} key={value.id}>
                        <button onClick={() => clickHandle(value.id)} className={classes.button}>
                            <div className={classes.image}>
                            
                            </div>
                            <h3 className={classes.itemTitle}>
                                { value.name }
                            </h3>
                        </button>
                        <p className={classes.subtitle}>
                            228 предложений
                        </p>
                    </div>
                ))
            }
        </Carousel>
    )
}

export default TypesOfObjectsCarousel;