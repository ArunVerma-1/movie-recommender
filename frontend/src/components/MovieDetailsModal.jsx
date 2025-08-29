import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
  Grid,
  GridItem,
  Divider,
  Avatar,
  useColorModeValue,
  Progress,
  Flex,
  Icon,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Spinner,
  Center,
} from '@chakra-ui/react';
import { StarIcon, CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { BiPlay } from "react-icons/bi";
import { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetailsModal = ({ isOpen, onClose, movie, onTrailerClick }) => {
  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(false);

  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.600', 'gray.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    if (isOpen && movie?.id) {
      fetchMovieDetails(movie.id);
      fetchMovieCast(movie.id);
    }
  }, [isOpen, movie]);

  const fetchMovieDetails = async (movieId) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/movies/${movieId}`
      );
      setMovieDetails(response.data);
    } catch (error) {
      console.error('Error fetching movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMovieCast = async (movieId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/movies/${movieId}/credits`
      );
      setCast(response.data?.cast?.slice(0, 6) || []);
    } catch (error) {
      console.error('Error fetching cast:', error);
    }
  };

  const formatRuntime = (minutes) => {
    if (!minutes && minutes !== 0) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount) => {
    if (!amount && amount !== 0) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
    }).format(amount);
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'green';
    if (rating >= 7) return 'yellow';
    if (rating >= 6) return 'orange';
    return 'red';
  };

  // Early exit: don't render anything if modal is closed or no base movie is provided
  if (!isOpen || !movie) return null;

  if (loading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent bg={bgColor}>
          <Center h="500px">
            <Spinner size="xl" color="brand.500" />
          </Center>
        </ModalContent>
      </Modal>
    );
  }

  // Safe fallback object; use optional chaining everywhere below
  const details = movieDetails ?? movie ?? {};

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" isCentered scrollBehavior="inside">
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="2xl" maxH="90vh">
        <ModalCloseButton zIndex={10} />

        <ModalBody p={0}>
          {/* Hero Section */}
          <Box position="relative" h="300px" overflow="hidden">
            {details?.backdrop_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w1280${details.backdrop_path}`}
                alt={details?.title || 'Backdrop'}
                w="100%"
                h="100%"
                objectFit="cover"
              />
            )}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="linear-gradient(to top, rgba(0,0,0,0.9), rgba(0,0,0,0.3))"
            />

            {/* Movie Info Overlay */}
            <Box position="absolute" bottom={6} left={6} right={6}>
              <HStack align="end" spacing={6}>
                {details?.poster_path && (
                  <Image
                    src={`https://image.tmdb.org/t/p/w342${details.poster_path}`}
                    alt={details?.title || 'Poster'}
                    w="120px"
                    h="180px"
                    objectFit="cover"
                    borderRadius="lg"
                    boxShadow="2xl"
                  />
                )}

                <VStack align="start" spacing={2} flex={1} color="white">
                  <Text fontSize="3xl" fontWeight="bold" textShadow="2px 2px 4px rgba(0,0,0,0.5)">
                    {details?.title || 'Untitled'}
                  </Text>

                  <HStack spacing={4} wrap="wrap">
                    {typeof details?.vote_average === 'number' && details.vote_average > 0 && (
                      <Badge
                        colorScheme={getRatingColor(details.vote_average)}
                        px={3}
                        py={1}
                        borderRadius="full"
                      >
                        <HStack spacing={1}>
                          <Icon as={StarIcon} w={3} h={3} />
                          <Text fontWeight="bold">{details.vote_average.toFixed(1)}</Text>
                        </HStack>
                      </Badge>
                    )}

                    <HStack spacing={1} fontSize="sm">
                      <Icon as={CalendarIcon} />
                      <Text>
                        {details?.release_date
                          ? new Date(details.release_date).getFullYear()
                          : 'TBA'}
                      </Text>
                    </HStack>

                    {typeof details?.runtime === 'number' && details.runtime > 0 && (
                      <HStack spacing={1} fontSize="sm">
                        <Icon as={TimeIcon} />
                        <Text>{formatRuntime(details.runtime)}</Text>
                      </HStack>
                    )}
                  </HStack>

                  <Button
                    leftIcon={<BiPlay />}
                    colorScheme="brand"
                    size="lg"
                    onClick={() => onTrailerClick && onTrailerClick(details)}
                  >
                    Watch Trailer
                  </Button>
                </VStack>
              </HStack>
            </Box>
          </Box>

          {/* Content Section */}
          <Box p={6}>
            <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={8}>
              <GridItem>
                {/* Overview */}
                <VStack align="start" spacing={4}>
                  <Box>
                    <Text fontSize="xl" fontWeight="bold" mb={3}>
                      Overview
                    </Text>
                    <Text lineHeight="1.7" color={textColor}>
                      {details?.overview || 'No overview available.'}
                    </Text>
                  </Box>

                  {/* Genres */}
                  {details?.genres?.length > 0 && (
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" mb={3}>
                        Genres
                      </Text>
                      <Wrap>
                        {details.genres.map((genre) => (
                          <WrapItem key={genre.id}>
                            <Tag size="lg" colorScheme="brand" variant="subtle">
                              <TagLabel>{genre.name}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  )}

                  {/* Cast */}
                  {cast.length > 0 && (
                    <Box>
                      <Text fontSize="lg" fontWeight="bold" mb={3}>
                        Main Cast
                      </Text>
                      <Grid templateColumns="repeat(auto-fit, minmax(150px, 1fr))" gap={4}>
                        {cast.map((actor) => (
                          <VStack key={actor.id} align="center" spacing={2}>
                            <Avatar
                              src={
                                actor?.profile_path
                                  ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                                  : undefined
                              }
                              name={actor?.name}
                              size="lg"
                            />
                            <VStack spacing={0} textAlign="center">
                              <Text fontSize="sm" fontWeight="medium">
                                {actor?.name}
                              </Text>
                              <Text fontSize="xs" color={textColor}>
                                {actor?.character}
                              </Text>
                            </VStack>
                          </VStack>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </VStack>
              </GridItem>

              <GridItem>
                {/* Movie Stats */}
                <VStack align="stretch" spacing={6}>
                  <Box
                    p={4}
                    borderRadius="lg"
                    border="1px solid"
                    borderColor={borderColor}
                  >
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Movie Info
                    </Text>

                    <VStack align="stretch" spacing={3}>
                      <Flex justify="space-between">
                        <Text color={textColor}>Status:</Text>
                        <Badge colorScheme="green">{details?.status || 'Released'}</Badge>
                      </Flex>

                      <Flex justify="space-between">
                        <Text color={textColor}>Runtime:</Text>
                        <Text>
                          {typeof details?.runtime === 'number' && details.runtime > 0
                            ? formatRuntime(details.runtime)
                            : 'N/A'}
                        </Text>
                      </Flex>

                      <Flex justify="space-between">
                        <Text color={textColor}>Budget:</Text>
                        <Text>{formatMoney(details?.budget)}</Text>
                      </Flex>

                      <Flex justify="space-between">
                        <Text color={textColor}>Revenue:</Text>
                        <Text>{formatMoney(details?.revenue)}</Text>
                      </Flex>

                      <Flex justify="space-between">
                        <Text color={textColor}>Language:</Text>
                        <Text>{details?.original_language?.toUpperCase() || 'N/A'}</Text>
                      </Flex>
                    </VStack>
                  </Box>

                  {/* User Score */}
                  {typeof details?.vote_average === 'number' && details.vote_average > 0 && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text fontSize="lg" fontWeight="bold" mb={4}>
                        User Score
                      </Text>

                      <VStack spacing={3}>
                        <Box textAlign="center">
                          <Text fontSize="3xl" fontWeight="bold" color="brand.500">
                            {(details.vote_average * 10).toFixed(0)}%
                          </Text>
                          <Text fontSize="sm" color={textColor}>
                            {`based on ${details?.vote_count ?? 0} reviews`}
                          </Text>
                        </Box>

                        <Progress
                          value={details.vote_average * 10}
                          colorScheme={getRatingColor(details.vote_average)}
                          borderRadius="full"
                          size="lg"
                          w="100%"
                        />
                      </VStack>
                    </Box>
                  )}

                  {/* Production Companies */}
                  {details?.production_companies?.length > 0 && (
                    <Box
                      p={4}
                      borderRadius="lg"
                      border="1px solid"
                      borderColor={borderColor}
                    >
                      <Text fontSize="lg" fontWeight="bold" mb={4}>
                        Production
                      </Text>

                      <VStack align="stretch" spacing={2}>
                        {details.production_companies.slice(0, 3).map((company) => (
                          <HStack key={company.id} spacing={3}>
                            {company?.logo_path && (
                              <Image
                                src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                                alt={company?.name}
                                h="30px"
                                objectFit="contain"
                              />
                            )}
                            <Text fontSize="sm">{company?.name}</Text>
                          </HStack>
                        ))}
                      </VStack>
                    </Box>
                  )}
                </VStack>
              </GridItem>
            </Grid>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default MovieDetailsModal;