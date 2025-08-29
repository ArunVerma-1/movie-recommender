import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  VStack,
  Grid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  useDisclosure,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  HStack,
  Badge,
  Button,
  Flex,
} from '@chakra-ui/react';
import { useWebSocket } from './hooks/useWebSocket';
import Header from './components/Header';
import EnhancedMovieCard from './components/EnhancedMovieCard';
import EnhancedSearch from './components/EnhancedSearch';
import MovieDetailsModal from './components/MovieDetailsModal';
import TrailerModal from './components/TrailerModal';
import axios from 'axios';

function App() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [upcomingMovies, setUpcomingMovies] = useState([]);
  const [isLoadingRecommendations, setIsLoadingRecommendations] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  // Modal controls
  const {
    isOpen: isSearchOpen,
    onOpen: onSearchOpen,
    onClose: onSearchClose,
  } = useDisclosure();

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure();

  const {
    isOpen: isTrailerOpen,
    onOpen: onTrailerOpen,
    onClose: onTrailerClose,
  } = useDisclosure();

  const [trailerMovie, setTrailerMovie] = useState(null);

  // WebSocket connection for real-time updates
  const { lastMessage, connectionStatus, sendMessage } = useWebSocket(
    import.meta.env.VITE_WS_URL,
    Math.random().toString(36).substring(7)
  );

  const bgGradient = useColorModeValue(
    'linear(to-br, #f7fafc, #edf2f7)',
    'linear(to-br, #1a202c, #2d3748)'
  );

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Handle WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'trending_movies':
        case 'trending_update':
          setTrendingMovies(lastMessage.data);
          break;
        case 'recommendations':
          setRecommendations(lastMessage.data);
          setIsLoadingRecommendations(false);
          break;
      }
    }
  }, [lastMessage]);

  const loadInitialData = async () => {
    setIsLoadingContent(true);
    try {
      const [trendingRes, popularRes, upcomingRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/api/movies/trending`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/movies/popular`),
        axios.get(`${import.meta.env.VITE_API_URL}/api/movies/upcoming`),
      ]);

      setTrendingMovies(trendingRes.data);
      setPopularMovies(popularRes.data);
      setUpcomingMovies(upcomingRes.data);
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
    onDetailsOpen();
    loadRecommendations(movie.id);
  };

  const loadRecommendations = async (movieId) => {
    setIsLoadingRecommendations(true);
    setRecommendations([]);

    // Try WebSocket first, fallback to HTTP
    if (connectionStatus === 'Connected') {
      sendMessage({
        type: 'get_recommendations',
        movie_id: movieId,
      });
    } else {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/movies/recommendations`,
          { movie_id: movieId }
        );
        setRecommendations(response.data);
        setIsLoadingRecommendations(false);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setIsLoadingRecommendations(false);
      }
    }
  };

  const handleTrailerClick = (movie) => {
    setTrailerMovie(movie);
    onTrailerOpen();
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'Connected':
        return 'green';
      case 'Connecting':
        return 'yellow';
      case 'Error':
      case 'Disconnected':
        return 'red';
      default:
        return 'gray';
    }
  };

  const MovieGrid = ({ movies, title, isLoading = false }) => (
    <Box>
      <HStack justify="space-between" align="center" mb={6}>
        <Text fontSize="2xl" fontWeight="bold">
          {title}
        </Text>
        {title === 'Trending Now' && (
          <Badge colorScheme={getConnectionStatusColor()} variant="subtle">
            Live Updates: {connectionStatus}
          </Badge>
        )}
      </HStack>

      {isLoading ? (
        <Flex justify="center" align="center" h="400px">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" />
            <Text color="gray.500">Loading amazing movies...</Text>
          </VStack>
        </Flex>
      ) : movies.length > 0 ? (
        <Grid templateColumns="repeat(auto-fill, minmax(220px, 1fr))" gap={6}>
          {movies.slice(0, 20).map((movie) => (
            <EnhancedMovieCard
              key={movie.id}
              movie={movie}
              onMovieClick={handleMovieSelect}
              onTrailerClick={handleTrailerClick}
            />
          ))}
        </Grid>
      ) : (
        <Alert status="warning" borderRadius="xl">
          <AlertIcon />
          No movies available at the moment. Please check back later.
        </Alert>
      )}
    </Box>
  );

  return (
    <Box bg={bgGradient} minH="100vh">
      {/* Header */}
      <Header onSearchClick={onSearchOpen} />

      {/* Main Content */}
      <Container maxW="container.2xl" py={8}>
        <VStack spacing={12} align="stretch">
          {/* Hero Section */}
          <Box textAlign="center" py={8}>
            <Text
              fontSize={{ base: '4xl', md: '6xl' }}
              fontWeight="black"
              bgGradient="linear(to-r, #667eea, #764ba2, #f093fb)"
              bgClip="text"
              mb={4}
            >
              Welcome to WatchThis
            </Text>
            <Text
              fontSize="xl"
              color="gray.500"
              maxW="600px"
              mx="auto"
              lineHeight="1.6"
            >
              Explore trending movies, get personalized recommendations, and never miss the latest blockbusters.
            </Text>

            <Button
              size="lg"
              colorScheme="brand"
              mt={6}
              onClick={onSearchOpen}
              leftIcon={<Text fontSize="lg">🔍</Text>}
            >
              Explore WatchThis
            </Button>
          </Box>

          {/* Movie Categories */}
          <Tabs
            index={activeTab}
            onChange={setActiveTab}
            variant="soft-rounded"
            colorScheme="brand"
            size="lg"
          >
            <TabList mb={8} justifyContent="center">
              <Tab>🔥 Trending</Tab>
              <Tab>⭐ Popular</Tab>
              <Tab>🎬 Coming Soon</Tab>
            </TabList>

            <TabPanels>
              <TabPanel p={0}>
                <MovieGrid
                  movies={trendingMovies}
                  title="Trending Now"
                  isLoading={isLoadingContent}
                />
              </TabPanel>

              <TabPanel p={0}>
                <MovieGrid
                  movies={popularMovies}
                  title="Popular Movies"
                  isLoading={isLoadingContent}
                />
              </TabPanel>

              <TabPanel p={0}>
                <MovieGrid
                  movies={upcomingMovies}
                  title="Coming Soon"
                  isLoading={isLoadingContent}
                />
              </TabPanel>
            </TabPanels>
          </Tabs>

          {/* Recommendations Section */}
          {selectedMovie && recommendations.length > 0 && (
            <MovieGrid
              movies={recommendations}
              title={`More like "${selectedMovie.title}"`}
              isLoading={isLoadingRecommendations}
            />
          )}
        </VStack>
      </Container>

      {/* Modals */}
      <EnhancedSearch
        isOpen={isSearchOpen}
        onClose={onSearchClose}
        onMovieSelect={handleMovieSelect}
      />

      <MovieDetailsModal
        isOpen={isDetailsOpen}
        onClose={onDetailsClose}
        movie={selectedMovie}
        onTrailerClick={handleTrailerClick}
      />

      <TrailerModal
        isOpen={isTrailerOpen}
        onClose={onTrailerClose}
        movie={trailerMovie}
      />
    </Box>
  );
}

export default App;