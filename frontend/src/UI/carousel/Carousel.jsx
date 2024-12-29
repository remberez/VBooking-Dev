import React from 'react';
import Slider from 'react-slick';
import classes from './Carousel.module.css';
import "./carousel.css";

const PrevArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${classes.prevArrow}`} onClick={onClick}>
      &#9664; {/* Символ стрелки влево */}
    </div>
  );
};

const NextArrow = (props) => {
  const { className, onClick } = props;
  return (
    <div className={`${className} ${classes.nextArrow}`} onClick={onClick}>
      &#9654; {/* Символ стрелки вправо */}
    </div>
  );
};

function Carousel({ children, title, className, slidesToShow }) {
  var settings = {
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 4,
    initialSlide: 0,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    centerMode: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          centerMode: false,
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          centerMode: false,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          centerMode: false,
        }
      }
    ]
  };

  return (
    <div className={`${className} bigSlider`}>
        <div className={classes.title}>
            { title }
        </div>
        <Slider {...settings}>
            {children}
        </Slider>
    </div>
  );
}

export default Carousel;