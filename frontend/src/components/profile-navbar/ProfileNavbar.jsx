import { Link, NavLink, useLocation } from "react-router-dom";
import classes from "./ProfileNavbar.module.css";
import { Context } from "../../App";
import { useContext } from "react";
import { observer } from "mobx-react-lite";
import { CgProfile } from "react-icons/cg";
import { FaRegHeart } from "react-icons/fa";
import { LuHousePlus } from "react-icons/lu";
import { MdOutlineRateReview } from "react-icons/md";
import { MdOutlineAdminPanelSettings } from "react-icons/md";


function NavBarItem({ to, icon, children }) {
    return (
        <NavLink 
            to={to} 
            className={({ isActive }) => isActive ? `${classes.active} ${classes.navLink}` : classes.navLink}
        >
            <div className={classes.navbarText}>
                { icon }
                <span>
                    { children }
                </span>
            </div>
        </NavLink>
    )
}

function ProfileNavbar({ }) {
    const { store } = useContext(Context);
    const user = store.user;
    const location = useLocation();

    return (
        <nav className={classes.navbar}>
            <div className={classes.header}>
                <Link to="profile" className={classes.linkHeader}>
                    <img src={user.image} alt="фото профиля" className={classes.profileImage}/>
                    <div className={classes.emailWrapper}>
                        <h2 className={classes.email}>{ user.email }</h2>
                        <div className={classes.dateJoined}>
                            С нами с {user.date_joined}
                        </div>
                    </div>
                </Link>
            </div>
            <div className={classes.sep}>
            </div>
            <ul className={classes.navList}>
                <li className={classes.navItem}>
                    <NavBarItem to={"profile"} icon={<CgProfile size={20}/>} >
                        Профиль
                    </NavBarItem>
                </li>
                <li className={classes.navItem}>
                    <NavBarItem to={"favorites"} icon={<FaRegHeart size={20}/>}>
                        Избранное
                    </NavBarItem>
                </li>
                <li className={classes.navItem}>
                    <NavBarItem to={"bookings"} icon={<LuHousePlus size={20} fill="white" stroke="black"/>}>
                        Мои бронирования
                    </NavBarItem>
                </li>
                <li className={classes.navItem}>
                    <NavBarItem to={"reviews"} icon={<MdOutlineRateReview size={20} />}>
                        Мои отзывы
                    </NavBarItem>
                </li>
                {user.position === "admin" && (
                    <NavBarItem to={"/admin"} icon={<MdOutlineAdminPanelSettings size={20} color="red"/>                    }>
                        <span className={classes.adminItem}>Админ-панель</span>
                    </NavBarItem>
                )}
            </ul>
        </nav>
    );
}

export default observer(ProfileNavbar);