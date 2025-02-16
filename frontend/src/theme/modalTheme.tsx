/* eslint-disable import/no-extraneous-dependencies */
import { modalAnatomy as parts } from '@chakra-ui/anatomy'
import { createMultiStyleConfigHelpers } from '@chakra-ui/styled-system'

const { defineMultiStyleConfig, definePartsStyle } = createMultiStyleConfigHelpers(parts.keys)

const baseStyle = definePartsStyle({
  dialogContainer: {
    zIndex: 9999
  },
  overlay: {
    backdropFilter: 'blur(1px)',
    zIndex: 9998
  }
})

export const modalTheme = defineMultiStyleConfig({ baseStyle })
