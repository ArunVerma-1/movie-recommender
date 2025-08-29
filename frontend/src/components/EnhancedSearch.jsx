import {
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  VStack,
  HStack,
  Text,
  Image,
  useColorModeValue,
  Spinner,
  Badge,
  IconButton,
  useOutsideClick,
  Portal,
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const EnhancedSearch = ({ onMovieSelect, isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  const searchRef = useRef();
  const inputRef = useRef();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const hoverBg = useColorModeValue('gray.50', 'gray.700');

  useOutsideClick({
    ref: searchRef,
    handler: onClose,
  });

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (query.length >= 2) {
      const searchTimeout = setTimeout(async () => {
        setIsSearching(true);
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/api/movies/search`,
            { params: { q: query } }
          );
          setSearchResults(response.data.slice(0, 10));
        } catch (error) {
          console.error('Error searching movies:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 300);

      return () => clearTimeout(searchTimeout);
    } else {
      setSearchResults([]);
      setSelectedIndex(-1);
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (!searchResults.length) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0) {
          handleMovieSelect(searchResults[selectedIndex]);
        }
        break;
      case 'Escape':
        onClose();
        break;
    }
  };

  const handleMovieSelect = (movie) => {
    onMovieSelect(movie);
    setQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Portal>
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        backdropFilter="blur(4px)"
        zIndex={2000}
        display="flex"
        alignItems="flex-start"
        justifyContent="center"
        pt="10vh"
      >
        <Box
          ref={searchRef}
          bg={bgColor}
          borderRadius="2xl"
          boxShadow="2xl"
          w="full"
          maxW="600px"
          mx={4}
          overflow="hidden"
        >
          {/* Search Input */}
          <Box p={6} pb={searchResults.length > 0 ? 4 : 6}>
            <HStack spacing={4}>
              <InputGroup size="lg">
                <InputLeftElement>
                  <SearchIcon color="gray.400" />
                </InputLeftElement>
                <Input
                  ref={inputRef}
                  placeholder="Search movies, TV shows, people..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  variant="filled"
                  borderRadius="xl"
                  fontSize="lg"
                />
              </InputGroup>
              
              {isSearching && <Spinner color="brand.500" />}
              
              <IconButton
                aria-label="Close search"
                icon={<CloseIcon />}
                variant="ghost"
                onClick={onClose}
                borderRadius="xl"
              />
            </HStack>
          </Box>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <VStack spacing={0} align="stretch" maxH="400px" overflowY="auto">
              {searchResults.map((movie, index) => (
                <HStack
                  key={movie.id}
                  p={4}
                  spacing={4}
                  bg={index === selectedIndex ? hoverBg : 'transparent'}
                  _hover={{ bg: hoverBg }}
                  cursor="pointer"
                  onClick={() => handleMovieSelect(movie)}
                  borderTop={index === 0 ? '1px solid' : 'none'}
                  borderTopColor={borderColor}
                >
                  <Image
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
                        : 'https://via.placeholder.com/92x138/2D3748/E2E8F0?text=No+Image'
                    }
                    alt={movie.title}
                    w="46px"
                    h="69px"
                    objectFit="cover"
                    borderRadius="md"
                  />
                  
                  <VStack align="start" spacing={1} flex={1}>
                    <Text fontWeight="medium" noOfLines={1}>
                      {movie.title}
                    </Text>
                    <HStack spacing={2}>
                      <Text fontSize="sm" color="gray.500">
                        {movie.release_date?.slice(0, 4) || 'TBA'}
                      </Text>
                      {movie.vote_average > 0 && (
                        <Badge
                          colorScheme={movie.vote_average >= 7 ? 'green' : 'yellow'}
                          size="sm"
                        >
                          ⭐ {movie.vote_average.toFixed(1)}
                        </Badge>
                      )}
                    </HStack>
                    {movie.overview && (
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {movie.overview}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              ))}
            </VStack>
          )}

          {/* No Results */}
          {query.length >= 2 && !isSearching && searchResults.length === 0 && (
            <Box p={6} textAlign="center" color="gray.500">
              <Text>No movies found for "{query}"</Text>
            </Box>
          )}
        </Box>
      </Box>
    </Portal>
  );
};

export default EnhancedSearch;