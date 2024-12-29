import { useRef, useState, useEffect } from 'react';

const useDropdown = () => {
    const [isActive, setIsActive] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        setIsActive((prev) => !prev);
    };

    const closeDropdown = () => {
        setIsActive(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            closeDropdown();
        }
    };


    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return { isActive, toggleDropdown, closeDropdown, dropdownRef };
};

export default useDropdown;