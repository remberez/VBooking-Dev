import { useEffect, useRef, useState } from 'react';

function useInfiniteScroll(fetchDataFunction, initialPageSize = 3) {
    const [dataList, setDataList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [totalCount, setTotalCount] = useState(null);
    const loadingRef = useRef(false);
    const [shouldResetData, setShouldResetData] = useState(false);
    const [isFetchUp, setIsFetchUp] = useState(false);

    const fetchData = async () => {
        if (shouldResetData) return

        setIsLoading(true);
        loadingRef.current = true;

        try {
            const response = await fetchDataFunction(page, initialPageSize);
            setDataList([...dataList, ...response.results]);

            if (totalCount === null) {
                setTotalCount(response.count);
            }

            if (response.next === null) {
                setHasMore(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setIsFetchUp(false);
            setIsLoading(false);
            loadingRef.current = false;
        }
    };

    const handleScroll = () => {
        if (hasMore && !loadingRef.current) {
            setIsFetchUp(true);
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        fetchData();
    }, [page]);

    async function shouldReset(callback, page) {
        if (isLoading) return; 
    
        setIsLoading(true);
    
        try {
            const data = await callback();
            setDataList(data.results);
            setHasMore(data.next === null ? false : true);
            setTotalCount(data.count);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false); 
        }
    }

    return { 
        dataList, 
        setDataList, 
        isLoading, 
        setIsLoading, 
        hasMore, 
        setHasMore, 
        totalCount, 
        page, 
        setPage, 
        setShouldResetData, 
        isFetchUp, 
        handleScroll,
        shouldReset, 
    };
}

export default useInfiniteScroll;