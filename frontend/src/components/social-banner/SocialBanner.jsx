import classes from "./SocialBanner.module.css";
import Title from "../title/Title";
import Button from "../../UI/main-button/Button";
import telegramIcon from "../../images/social/tg.png";
import ytIcon from "../../images/social/yt.png";
import dzenIcon from "../../images/social/dzen.png";

function SocialBanner( className ) {
    return (
        <section className={`${classes.banner} ${className}`}>
            <div className={classes.content}>
                <h2 className="visually-hidden">
                    Наши социальные сети
                </h2>
                <Title className={classes.title}>
                    VisualBooking
                </Title>
                <p className={classes.subtitle}> 
                    Время Быть Счастливым
                </p>
                <Button className={classes.button}>
                    Подпишитесь сейчас
                </Button>
                <div className={classes.socialIcons}>
                    <a>
                        <img
                            src={telegramIcon}
                            width={35}
                            height={35}
                        />
                    </a>
                    <a>
                        <img
                            src={ytIcon}
                            width={35}
                            height={35}
                        />
                    </a>
                    <a>
                        <img
                            src={dzenIcon}
                            width={35}
                            height={35}
                        />
                    </a>
                </div>
            </div> 
        </section>
    )
}

export default SocialBanner;