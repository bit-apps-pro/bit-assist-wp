/* eslint-disable unicorn/filename-case */
import { CopyIcon } from '@chakra-ui/icons'
import { Box, Code, HStack, IconButton, Text, Tooltip } from '@chakra-ui/react'
import Title from '@components/global/Title'
import config from '@config/config'
import { __, sprintf } from '@helpers/i18nwrap'
import useToaster from '@hooks/useToaster'

const unsecuredCopyToClipboard = (text: string) => {
  const textArea = document.createElement('textarea')
  textArea.value = text
  document.body.append(textArea)
  textArea.focus()
  textArea.select()
  try {
    document.execCommand('copy')
  } catch (error) {
    console.error('Unable to copy to clipboard', error)
  }
  textArea.remove()
}

export default function CDN() {
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1

  const cdnUrl = `
    <script type="text/javascript">
      var bit_assist_={ api: ${JSON.stringify(config.API_URL)}};
      (function () { var s=document.createElement('script'); s.type='text/javascript'; s.async=true; s.src='${
        config.ROOT_URL
      }/iframe/bit-assist.js'; t=document.getElementsByTagName('script')[0]; t.parentNode.insertBefore(s, t) })()
    </script>
  `

  const copy = () => {
    if (window.isSecureContext && navigator.clipboard) {
      navigator.clipboard.writeText(cdnUrl)
    } else {
      unsecuredCopyToClipboard(cdnUrl)
    }
    toaster('success', __('Copied'))
  }

  return (
    <Box>
      <Title badge="2">{__('Copy the script')}</Title>
      <Text mb="2">
        {sprintf(
          /* translators: %s: Brand name */
          __('%s can easily be installed using the below code snippet. Paste it just above the'),
          'Bit Assist'
        )}{' '}
        <Code>{'<body />'}</Code> {__('tag.')}
      </Text>
      <HStack gap="2" spacing={0}>
        <Code maxW="full" p="4" rounded="lg">
          {cdnUrl}
        </Code>
        <Tooltip label={__('Copy')}>
          <IconButton
            aria-label={__('Copy')}
            colorScheme="purple"
            icon={<CopyIcon />}
            onClick={copy}
            size="sm"
            tabIndex={tabIndex}
          />
        </Tooltip>
      </HStack>
    </Box>
  )
}
