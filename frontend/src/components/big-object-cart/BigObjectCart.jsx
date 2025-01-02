import classes from "./BigObjectCart.module.css";
import Button from "../../UI/main-button/Button";
import Slider from "react-slick"; // Импортируйте Slider из react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import "./dots.css";
import { useState } from "react";
import ObjectService from "../../api/objectsService";
import { IoLocationOutline } from "react-icons/io5";
import { FaWater } from "react-icons/fa";


const SampleNextArrow = ({ onClick, visible }) => {
    return (
        <div className={`slick-arrow slick-next ${visible ? 'visible' : ''}`} onClick={onClick}>
            Вперед
        </div>
    );
};

const SamplePrevArrow = ({ onClick, visible }) => {
    return (
        <div className={`slick-arrow slick-prev ${visible ? 'visible' : ''}`} onClick={onClick}>
            Назад
        </div>
    );
};

function BigObjectCart({ objectData, dateStart, dateEnd }) {
    const [arrowsVisible, setArrowsVisible] = useState(false);
    const [inFavorites, setInFavorites] = useState(objectData.in_favorites);

    async function favoriteHandle() {
        if (!inFavorites) {
            const response = await ObjectService.addToFavorites(
                Number(objectData.id),
                dateStart || null,
                dateEnd || null,
            )
            setInFavorites(true);
        } else {
            const response = await ObjectService.removeFromFavorites(objectData.id);
            setInFavorites(false)
        }
    }

    const settings = {
        lazyLoading: true,
        dots: true,
        infinite: objectData.images.length > 1,
        speed: 300,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <SampleNextArrow visible={arrowsVisible} />,
        prevArrow: <SamplePrevArrow visible={arrowsVisible} />,
        appendDots: dots => (
            <div style={{
                position: 'absolute',
                bottom: '10px',
                left: '50%',
                transform: 'translateX(-50%)',
                display: 'flex',
                justifyContent: 'center',
                width: '100%'
            }}>
                <ul style={{ margin: '0px', padding: '0px', display: 'flex', listStyle: 'none' }}>
                    {dots}
                </ul>
            </div>
        ),
    };
    return (
        <article className={classes.object}>
            <div className={classes.sliderWrapper} onMouseEnter={() => setArrowsVisible(true)} onMouseLeave={() => setArrowsVisible(false)}>
                <Slider 
                    {...settings} 
                    className={classes.slider} 
                >
                    {objectData?.images.slice(0, 5).map((image, index) => (
                        <div key={objectData.id}>
                            <img src={image.media} alt="" width={270} height={240} className={`${classes.image}`} />
                        </div>
                    ))}
                </Slider>
            </div>
            <div className={classes.information}>
                <div className={classes.informationRow}>
                    <div className={classes.address}>
                        <IoLocationOutline size={18}/>
                        <p>
                            {objectData.address.city.name}, ул. {objectData.address.street}, д. {objectData.address.house}
                        </p>
                    </div>
                    <h3 className={classes.title}>
                        {objectData.type.name} «{objectData.name}»
                    </h3>
                    <div className={classes.seaDistance}>
                        <FaWater color="#989898" />
                        <p>
                            Море - {objectData.address.sea_distance} м
                        </p>
                    </div>
                </div>
                <div className={classes.informationRow}>
                    <div className={classes.tags}>
                        <ul className={classes.tagsList}>
                            {objectData.tags?.slice(0, 6).map((value, index) => (
                                <li key={value.id + index} className={classes.tag}>
                                    <img 
                                        src={value.svg} 
                                        alt={value.name} 
                                        width={12} 
                                        height={12} 
                                        className={classes.tagImage}
                                    />
                                    <span className={classes.tagName}>
                                        {value.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={classes.ratingWrapper}>
                        <div className={classes.rating}>
                            5.0
                        </div>
                        <div className={classes.reviews}>
                            33 отзыва
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.favorites}>
                <button type="button" className={`${classes.favoriteButton}`} onClick={() => favoriteHandle()}>
                    <svg 
                        width="30" 
                        height="30" 
                        viewBox="0 0 24 24" 
                        className={classes.heartIcon}
                        xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                            fill={inFavorites ? "red" : "none"} 
                            stroke={ inFavorites ? "red" : "gray" } 
                            strokeWidth="1"
                        />
                    </svg>
                </button>
            </div>
            <div className={classes.priceSide}>
                <div className={classes.priceWrapper}>
                    <div className={classes.price}>
                        {
                            objectData.min_price ? `От ${objectData.min_price} руб.` : "Цена не указана"
                        }
                    </div>
                    <div className={classes.priceDesc}>
                        { objectData.min_price && "Цена за сутки" }
                    </div>
                </div>
                <Button to={`/object/${objectData.id}`} className={classes.link}>
                    Подробнее
                </Button>
            </div>
        </article>
    )
}

export default BigObjectCart;