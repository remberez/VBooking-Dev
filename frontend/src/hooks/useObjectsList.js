import { useState, useEffect } from "react";
import ObjectService from "../api/objectsService";

function useObjectsList(selectedType) {
    const [objectsList, setObjectsList] = useState([]);
    const [cachedObjects, setCachedObjects] = useState([]);

    useEffect(() => {
        async function fetchObjects() {
            if (selectedType !== -1) { 
                if (cachedObjects[selectedType]) {
                    setObjectsList(cachedObjects[selectedType]);
                } else {
                    const objects = await ObjectService.getObjects({ page: 1, page_size: 8, type: selectedType });
                    setObjectsList(objects.results);
                    setCachedObjects(prev => ({ ...prev, [selectedType]: objects.results })); 
                }
            }
        }

        fetchObjects();
    }, [selectedType]);

    return objectsList;
}

export default useObjectsList;