import { Outlet } from "react-router-dom";
import ProfileNavbar from "../../components/profile-navbar/ProfileNavbar";
import classes from "./Profile.module.css";
import Title from "../../components/title/Title";

function ProfilePage() {
    return (
        <div className={classes.backgroundWrapper}>
            <div className={`container ${classes.gridWrapper}`}>
                <Title className={classes.title}>Личный кабинет</Title>
                <ProfileNavbar/>
                <Outlet/>
            </div>
        </div>
    );
}

export default ProfilePage;