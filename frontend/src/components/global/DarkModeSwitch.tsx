import { useColorMode, IconButton } from '@chakra-ui/react'
import { SunIcon, MoonIcon } from '@chakra-ui/icons'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'

export const DarkModeSwitch = () => {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'
  return (
    <IconButton
      icon={isDark ? <HiOutlineSun size={26} /> : <HiOutlineMoon size={25} />}
      aria-label="Toggle Theme"
      variant="ghost"
      colorScheme="purple"
      isRound={true}
      onClick={toggleColorMode}
    />
  )
}
