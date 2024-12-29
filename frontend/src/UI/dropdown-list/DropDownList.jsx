import classes from './DropdownList.module.css';
import useDropdown from "../../hooks/useDropDown";

function DropdownList({ 
        inputName, 
        children, 
        options, 
        selectedValue, 
        setSelectedValue, 
        containerClassName, 
        placeHolderClassName, 
        listClassName,
        onClick,
    }) {
    const { isActive, toggleDropdown, dropdownRef } = useDropdown();

    function handleSelect(option) {
        setSelectedValue(option);
        toggleDropdown();
    }

    function handleOpen() {
        toggleDropdown();
        onClick();
    }

    return (
        <div className={classes.dropdownList + " " + containerClassName} ref={dropdownRef}>
            <input
                className="visually-hidden"
                value={selectedValue}
                readOnly
                name={ inputName }
                type="text"
            />
            <button 
                className={placeHolderClassName} 
                onClick={handleOpen} 
                type='button'
            >
                { children }
            </button>
            {
                isActive && (
                    <ul className={listClassName + " " + classes.dropdownMenu}>
                        {options.map((option, index) => (
                            <li key={index} className={classes.dropdownItem}>
                                <button type="button" onClick={() => handleSelect(option)} className={classes.dropdownButton}>
                                    {option}
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            }
        </div>
    );
}


export default DropdownList;