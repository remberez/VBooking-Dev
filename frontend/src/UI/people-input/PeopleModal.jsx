import Counter from "../counter/Counter";
import Button from "../main-button/Button";

function PeopleModal( { modalClassName, adultsCount, setAdultsCount, kidsCount, setKidsCount, setIsAcitve } ) {

    function adultsHandler(value) {
        if (value >= 0) {
            setAdultsCount(value);
        }
    }

    function kidsHandler(value) {
        if (value >= 0) {
            setKidsCount(value);
        }
    }

    return (
        <div className={ modalClassName }>
            <Counter placeholder={"Взрослых"} count={adultsCount} setCount={ adultsHandler }/>
            <Counter placeholder={"Детей"} count={ kidsCount } setCount={ kidsHandler }/>
            <Button type="button" onClick={() => setIsAcitve(false) }>Применить</Button>
        </div>
    )
}

export default PeopleModal;