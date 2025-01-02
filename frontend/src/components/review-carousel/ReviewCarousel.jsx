import Carousel from "../../UI/carousel/Carousel";
import Review from "../review-block/Review";
import Title from "../title/Title";
import classes from "./ReviewCarousel.module.css";

function ReviewCarousel() {
    return (
        <div className="container">
            <Carousel title={<Title>Последние отзывыв об отдыхе в Саратове</Title>} slidesToShow={3} className={classes.carousel}>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
                <Review className={classes.review}/>
            </Carousel>
        </div>
    )
}

export default ReviewCarousel;