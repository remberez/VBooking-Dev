import "./scroll.css";
import ObjectsFilterSearch from "../components/ObjectsFilterSearch/ObjectsFilterSearch";
import ReviewCarousel from "../components/review-carousel/ReviewCarousel";

function SearchPage() {
    return (
        <main className="container">
            <ObjectsFilterSearch/>
            <ReviewCarousel/>
        </main>
    )
}

export default SearchPage;