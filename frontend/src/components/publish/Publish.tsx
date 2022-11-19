import { Box, Flex, Heading, Stack, Text, Tooltip } from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import Drupal from '@icons/Drupal'
import Html from '@icons/Html'
import Magento from '@icons/Magento'
import More from '@icons/More'
import Opencart from '@icons/Opencart'
import Shopify from '@icons/Shopify'
import Squarespace from '@icons/Squarespace'
import Webflow from '@icons/Webflow'
import Weebly from '@icons/Weebly'
import Wix from '@icons/Wix'
import CDN from './CDN'
import Domains from './Domains'

interface PlatformProps { children: React.ReactNode, label: string }

function Platform({ children, label }: PlatformProps) {
  return (
    <Tooltip placement='top' hasArrow label={label}>
      <Flex justifyContent="center" alignItems="center" rounded='lg' h="16" w="16" borderWidth={1} p='4'>
        {children}
      </Flex>
    </Tooltip>
  )
}

function Publish() {
  return (
    <Stack gap={[5, 6]}>
      <Box textAlign='center'>
        <Heading as='h4' size="md" mb='4'>
          Publish Widget on Any Platform
        </Heading>
        <Flex justifyContent='center' flexWrap='wrap' gap='2'>
          <Platform label='Shopify'><Shopify /></Platform>
          <Platform label='Squarespace'><Squarespace /></Platform>
          <Platform label='Webflow'><Webflow /></Platform>
          <Platform label='Weebly'><Weebly /></Platform>
          <Platform label='Wix'><Wix /></Platform>
          <Platform label='Magento'><Magento /></Platform>
          <Platform label='Drupal'><Drupal /></Platform>
          <Platform label='Opencart'><Opencart /></Platform>
          <Platform label='HTML'><Html /></Platform>
          <Platform label='More'><More /></Platform>
        </Flex>
      </Box>
      <Box>
        <Text mb={4} py="1" px="3" borderLeft="4px" borderColor="purple.500" fontWeight="medium" fontSize="md">
          Want to use this widget in other domain? <br /> Follow these steps.
        </Text>
        <ProWrapper>
          <Stack gap={[5, 6]}>
            <Domains />
            <CDN />
          </Stack>
        </ProWrapper>
      </Box>
    </Stack>
  )
}

export default Publish
