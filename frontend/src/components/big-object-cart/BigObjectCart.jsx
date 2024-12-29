import classes from "./BigObjectCart.module.css";
import Button from "../../UI/main-button/Button";
import Slider from "react-slick"; // Импортируйте Slider из react-slick
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css"; 
import "./dots.css";
import { useState } from "react";


const SampleNextArrow = ({ onClick, visible }) => {
    return (
        <div className={`slick-arrow slick-next ${visible ? 'visible' : ''}`} onClick={onClick}>
            adwawdawda;
        </div>
    );
};

const SamplePrevArrow = ({ onClick, visible }) => {
    return (
        <div className={`slick-arrow slick-prev ${visible ? 'visible' : ''}`} onClick={onClick}>
            &#10094;
        </div>
    );
};

function BigObjectCart({ objectData }) {
    const [arrowsVisible, setArrowsVisible] = useState(false);

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
                    <h3 className={classes.title}>
                        {objectData.type.name} «{objectData.name}»
                    </h3>
                    <p className={classes.address}>
                        Адрес: {objectData.address.city.name}, ул. {objectData.address.street}, д. {objectData.address.house}
                    </p>
                    <p className={classes.seaDistance}>
                        Море - {objectData.address.sea_distance} м
                    </p>
                </div>
                <div className={classes.informationRow}>
                    <div className={classes.tags}>
                        <ul className={classes.tagsList}>
                            {objectData.tags?.slice(0, 6).map(value => (
                                <li key={value.id} className={classes.tag}>
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
                <button type="button" className={`${classes.favoriteButton}`}>
                    <svg 
                        width="30" 
                        height="30" 
                        viewBox="0 0 24 24" 
                        className={classes.heartIcon}
                        xmlns="http://www.w3.org/2000/svg">
                        <path 
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" 
                            fill="none" 
                            stroke="gray" 
                            strokeWidth="1"/>
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
                <Button to={"#"} className={classes.link}>
                    Подробнее
                </Button>
            </div>
        </article>
    )
}

export default BigObjectCart;