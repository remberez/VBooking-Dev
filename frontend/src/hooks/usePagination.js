import { useEffect, useState } from 'react';

function usePagination(fetchData, initialPage = 1) {
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState([]);

    const fetchObjects = async () => {
        try {
            setLoading(true);
            const response = await fetchData(currentPage);
            setData(response.results || []);
            setTotalPages(response.pages || 1);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchObjects();
    }, [currentPage]);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };

    return {
        data,
        loading,
        currentPage,
        totalPages,
        handleNextPage,
        handlePreviousPage,
    };
}

export default usePagination;