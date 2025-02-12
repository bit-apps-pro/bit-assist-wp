import { Box, Button, Flex, FormControl, FormLabel, IconButton, Image, Text } from '@chakra-ui/react'
import channelList from '@components/widgetChannels/ChannelList'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'

export default function CustomIcon() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [imgWarn, setImgWarn] = useState('')

  const handleChanges = (value: boolean | number | string, key: string) => {
    setFlow(prev => {
      prev.config = { ...prev.config, [key]: value }

      if (key === 'unique_id') {
        prev.config.url = value.toString()
      }
    })
  }

  const setChannelImg = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        button: { text: 'Select picture' },
        library: { type: 'image' },
        multiple: false,
        title: __('Media')
      })

      imgSelectionFrame.on('select', () => {
        const attachment = imgSelectionFrame.state().get('selection').first().toJSON()
        handleChanges(attachment.url, 'channel_icon')
        if (attachment.filesizeInBytes > 512_000) {
          setImgWarn('⚠ Larger size image might slow down load time')
        }
      })

      imgSelectionFrame.open()
    }
  }

  return (
    <FormControl>
      <FormLabel>Custom image</FormLabel>

      <Flex gap="4">
        <Box position="relative">
          <Image
            alt={flow.config.title || 'Custom channel icon'}
            borderRadius="full"
            boxSize="40px"
            fallbackSrc={channelList.find(c => c.name === flow.channel_name)?.icon || ''}
            objectFit="cover"
            objectPosition="center"
            src={flow.config?.channel_icon || ''}
          />
          {flow.config?.channel_icon ? (
            <IconButton
              aria-label="remove custom icon"
              borderRadius="full"
              colorScheme="red"
              h="5"
              icon={<FiX />}
              minW="5"
              onClick={() => handleChanges('', 'channel_icon')}
              position="absolute"
              right="-2"
              top="-1"
              w="5"
            />
          ) : undefined}
        </Box>
        <Button leftIcon={<FiUpload />} onClick={setChannelImg}>
          Browse
        </Button>
      </Flex>
      <Text color="gray.500" fontSize="sm" mt="1">
        image size 40 x 40px
      </Text>

      {imgWarn !== '' && (
        <Text color="yellow.500" fontSize="sm" mt="1">
          {imgWarn}
        </Text>
      )}
    </FormControl>
  )
}
