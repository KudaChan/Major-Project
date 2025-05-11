/**
 * useFetch.tsx
 * 
 * Custom React hook for fetching GIFs from the Giphy API.
 * Used to display transaction-related animations based on keywords.
 * Falls back to a default GIF if the API key is missing or request fails.
 */
import { useEffect, useState } from "react";

// Get API key from environment variables
const APIKEY = import.meta.env.VITE_GIPHY_API;

/**
 * useFetch hook
 * Fetches a GIF from Giphy API based on the provided keyword
 * 
 * @param keyword - Search term for the GIF
 * @returns Object containing the fetched GIF URL
 */
const useFetch = ({ keyword }: { keyword: string }) => {
  // State to store the GIF URL
  const [gifUrl, setGifUrl] = useState("");

  /**
   * Fetches GIFs from Giphy API
   * Sets a default GIF if the API key is missing or request fails
   */
  const fetchGifs = async () => {
    try {
      if (!APIKEY) {
        console.warn("Missing GIPHY API key");
        setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
        return;
      }
      const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${keyword.split(" ").join("")}&limit=1`);
      const { data } = await response.json();

      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      console.log(error);
      setGifUrl("https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284");
    }
  };

  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
