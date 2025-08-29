import {
  Box,
  Image,
  Text,
  Badge,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
  Flex,
  Button,
  Tooltip,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react';
import { StarIcon, CalendarIcon, TimeIcon } from "@chakra-ui/icons";
import { BiPlay } from "react-icons/bi";
import { useState } from 'react';

const EnhancedMovieCard = ({ movie, onMovieClick, onTrailerClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.400');

  const getPosterUrl = (posterPath) => {
    if (!posterPath) return 'https://via.placeholder.com/300x450/2D3748/E2E8F0?text=No+Image';
    return `https://image.tmdb.org/t/p/w500${posterPath}`;
  };

  const getRatingColor = (rating) => {
    if (rating >= 8) return 'green';
    if (rating >= 7) return 'yellow';
    if (rating >= 6) return 'orange';
    return 'red';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'TBA';
    return new Date(dateString).getFullYear();
  };

  return (
    <Box
      bg={bgColor}
      borderRadius="xl"
      overflow="hidden"
      boxShadow={isHovered ? "2xl" : "md"}
      transform={isHovered ? "translateY(-8px)" : "translateY(0)"}
      transition="all 0.3s ease"
      cursor="pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onMovieClick && onMovieClick(movie)}
      position="relative"
      _hover={{
        ".overlay": { opacity: 1 },
        ".play-button": { transform: "scale(1)" },
      }}
    >
      {/* Movie Poster */}
      <Box position="relative">
        <Image
          src={getPosterUrl(movie.poster_path)}
          alt={movie.title}
          width="100%"
          height="400px"
          objectFit="cover"
          fallbackSrc="https://via.placeholder.com/300x450/2D3748/E2E8F0?text=No+Image"
        />

        {/* Rating Badge */}
        {movie.vote_average > 0 && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            colorScheme={getRatingColor(movie.vote_average)}
            borderRadius="full"
            px={2}
            py={1}
            fontSize="xs"
            fontWeight="bold"
          >
            <HStack spacing={1}>
              <Icon as={StarIcon} w={3} h={3} />
              <Text>{movie.vote_average.toFixed(1)}</Text>
            </HStack>
          </Badge>
        )}

        {/* Hover Overlay */}
        <Box
          className="overlay"
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          bg="blackAlpha.700"
          opacity={0}
          transition="opacity 0.3s"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <IconButton
            className="play-button"
            aria-label="Play trailer"
            icon={<BiPlay />}
            size="lg"
            colorScheme="brand"
            borderRadius="full"
            transform="scale(0.8)"
            transition="transform 0.2s"
            onClick={(e) => {
              e.stopPropagation();
              onTrailerClick && onTrailerClick(movie);
            }}
          />

        </Box>

        {/* Popularity Indicator */}
        {movie.popularity > 100 && (
          <Badge
            position="absolute"
            top={3}
            left={3}
            colorScheme="purple"
            variant="solid"
            borderRadius="md"
            fontSize="xs"
          >
            🔥 Trending
          </Badge>
        )}
      </Box>

      {/* Movie Info */}
      <VStack p={4} align="stretch" spacing={3}>
        <Text
          fontWeight="bold"
          fontSize="md"
          noOfLines={2}
          minHeight="48px"
          lineHeight="1.4"
        >
          {movie.title}
        </Text>

        <HStack justify="space-between" wrap="wrap">
          <HStack spacing={1} color={textColor} fontSize="sm">
            <Icon as={CalendarIcon} w={3} h={3} />
            <Text>{formatDate(movie.release_date)}</Text>
          </HStack>
          
          <HStack spacing={1} color={textColor} fontSize="sm">
            <Text>{Math.round(movie.popularity)} views</Text>
          </HStack>
        </HStack>

        {/* Overview Preview */}
        {movie.overview && (
          <Text
            fontSize="xs"
            color={textColor}
            noOfLines={2}
            lineHeight="1.4"
          >
            {movie.overview}
          </Text>
        )}

        {/* Action Buttons */}
        <HStack spacing={2} pt={2}>
          <Button
            size="sm"
            colorScheme="brand"
            variant="solid"
            flex={1}
            onClick={(e) => {
              e.stopPropagation();
              onMovieClick && onMovieClick(movie);
            }}
          >
            Details
          </Button>
          <Tooltip label="Add to Watchlist">
            <IconButton
              aria-label="Add to watchlist"
              icon={<AddIcon />}
              size="sm"
              variant="outline"
              colorScheme="brand"
              onClick={(e) => {
                e.stopPropagation();
                // Add watchlist functionality here
              }}
            />
          </Tooltip>
        </HStack>
      </VStack>
    </Box>
  );
};

export default EnhancedMovieCard;