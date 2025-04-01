"use client";

import { useState, useCallback, useEffect } from "react";
import { useDebounce } from "./use-debounce";

/**
 * Custom hook for handling batch-wise pagination, optimized search, and data fetching
 * @param {string} fetchUrl Base URL for fetching data
 * @param {Object} options Pagination options
 * @returns {Object} Pagination state and controls
 */

export function usePagination(fetchUrl, options = {}) {
  const {
    initialPage = 1,
    pageSize = 10,
    batchSize = 100, // Fetch 100 records at a time
    searchDelay = 300,
  } = options;

  const [items, setItems] = useState([]);
  const [displayedItems, setDisplayedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [additionalFilters, setAdditionalFilters] = useState({});
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const debouncedSearchText = useDebounce(searchText, searchDelay);

  const [paginationInfo, setPaginationInfo] = useState({
    currentPage: initialPage,
    totalPages: 1,
    batchNumber: 1,
    total: 0,
  });

  // Store batches of data in cache
  const [batchCache, setBatchCache] = useState({});

  // Build query string for API requests
  const buildQueryString = useCallback(() => {
    const params = new URLSearchParams();

    // Calculate batch number based on current page
    const batchNumber = Math.ceil(
      paginationInfo.currentPage / (batchSize / pageSize)
    );
    params.append("page", paginationInfo.currentPage.toString());
    params.append("pageSize", pageSize.toString());

    // Add search query if not searching in cache
    if (debouncedSearchText) {
      params.append("search", debouncedSearchText);
    }

    // Add any additional filters
    Object.entries(additionalFilters).forEach(([key, value]) => {
      if (value) params.append(key, value);
    });

    return params.toString();
  }, [
    paginationInfo.currentPage,
    pageSize,
    debouncedSearchText,
    additionalFilters,
    batchSize,
  ]);

  useEffect(() => {
    fetchBatch(); // Force execution
  }, []);

  // Function to fetch a batch of data from API
  const fetchBatch = useCallback(
    async (forceRefresh = false) => {
      setIsLoading(true);
      try {
        // Calculate current batch number
        const batchNumber = Math.ceil(
          paginationInfo.currentPage / (batchSize / pageSize)
        );
        const cacheKey = `batch_${batchNumber}_${debouncedSearchText}_${JSON.stringify(
          additionalFilters
        )}`;

        // Check if we have this batch in cache and not forcing refresh
        if (!forceRefresh && batchCache[cacheKey]) {
          const cachedBatch = batchCache[cacheKey];
          setItems(cachedBatch.data);
          setPaginationInfo((prev) => ({
            ...prev,
            totalPages: cachedBatch.totalPages,
            batchNumber: batchNumber,
            total: cachedBatch.total,
          }));
        } else {
          // Fetch new batch from API
          const queryString = buildQueryString();

          const url = `${fetchUrl}${queryString ? `?${queryString}` : ""}`;

          try {
            const response = await fetch(url);

            if (!response.ok) {
              console.error(
                " Fetch Error:",
                response.status,
                response.statusText
              );
              throw new Error(
                `Failed to fetch data: ${response.status} - ${response.statusText}`
              );
            }

            const data = await response.json();

            // Ensure `data.data` exists
            if (!data || !data.data) {
              console.error(" API returned unexpected format:", data);
              throw new Error(
                "API did not return expected format `{ data: [...] }`"
              );
            }

            if (Array.isArray(data.data) && data.data.length > 0) {
              setItems([...data.data]); // Ensure state updates
            } else {
              console.warn(
                " API Response did not return expected `data` array or it was empty."
              );
              setItems([]);
            }

            setPaginationInfo({
              currentPage: data.currentPage || 1,
              totalPages: data.totalPages || 1,
              batchNumber: data.batchNumber || batchNumber,
              total: data.total || 0,
            });

            // Cache the batch
            setBatchCache((prev) => ({
              ...prev,
              [cacheKey]: {
                data: data.data || [],
                totalPages: data.totalPages || 1,
                total: data.total || 0,
              },
            }));
          } catch (err) {
            console.error(" Fetch Failed:", err);
            setError("Failed to load data. Please try again later.");
          }
        }
      } catch (err) {
        console.error("Error fetching batch:", err);
        setError("Failed to load data. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    },
    [
      buildQueryString,
      batchCache,
      debouncedSearchText,
      fetchUrl,
      additionalFilters,
      batchSize,
      pageSize,
      paginationInfo.currentPage,
    ]
  );

  // Function to update displayed items based on current page
  const updateDisplayedItems = useCallback(() => {
    if (items.length === 0) return;

    // Calculate start and end indices for current page
    const startIdx =
      ((paginationInfo.currentPage - 1) % (batchSize / pageSize)) * pageSize;
    const endIdx = Math.min(startIdx + pageSize, items.length);

    // If search is active, filter items from the current batch
    if (debouncedSearchText) {
      setDisplayedItems(items);
    } else {
      // Otherwise, slice the appropriate page from the batch
      setDisplayedItems(items.slice(startIdx, endIdx));
    }
  }, [
    items,
    paginationInfo.currentPage,
    pageSize,
    batchSize,
    debouncedSearchText,
  ]);

  // Effect to fetch batch when batch number changes or search/filters change
  useEffect(() => {
    const batchNumber = Math.ceil(
      paginationInfo.currentPage / (batchSize / pageSize)
    );
    const currentBatchNumber = paginationInfo.batchNumber;

    // Fetch new batch if batch number changed or search/filters changed
    if (
      batchNumber !== currentBatchNumber ||
      debouncedSearchText ||
      Object.keys(additionalFilters).length > 0
    ) {
      fetchBatch();
    }
  }, [
    fetchBatch,
    paginationInfo.currentPage,
    paginationInfo.batchNumber,
    debouncedSearchText,
    additionalFilters,
    refreshTrigger,
    batchSize,
    pageSize,
  ]);

  // Effect to update displayed items when items or page changes
  useEffect(() => {
    updateDisplayedItems();
  }, [updateDisplayedItems, items, paginationInfo.currentPage]);

  // Function to navigate to a specific page
  const goToPage = useCallback(
    (page) => {
      if (page >= 1 && page <= paginationInfo.totalPages) {
        setPaginationInfo((prev) => ({ ...prev, currentPage: page }));
      }
    },
    [paginationInfo.totalPages]
  );

  // Function to refresh data
  const refreshData = useCallback(() => {
    // Clear cache and trigger refresh
    setBatchCache({});
    setRefreshTrigger((prev) => prev + 1);
    fetchBatch(true);
  }, [fetchBatch]);

  // Function to handle search
  const handleSearch = useCallback(
    (text) => {
      setSearchText(text);

      // If search is empty, reset to normal pagination
      if (!text) {
        updateDisplayedItems();
        return;
      }

      // First try to search in the current batch
      const lowerCaseSearch = text.toLowerCase();
      const searchInBatch = items.filter((item) => {
        // Search in all string properties of the item
        return Object.entries(item).some(([key, value]) => {
          if (typeof value === "string") {
            return value.toLowerCase().includes(lowerCaseSearch);
          }
          return false;
        });
      });

      // If found results in batch, use them
      if (searchInBatch.length > 0) {
        setDisplayedItems(searchInBatch);
      } else {
        // Otherwise, trigger a new API search
        fetchBatch(true);
      }
    },
    [items, fetchBatch, updateDisplayedItems]
  );

  return {
    // Return the displayed items (current page or search results)
    items: displayedItems,
    allItems: items, // Full batch of items
    paginationInfo,
    isLoading,
    error,
    searchText,
    setSearchText: handleSearch, // Use the optimized search handler
    goToPage,
    refreshData,
    refetch: refreshData,
    additionalFilters,
    setAdditionalFilters,
  };
}
