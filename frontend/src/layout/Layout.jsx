import { Outlet } from "react-router-dom";
import Navbar from "./header/Navbar";
import Footer from "./footer/Footer";

function Layout() {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <Footer/>
        </>
    )
}

export default Layout;