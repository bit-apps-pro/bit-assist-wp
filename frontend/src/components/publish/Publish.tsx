import { Box, Flex, Heading, HStack, Stack, Text, Tooltip } from '@chakra-ui/react'
import DocTutorials from '@components/global/DocTutorials'
import ProWrapper from '@components/global/ProWrapper'
import { __ } from '@helpers/i18nwrap'
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
          {__('Publish Widget on Any Platform')}
        </Heading>
        <Flex flexWrap="wrap" gap="2" justifyContent="center">
          <Platform label={__('Shopify')}>
            <Shopify />
          </Platform>
          <Platform label={__('Squarespace')}>
            <Squarespace />
          </Platform>
          <Platform label={__('Webflow')}>
            <Webflow />
          </Platform>
          <Platform label={__('Weebly')}>
            <Weebly />
          </Platform>
          <Platform label={__('Wix')}>
            <Wix />
          </Platform>
          <Platform label={__('Magento')}>
            <Magento />
          </Platform>
          <Platform label={__('Drupal')}>
            <Drupal />
          </Platform>
          <Platform label={__('Opencart')}>
            <Opencart />
          </Platform>
          <Platform label={__('HTML')}>
            <Html />
          </Platform>
          <Platform label={__('More')}>
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
            {__('Want to use this widget in other domain?')} <br /> {__('Follow these steps.')}
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
