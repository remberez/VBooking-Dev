import BigObjectCart from "../big-object-cart/BigObjectCart";
import classes from "./SearchObjectList.module.css";
import Loader from "../../UI/loader/Loader";
import Title from "../title/Title";
import Cat from "../../UI/cat-animation/Cat";
import SocialBanner from "../social-banner/SocialBanner";

function SearchObjectList({ objectsList, loading, bottomLoading }) {
    return (
        <section className={classes.objects}>
            { loading && objectsList.length < 1 ? (
                <Loader />
            ) : (
                objectsList && objectsList.length > 0 ? (
                    <>
                        <ul className={classes.objectsList}>
                            {objectsList.map((value, index) => {
                                return (
                                    <>
                                        {
                                            index === 5 && (
                                                <SocialBanner className={classes.banner}/>
                                            )
                                        }
                                        <li key={value.id}>
                                            <BigObjectCart objectData={value} />
                                        </li>
                                    </>
                                )
                                }
                            )}
                        </ul>
                    </>
                ) : (
                    <div className={classes.notFound}>
                        <div className={classes.catWrapper}>
                            <Cat/>
                        </div>
                        <Title className={classes.notFoundTitle}>
                            Кажется, тут ничего нет!
                        </Title>
                        <p className={classes.notFoundDesc}>
                            По вашим параметрам ничего не найдено. Попробуйте изменить запрос или сбросить фильтры.
                        </p>
                    </div>
                )
            )}
            {
                bottomLoading && <Loader/>
            }
        </section>
    );
}

export default SearchObjectList;
