import { IconButton, useColorMode } from '@chakra-ui/react'
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi'

export default function DarkModeSwitch() {
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <IconButton
      aria-label="Toggle Theme"
      colorScheme="purple"
      icon={isDark ? <HiOutlineSun size={26} /> : <HiOutlineMoon size={25} />}
      isRound
      onClick={toggleColorMode}
      variant="ghost"
    />
  )
}
