import { CopyIcon } from '@chakra-ui/icons'
import { Box, Code, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react'
import Title from '@components/global/Title'
import useToaster from '@hooks/useToaster'
import config from '@config/config'

export default function CDN() {
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1

  const cdnUrl = `
    <script>
      var bit_assist_={host: ${JSON.stringify(config.ROOT_URL)},api: ${JSON.stringify(config.API_URL)}}
      var d=document;s=d.createElement('script');s.type='text/javascript';s.defer=true;s.src='${config.ROOT_URL}/iframe/bit-assist.js';t=d.getElementsByTagName('script')[0];t.parentNode.insertBefore(s, t)
    </script>
  `

  const unsecuredCopyToClipboard = (text: string) => {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    try { document.execCommand('copy') } catch (err) { console.error('Unable to copy to clipboard', err) }
    document.body.removeChild(textArea)
  }

  const copy = () => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(cdnUrl)
    } else {
      unsecuredCopyToClipboard(cdnUrl)
    }
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
      <HStack spacing={0} gap="2">
        <Code maxW="full" p='4' rounded='lg'>{cdnUrl}</Code>
        <Tooltip label="Copy">
          <IconButton colorScheme="purple" icon={<CopyIcon />} size="sm" aria-label="Copy" onClick={copy} tabIndex={tabIndex} />
        </Tooltip>
      </HStack>
    </Box>
  )
}
