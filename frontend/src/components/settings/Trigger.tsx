import { Box } from '@chakra-ui/react'
import Title from '@components/global/Title'
import InitialDelay from '@components/settings/InitialDelay'
import PageScroll from '@components/settings/PageScroll'
import { __ } from '@wordpress/i18n'

function Trigger() {
  return (
    <Box>
      <Title>{__('Trigger Widget', 'bit-assist')}</Title>
      <InitialDelay />
      <PageScroll />
    </Box>
  )
}

export default Trigger
