import { Box } from '@chakra-ui/react'
import Title from '@components/global/Title'
import InitialDelay from '@components/settings/InitialDelay'
import PageScroll from '@components/settings/PageScroll'
import { __ } from '@helpers/i18nwrap'

function Trigger() {
  return (
    <Box>
      <Title>{__('Trigger Widget')}</Title>
      <InitialDelay />
      <PageScroll />
    </Box>
  )
}

export default Trigger
