import { IconButton, useColorMode, useColorModeValue, Tooltip } from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';

const DarkModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverColor = useColorModeValue('gray.100', 'gray.700');

  return (
    <Tooltip label={`Switch to ${colorMode === 'light' ? 'dark' : 'light'} mode`}>
      <IconButton
        aria-label="Toggle dark mode"
        icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
        onClick={toggleColorMode}
        variant="ghost"
        size="md"
        bg={bgColor}
        _hover={{ bg: hoverColor }}
        borderRadius="full"
        transition="all 0.2s"
      />
    </Tooltip>
  );
};

export default DarkModeToggle;