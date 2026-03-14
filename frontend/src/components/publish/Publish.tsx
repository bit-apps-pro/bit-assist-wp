import { Box, Flex, Heading, HStack, Stack, Text, Tooltip } from '@chakra-ui/react'
import DocTutorials from '@components/global/DocTutorials'
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
import { __ } from '@wordpress/i18n'

import CDN from './CDN'
import Domains from './Domains'

interface PlatformProps {
  children: React.ReactNode
  label: string
}

function Platform({ children, label }: PlatformProps) {
  return (
    <Tooltip hasArrow label={label} placement="top">
      <Flex alignItems="center" borderWidth={1} h="16" justifyContent="center" p="4" rounded="lg" w="16">
        {children}
      </Flex>
    </Tooltip>
  )
}

function Publish() {
  return (
    <Stack gap={[5, 6]}>
      <Box textAlign="center">
        <Heading as="h4" mb="4" size="md">
          {__('Publish Widget on Any Platform', 'bit-assist')}
        </Heading>
        <Flex flexWrap="wrap" gap="2" justifyContent="center">
          <Platform label={__('Shopify', 'bit-assist')}>
            <Shopify />
          </Platform>
          <Platform label={__('Squarespace', 'bit-assist')}>
            <Squarespace />
          </Platform>
          <Platform label={__('Webflow', 'bit-assist')}>
            <Webflow />
          </Platform>
          <Platform label={__('Weebly', 'bit-assist')}>
            <Weebly />
          </Platform>
          <Platform label={__('Wix', 'bit-assist')}>
            <Wix />
          </Platform>
          <Platform label={__('Magento', 'bit-assist')}>
            <Magento />
          </Platform>
          <Platform label={__('Drupal', 'bit-assist')}>
            <Drupal />
          </Platform>
          <Platform label={__('Opencart', 'bit-assist')}>
            <Opencart />
          </Platform>
          <Platform label={__('HTML', 'bit-assist')}>
            <Html />
          </Platform>
          <Platform label={__('More', 'bit-assist')}>
            <More />
          </Platform>
        </Flex>
      </Box>
      <Box>
        <DocTutorials docLink="https://bitapps.pro/docs/bit-assist/external-publish/" />
        <HStack justifyContent="space-between">
          <Text
            borderColor="purple.500"
            borderLeft="4px"
            fontSize="md"
            fontWeight="medium"
            mb={4}
            px="3"
            py="1"
          >
            {__('Want to use this widget in other domain?', 'bit-assist')} <br />{' '}
            {__('Follow these steps.', 'bit-assist')}
          </Text>
        </HStack>
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
