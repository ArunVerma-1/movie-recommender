import { useState, useEffect } from 'react';
import {
  Input,
  Box,
  VStack,
  HStack,
  Text,
  Spinner,
} from '@chakra-ui/react';
import axios from 'axios';

const SearchMovies = ({ onMovieSelect }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Search movies when query changes
  useEffect(() => {
    if (query.length >= 2) {
      const searchTimeout = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/movies/search`,
            {
              params: { q: query }
            }
          );
          setSearchResults(response.data.slice(0, 10)); // Limit to 10 results
          setShowResults(true);
        } catch (error) {
          console.error('Error searching movies:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300); // Debounce search

      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [query]);

  const handleMovieSelect = (movie) => {
    onMovieSelect(movie);
    setQuery('');
    setShowResults(false);
    setSearchResults([]);
  };

  return (
    <Box position="relative" width="100%">
      <Input
        placeholder="Search for movies..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size="lg"
        borderRadius="md"
      />
      
      {isSearching && (
        <Box position="absolute" right={3} top={3}>
          <Spinner size="sm" />
        </Box>
      )}

      {showResults && searchResults.length > 0 && (
        <Box
          position="absolute"
          top="100%"
          left={0}
          right={0}
          bg="white"
          _dark={{ bg: 'gray.700' }}
          border="1px solid"
          borderColor="gray.200"
          _dark={{ borderColor: 'gray.600' }}
          borderRadius="md"
          mt={1}
          maxH="400px"
          overflowY="auto"
          zIndex={10}
          boxShadow="lg"
        >
          <VStack spacing={0} align="stretch">
            {searchResults.map((movie) => (
              <HStack
                key={movie.id}
                p={3}
                _hover={{ bg: 'gray.50', _dark: { bg: 'gray.600' } }}
                cursor="pointer"
                onClick={() => handleMovieSelect(movie)}
              >
                <Box
                  width="40px"
                  height="60px"
                  bg="gray.200"
                  borderRadius="sm"
                  backgroundImage={
                    movie.poster_path 
                      ? `url(https://image.tmdb.org/t/p/w92${movie.poster_path})`
                      : 'none'
                  }
                  backgroundSize="cover"
                  backgroundPosition="center"
                />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight="medium" noOfLines={1}>
                    {movie.title}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {movie.release_date?.slice(0, 4) || 'N/A'}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  );
};

export default SearchMovies;
