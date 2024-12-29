import classes from "./PeopleInput.module.css";
import PeopleModal from "./PeopleModal";
import useDropdown from "../../hooks/useDropDown";

function PeopleInput( { children, adultsCount, setAdultsCount, kidsCount, setKidsCount, className, containerClassName } ) {
    const { isActive, toggleDropdown, dropdownRef } = useDropdown();

    return (
        <div className={classes.peopleInputWrapper + " " + containerClassName } ref={dropdownRef} >
            <input
                className="visually-hidden"
                readOnly
                type="text"
                value={kidsCount}
                name="kids"
            />
            <input
                className="visually-hidden"
                readOnly
                type="text"
                value={adultsCount}
                name="adults"
            />
            <button 
                className={classes.peopleInputPlaceholder + " " + className} 
                type="button"
                onClick={ toggleDropdown }
            >
                { children }
            </button>
            {
                isActive && (
                    <PeopleModal 
                        modalClassName={classes.peopleModal}
                        adultsCount={adultsCount}
                        setAdultsCount={setAdultsCount}
                        kidsCount={kidsCount}
                        setKidsCount={setKidsCount}
                        setIsAcitve={toggleDropdown}
                    />
                )
            }
        </div>
    )
}

export default PeopleInput;