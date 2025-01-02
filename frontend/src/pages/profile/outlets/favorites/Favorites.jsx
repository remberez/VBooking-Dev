import { useEffect, useState } from "react";
import classes from "./Favorites.module.css";
import ObjectService from "../../../../api/objectsService";
import BigObjectCart from "../../../../components/big-object-cart/BigObjectCart";

function Favorites() {
    const [favorites, setFavorites] = useState([]);

    useEffect(
        () => {
            async function fetchObjects() {
                const data = await ObjectService.getFavoritesObjects();
                setFavorites(data)
            }
            fetchObjects();
        }, []
    );

    return (
        <section className={classes.favorites}>
            <h2 className={classes.title}>
                Избранное
            </h2>
            {
                favorites.map(
                    value => {
                        value.images.map(image => {
                            if (!image.media.startsWith("http://") && !image.media.startsWith("https://")) {
                                image.media = "http://localhost:8000/" + image.media;
                            }
                        });
                        console.log(value.images)
                        return (
                            <BigObjectCart objectData={value} />
                        )
                    }
                )
            }
        </section>
    )
}

export default Favorites;