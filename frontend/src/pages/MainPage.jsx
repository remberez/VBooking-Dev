import Header from "../components/header/Header";
import CityService from "../api/ciyService";
import { useEffect, useState } from "react";
import PopularResorts from "../components/popular-resorts/PopularResorts";
import TopRatedObjects from "../components/top-rated-objects/TopRatedObjects";
import SocialBanner from "../components/social-banner/SocialBanner";
import ArticleList from "../components/article-list/ArticleList";
import RentOutBanner from "../components/rent-out-banner/RentOutBanner";

function MainPage() {
    const [cityList, setCityList] = useState([]);
    async function getCities() {
        try {
            const cities = await CityService.getCities();
            setCityList(cities);    
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getCities()
    }, []);

    return (
        <>
            <main className="main">
                <Header cityList={ cityList } />
                <PopularResorts cityList={cityList}/>
                <TopRatedObjects />
                <section className="container">
                    <SocialBanner />
                </section>
                <ArticleList />
                <RentOutBanner />
            </main>
        </>
    )
}

export default MainPage;