import classes from "./Review.module.css";
import star from "../../images/star.svg";
import { Link } from "react-router-dom";
import { useState } from "react";

function Review({ review, className }) {
    const [isExpanded, setIsExpanded] = useState(false);
    
    const handleToggle = () => {
        setIsExpanded(prevState => !prevState);
    };

    const reviewText = `Отличное жилье, хорошая шумоизоляция, приличный ремонт, везде чисто, есть стиральная машинка и гладильная доска и утюг, все для быта и отдыха супер!. и гладильная доска и утюг, все для быта и отдыха супер!.`;

    const shortenedText = reviewText.substring(0, 100) + '...';

    return (
        <div className={`${classes.reviewBlock} ${className}`}>
            <div className={classes.objectName}>
                <Link to={"#"}>
                    Этаж под ключ (2-х комн. квартира одна на этаже) в Анапе ул. Трудящихся
                </Link>
            </div>
            <div className={classes.profile}>
                <div className={classes.profileImage}>
                    E
                </div>
                <div className={classes.profileInfo}>
                    <div className={classes.profileName}>
                        Евгения &#183; <span className={classes.profileCity}>Армавир</span>
                    </div>
                    <div className={classes.relaxDate}>
                        Период отдыха: Август 2020
                    </div>
                </div>
            </div>
            <div className={classes.reviewContent}>
                <div className={`${classes.textWrapper} ${isExpanded ? classes.expanded : ""}`}>
                    {isExpanded ? reviewText : shortenedText}
                </div>
                <button onClick={handleToggle} className={classes.toggleButton}>
                    {!isExpanded && 'Показать полностью'}
                </button>          
            </div>
            <div className={classes.grade}>
                {Array.from({ length: 5 }, (_, index) => (
                    <img key={index} className={classes.star} src={star}/>
                ))}
            </div>
        </div>
    )
}

export default Review;