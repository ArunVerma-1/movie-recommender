import {
  Box,
  Container,
  Flex,
  Heading,
  HStack,
  Button,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Badge,
  Spacer,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { SearchIcon, BellIcon } from '@chakra-ui/icons';
import DarkModeToggle from './DarkModeToggle';

const Header = ({ onSearchClick }) => {
  const bgColor = useColorModeValue('white', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.600', 'gray.300');
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box 
      as="header" 
      bg={bgColor} 
      borderBottom="1px solid" 
      borderColor={borderColor}
      position="sticky"
      top={0}
      zIndex={1000}
      backdropFilter="blur(10px)"
      boxShadow="sm"
    >
      <Container maxW="container.xl" py={4}>
        <Flex align="center" justify="space-between">
          {/* Logo */}
          <HStack spacing={2}>
            <Box
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              borderRadius="lg"
              p={2}
              color="white"
              fontWeight="bold"
              fontSize="lg"
            >
              👀
            </Box>
            <Heading 
              size={isMobile ? "md" : "lg"} 
              bgGradient="linear(to-r, #667eea, #764ba2)"
              bgClip="text"
              fontWeight="extrabold"
            >
              WatchThis
            </Heading>
          </HStack>

          {/* Desktop Navigation */}
          {!isMobile && (
            <HStack spacing={6}>
              <Button variant="ghost" color={textColor} _hover={{ color: 'brand.500' }}>
                Discover
              </Button>
              <Button variant="ghost" color={textColor} _hover={{ color: 'brand.500' }}>
                Movies
              </Button>
              <Button variant="ghost" color={textColor} _hover={{ color: 'brand.500' }}>
                TV Shows
              </Button>
              <Button variant="ghost" color={textColor} _hover={{ color: 'brand.500' }}>
                Trending
              </Button>
            </HStack>
          )}

          <Spacer />

          {/* Right Side Actions */}
          <HStack spacing={3}>
            <IconButton
              aria-label="Search"
              icon={<SearchIcon />}
              variant="ghost"
              size="md"
              onClick={onSearchClick}
              _hover={{ bg: 'brand.50', color: 'brand.500' }}
            />
            
            <Box position="relative">
              <IconButton
                aria-label="Notifications"
                icon={<BellIcon />}
                variant="ghost"
                size="md"
                _hover={{ bg: 'brand.50', color: 'brand.500' }}
              />
              <Badge
                position="absolute"
                top="-1px"
                right="-1px"
                colorScheme="red"
                borderRadius="full"
                fontSize="xs"
                minH="18px"
                minW="18px"
              >
                3
              </Badge>
            </Box>

            <DarkModeToggle />

            {/* User Menu */}
            <Menu>
              <MenuButton>
                <Avatar size="sm" name="User" bg="brand.500" />
              </MenuButton>
              <MenuList>
                <MenuItem>Profile</MenuItem>
                <MenuItem>Watchlist</MenuItem>
                <MenuItem>Settings</MenuItem>
                <MenuItem>Sign Out</MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;