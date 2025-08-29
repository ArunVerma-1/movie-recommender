import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
} from '@chakra-ui/react';

const MovieCard = ({ movie, onMovieClick }) => {
  const getPosterUrl = (posterPath) => {
    if (!posterPath) return 'https://via.placeholder.com/300x450?text=No+Image';
    return `https://image.tmdb.org/t/p/w300${posterPath}`;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'green';
    if (rating >= 6) return 'yellow';
    return 'red';
  };

  return (
    <Box
      bg="white"
      _dark={{ bg: 'gray.700' }}
      border="1px solid"
      borderColor="gray.200"
      _dark={{ borderColor: 'gray.600' }}
      borderRadius="lg"
      overflow="hidden"
      cursor="pointer"
      transition="transform 0.2s"
      _hover={{ transform: 'translateY(-2px)', shadow: 'lg' }}
      onClick={() => onMovieClick && onMovieClick(movie)}
    >
      <Image
        src={getPosterUrl(movie.poster_path)}
        alt={movie.title}
        width="100%"
        height="400px"
        objectFit="cover"
        fallbackSrc="https://via.placeholder.com/300x450?text=No+Image"
      />
      <VStack p={4} align="start" spacing={2}>
        <Text
          fontWeight="bold"
          fontSize="md"
          noOfLines={2}
          minHeight="48px"
        >
          {movie.title}
        </Text>
        <HStack justify="space-between" width="100%">
          <Text fontSize="sm" color="gray.500">
            {movie.release_date?.slice(0, 4) || 'N/A'}
          </Text>
          {movie.vote_average > 0 && (
            <Badge colorScheme={getRatingColor(movie.vote_average)}>
              {movie.vote_average.toFixed(1)}
            </Badge>
          )}
        </HStack>
      </VStack>
    </Box>
  );
};

export default MovieCard;
