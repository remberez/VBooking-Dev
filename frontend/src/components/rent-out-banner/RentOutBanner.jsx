import Button from "../../UI/main-button/Button";
import Title from "../title/Title";
import classes from "./RentOutBanner.module.css";
import classNames from 'classnames';

function RentOutBanner() {
    return (
        <section className={classNames(classes.rentOutBannerWraper, "container")}>
            <div className={classes.rentOutBanner}>
                <h2>
                    <Title className={classes.title}>
                        Сдавайте жилье на VisualBooking    
                    </Title> 
                </h2>
                <p className={classes.subtitle}>
                    Получайте доход, ставай жилье
                </p>
                <Button to={"#"} className={classes.link}>
                    Подробнее
                </Button>
            </div>
        </section>
    )
}

export default RentOutBanner;