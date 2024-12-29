import { useEffect, useState } from "react";
import ObjectsTypeService from "../api/objectsTypeService";

function useObjectTypes() {
    const [types, setTypes] = useState([]);

    useEffect(() => {
        async function fetchTypes() {
            try {
                const typesData = await ObjectsTypeService.getObjectsType();
                setTypes(typesData);
            } catch (error) {
                console.error("Error loading object types:", error);
            }
        }

        fetchTypes();
    }, []);

    return types;
}

export default useObjectTypes;