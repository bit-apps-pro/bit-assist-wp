import { Box } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { __ } from '@wordpress/i18n'

function FontFamily() {
  return (
    <Box>
      <Title>{__('FontFamily', 'bit-assist')}</Title>
    </Box>
  )
}

export default FontFamily
