import { Link } from "react-router-dom";
import classes from "./PopularResorts.module.css";
import Title from "../title/Title";

function PopularResorts( { cityList } ) {
    return (
        <section className={classes.popularResorts + " container"}>
            <Title>
                <h2 className={classes.title}>
                    Популярные курорты
                </h2>
            </Title>
            <ul className={classes.cityList}>
            {
                cityList.slice(0, 3).map(value => (
                    <li key={value.id} className={classes.cityItem}>
                        <Link>
                            <div className={classes.imageContainer}>
                                <img 
                                    src={value.image} 
                                    loading="lazy" 
                                    width={382} 
                                    height={223}
                                    className={classes.cityImage}
                                    alt={`Фотография города "${value.name}"`}
                                />
                                <div className={classes.gradientOverlay}></div>
                            </div>
                            <h3 className={classes.cityName}>
                                {value.name}
                            </h3>
                        </Link>
                    </li>
                ))
            }
            </ul>
        </section>
    )
}

export default PopularResorts;