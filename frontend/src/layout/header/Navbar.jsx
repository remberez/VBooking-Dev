import { Link } from 'react-router-dom';
import logo from "../../images/logo.png";
import Button from "../../UI/main-button/Button";
import classes from "./Navbar.module.css";
import { useContext, useEffect, useState } from 'react';
import RegisterModalWindow from '../../components/register-modal/RegisterModalWindow';
import { Context } from '../../App';
import { observer } from 'mobx-react-lite';
import DropDownList from '../../UI/drop-down-list-base/DropDownList';
import downAroow from "../../images/shortDownArrow.png"
import UnderLineLink from '../../UI/underline-link/UnderLineLink';
import exitIcon from "../../images/exit.svg";
import profileIcon from "../../images/profile.svg";

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const { store, logoComponent } = useContext(Context);
    const [isOpenProfileMenu, setIsOpenProfileMenu] = useState(false);
    const [isSticky, setIsSticky] = useState(false);
    

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        if (localStorage.getItem('access')) {
            store.checkAuth();
        }
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            const sticky = window.scrollY > 200;
            setIsSticky(sticky);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    function menuLogoutHandler() {
        store.logout();
        setIsMenuOpen(false);
    }

    return (
        <>
            <nav className={`${classes.navbar} ${isSticky ? classes.sticky : ''}`}>
                <div className={"container " + classes.navbar_wrapper}>
                    <div className={classes.logo_wrapper}>
                        <Link className={classes.logo_wrapper} to={'/'}>
                            <img src={logo} alt="Логотип" width={67} height={58} className={classes.logo_image}/>
                            <div className={classes.logo_name}>VisualBooking</div>
                        </Link>
                        {
                            isSticky && logoComponent
                        }
                    </div>
                    <div className={classes.burger} onClick={toggleMenu}>
                        <div className={classes.burgerLine}></div>
                        <div className={classes.burgerLine}></div>
                        <div className={classes.burgerLine}></div>
                    </div>
                    <ul className={`${classes.navbar_list} ${isMenuOpen ? classes.active : ''}`}>
                        <li><UnderLineLink to="/rent">Сдать жильё</UnderLineLink></li>
                        <li><UnderLineLink to="/lc/favorites">Избранное</UnderLineLink></li>
                        <li className={classes.userProfile}>
                            {
                                store.isAuth ?
                                <>
                                    <button onClick={() => setIsOpenProfileMenu(!isOpenProfileMenu)} className={classes.userProfileButton}>
                                        <div className={classes.userName}>
                                            {store.user.name}
                                        </div>
                                        <img src={downAroow} width={10} height={10}/>
                                    </button> 
                                    <DropDownList menuClassName={classes.dropdownList} isActive={isOpenProfileMenu}>
                                        <Link className={classes.dropDownItem} to={"lc/profile"} onClick={() => setIsOpenProfileMenu(false)}>
                                            <img
                                                src={profileIcon}
                                                className={classes.profileIcon}
                                                width={20}
                                                height={20}
                                            />
                                            <span>
                                                Личный кабинет
                                            </span>
                                        </Link>
                                        <button className={classes.dropDownItem} onClick={menuLogoutHandler} type={"button"}>
                                            <img 
                                                src={exitIcon}
                                                alt=""
                                                className={classes.exitIcon}
                                                width={20}
                                                height={20}
                                            />
                                            <span>Выйти</span>
                                        </button>
                                    </DropDownList>
                                </>
                                :
                                <Button onClick={() => setModalIsOpen(true)}>Войти</Button>
                            }
                        </li>
                    </ul>
                </div>  
            </nav>
            <RegisterModalWindow onClose={() => setModalIsOpen(false)} isOpen={modalIsOpen}/>
        </>
    )
}

export default observer(Navbar);