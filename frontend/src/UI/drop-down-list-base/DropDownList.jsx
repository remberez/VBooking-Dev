import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import classes from "./DropDownList.module.css";

function DropDownList({ children, menuClassName, itemClassName, isActive }) {
    const [isVisible, setIsVisible] = useState(isActive);

    useEffect(() => {
        if (isActive) {
            setIsVisible(true);
        } else {
            const timer = setTimeout(() => setIsVisible(false), 300); // Задержка перед скрытием
            return () => clearTimeout(timer);
        }
    }, [isActive]);

    const combinedMenuClass = classNames(menuClassName, classes.menu, {
        [classes.active]: isActive,
    });

    return (
        <ul className={combinedMenuClass} role="menu" aria-hidden={!isActive}>
            {children.map((value, index) => (
                <li 
                    key={index} 
                    className={classNames(itemClassName, classes.item, {
                        [classes.visible]: isVisible
                    })} 
                    role="menuitem"
                >
                    {value}
                </li>
            ))}
        </ul>
    );
}

export default DropDownList;
