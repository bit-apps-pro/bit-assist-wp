import { Box, Button, FormControl, FormLabel, IconButton, Image, Text } from '@chakra-ui/react'
import OpenWindowAction from '@components/widgetChannels/channels/OpenWindowAction'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'
import CardColors from './common/CardColors'
import { WidgetChannelConfig } from '@globalStates/Interfaces'

export default function WeChat() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [imgWarn, setImgWarn] = useState('')

  const handleChanges: KeyedValueHandler<WidgetChannelConfig> = (key, value) => {
    setFlow((prev) => {
      prev.config[key] = value
    })
  }

  const setChannelImg = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        title: 'Media',
        button: { text: 'Select picture' },
        library: { type: 'image' },
        multiple: false,
      })

      imgSelectionFrame.on('select', () => {
        const attachment = imgSelectionFrame.state().get('selection').first().toJSON()
        handleChanges('url', attachment.url)
        if (attachment.filesizeInBytes > 512000) {
          setImgWarn('⚠ Larger size image might slow down load time')
        }
      })

      imgSelectionFrame.open()
    }
  }

  return (
    <>
      <FormControl isRequired>
        <FormLabel>WeChat QR Code</FormLabel>

        <div>
          <Box position="relative" mb={2} boxSize={100}>
            <Image
              aria-required="true"
              src={flow.config?.url || ''}
              alt={flow.config.title || 'Custom channel icon'}
              boxSize="inherit"
              objectFit="cover"
              objectPosition="center"
              fallback={<Box boxSize="inherit" bg="gray.200" color="gray.400" />}
            />
            {flow.config?.url ? (
              <IconButton
                aria-label="remove custom icon"
                icon={<FiX />}
                borderRadius="full"
                colorScheme="red"
                h="5"
                minW="5"
                w="5"
                position="absolute"
                top="-1"
                right="-2"
                onClick={() => handleChanges('url', '')}
              />
            ) : null}
          </Box>
          <Button onClick={setChannelImg} leftIcon={<FiUpload />}>
            Browse
          </Button>
        </div>

        {imgWarn !== '' && (
          <Text mt="1" fontSize="sm" color="yellow.500">
            {imgWarn}
          </Text>
        )}
      </FormControl>

      <CardColors bg="#2DC100" color="#fff" />
    </>
  )
}
