import { CopyIcon } from '@chakra-ui/icons'
import { Box, Code, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react'
import Title from '@components/global/Title'
import useToaster from '@hooks/useToaster'

export default function CDN() {
  const toaster = useToaster()
  const cdnUrl = '<script defer src=\'http://wordpress.com/bit-assist.js\'></script>'

  const copy = async () => {
    await navigator.clipboard.writeText(cdnUrl)
    toaster('success', 'Copied')
  }

  return (
    <Box>
      <Title badge="2">Copy the script </Title>
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
  )
}
