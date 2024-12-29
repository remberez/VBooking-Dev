import classes from "./Footer.module.css";
import logo from "../../images/logo.png";
import dzen from "../../images/dzen.svg";
import tg from "../../images/tg.svg";
import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className={ classes.footer }>
            <div className={ `container ` + classes.footerWrapper }>
                <div className={`${classes.footerItem} ${classes.footerSocial}`}>
                    <div className={classes.footerMain}>
                        <div className={classes.footerMainText}>
                            <img src={logo} width={45} height={45} loading="lazy" className={classes.footerLogo}/>
                            <p className={classes.footerMainTitle}>VisualBooking</p>
                        </div>
                        <p className={classes.footerMainSubtitle}>Будь с нами в соц. сетях</p>
                    </div>
                    <div className={classes.footerSocialImages}>
                        <img src={dzen} width={47} height={47}/>
                        <img src={tg} width={47} height={47}/>
                    </div>
                </div>
                <div className={`${classes.footerItem}`}>
                    <ul className={`${classes.LinksList}`}>
                        <li><Link className={classes.footerLink}>О компании</Link></li>
                        <li><Link className={classes.footerLink}>Блог</Link></li>
                        <li><Link className={classes.footerLink}>Отзывы</Link></li>
                        <li><Link className={classes.footerLink}>Контакты</Link></li>
                    </ul>
                </div>
                <div className={`${classes.footerItem} ${classes.footerInfo}`}>
                    <p>© 2017 - 2024 VisualBooking</p>
                    <p>Российский сервис бронирования жилья, официальный сайт.</p>
                </div>
                <div className={`${classes.footerItem} ${classes.footerAgreements}`}>
                    <ul className={classes.footerAgreementsList}>
                        <li><Link>Пользовательское соглашение</Link></li>
                        <li><Link>Обработка персональных данных</Link></li>
                        <li><Link>Условие бронирование объектов</Link></li>
                    </ul>
                </div>
            </div>
        </footer>
    )
}

export default Footer;