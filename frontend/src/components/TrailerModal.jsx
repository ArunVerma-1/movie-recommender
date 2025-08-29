import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  AspectRatio,
  Text,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import axios from 'axios';

const TrailerModal = ({ isOpen, onClose, movie }) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const bgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    if (isOpen && movie?.id) {
      fetchTrailer(movie.id);
    }
  }, [isOpen, movie]);

  const fetchTrailer = async (movieId) => {
    setLoading(true);
    setError(null);
    setTrailerKey(null);

    try {
      // We'll add this endpoint to backend later
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/movies/${movieId}/videos`
      );
      
      const videos = response.data;
      const trailer = videos.find(
        video => video.type === 'Trailer' && video.site === 'YouTube'
      ) || videos.find(video => video.site === 'YouTube');

      if (trailer) {
        setTrailerKey(trailer.key);
      } else {
        setError('No trailer available for this movie');
      }
    } catch (err) {
      console.error('Error fetching trailer:', err);
      setError('Failed to load trailer');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setTrailerKey(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" isCentered>
      <ModalOverlay bg="blackAlpha.800" backdropFilter="blur(10px)" />
      <ModalContent bg={bgColor} borderRadius="2xl" overflow="hidden">
        <ModalHeader>
          {movie?.title} - Official Trailer
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody p={0}>
          {loading && (
            <Center h="400px">
              <Spinner size="lg" color="brand.500" />
              <Text ml={4}>Loading trailer...</Text>
            </Center>
          )}
          
          {error && (
            <Center h="400px" p={6}>
              <Alert status="error" borderRadius="lg">
                <AlertIcon />
                {error}
              </Alert>
            </Center>
          )}
          
          {trailerKey && (
            <AspectRatio ratio={16 / 9}>
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Movie Trailer"
                allowFullScreen
                style={{ border: 'none' }}
              />
            </AspectRatio>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default TrailerModal;