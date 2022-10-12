import { CopyIcon } from '@chakra-ui/icons'
import { Box, Code, HStack, IconButton, Stack, Text, Tooltip } from '@chakra-ui/react'
import Title from '@components/global/Title'
import useToaster from '@hooks/useToaster'
import Domains from './Domains'

function Publish() {
  const toaster = useToaster()
  const cdnUrl = '<script defer src=\'http://wordpress.com/bit-assist.js\'></script>'

  const copy = async () => {
    await navigator.clipboard.writeText(cdnUrl)
    toaster('success', 'Copied')
  }

  return (
    <Stack gap={[5, 10]}>
      <Box>
        <Title badge="1">Add Bit Assist to your website</Title>
        <Text mb="2">
          Bit Assist can easily be installed using the below code snippet. Paste it just above the
          {' '}
          <Code>{'<body />'}</Code>
          {' '}
          tag.
        </Text>
        <HStack spacing={0} gap="2" flexWrap="wrap">
          <Code maxW="full">{cdnUrl}</Code>
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
