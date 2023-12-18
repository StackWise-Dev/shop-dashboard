import { useAuthenticatedFetch } from '@shopify/app-bridge-react'
import React, { useEffect, useState } from 'react'

export default function useApiRequest(url, method) {

    let fetch = useAuthenticatedFetch();
    let [responseData, setResponseData] = useState(null);
    let [isLoading, setIsLoading] = useState(true);
    let [error, setError] = useState("");

    useEffect(() => {
        let abortController = new AbortController();
        fetch(url, {
            method: `${method}`,
            headers: {"Content-Type": "application/json"},
            signal: abortController.signal
        })
        .then((response) => {
            if(!response.ok) {
                setError(`Error: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            setResponseData(data);
            setIsLoading(false);
        })
        .catch((error) => {
            if(error.name === "AbortError") {
                console.log("Abort Error");
            } else {
                console.log(error.name, " => ", error.message);
            }
        });
        return () => abortController.abort();
    }, [url])
    return {responseData, isLoading, error};
}
