/* eslint-disable react/no-children-prop */
import { CopyIcon } from '@chakra-ui/icons'
import { Box, Code, HStack, IconButton, Stack, Text, Tooltip, useToast } from '@chakra-ui/react'
import Title from '@components/global/Title'
import Domains from './Domains'

const Publish = () => {
  const toast = useToast({ isClosable: true })
  const cdnUrl = `<script defer src='http://wordpress.com/bit-assist.js'></script>`

  const copy = async () => {
    await navigator.clipboard.writeText(cdnUrl)
    toast({ title: 'Copied', status: 'success', position: 'top-right' })
  }

  return (
    <Stack gap={[5, 10]}>
      <Box>
        <Title badge="1">Add Bit Assist to your website</Title>
        <Text mb="2">
          Bit Assist can easily be installed using the below code snippet. Paste it just above the <Code children="</body>" /> tag.
        </Text>
        <HStack spacing={0} gap="2" flexWrap={'wrap'}>
          <Code maxW="full" children={cdnUrl} />
          <Tooltip label="Copy">
            <IconButton colorScheme="purple" icon={<CopyIcon />} size="sm" aria-label="Copy" onClick={copy} />
          </Tooltip>
        </HStack>
      </Box>

      <Box>
        <Title badge="2">Add Domains</Title>
        <Domains />
      </Box>
    </Stack>
  )
}

export default Publish
