import { Box } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { __ } from '@helpers/i18nwrap'

function FontFamily() {
  return (
    <Box>
      <Title>{__('FontFamily')}</Title>
    </Box>
  )
}

export default FontFamily
