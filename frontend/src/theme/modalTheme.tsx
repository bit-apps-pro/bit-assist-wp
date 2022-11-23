import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { definePartsStyle, defineMultiStyleConfig } = createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  overlay: {
    zIndex: 9998,
    backdropFilter: 'blur(1px)',
  },
  dialogContainer: {
    zIndex: 9999,
  }
})

export const modalTheme = defineMultiStyleConfig({ baseStyle })