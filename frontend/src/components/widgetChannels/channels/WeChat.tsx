import { Box, Button, FormControl, FormLabel, IconButton, Image, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { type WidgetChannelConfig } from '@globalStates/Interfaces'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'

import CardColors from './common/CardColors'

export default function WeChat() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [imgWarn, setImgWarn] = useState('')

  const handleChanges: KeyedValueHandler<WidgetChannelConfig> = (key, value) => {
    setFlow(prev => {
      prev.config[key] = value
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
        handleChanges('url', attachment.url)
        if (attachment.filesizeInBytes > 512_000) {
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
          <Box boxSize={100} mb={2} position="relative">
            <Image
              alt={flow.config.title || 'Custom channel icon'}
              aria-required="true"
              boxSize="inherit"
              fallback={<Box bg="gray.200" boxSize="inherit" color="gray.400" />}
              objectFit="cover"
              objectPosition="center"
              src={flow.config?.url || ''}
            />
            {flow.config?.url ? (
              <IconButton
                aria-label="remove custom icon"
                borderRadius="full"
                colorScheme="red"
                h="5"
                icon={<FiX />}
                minW="5"
                onClick={() => handleChanges('url', '')}
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
        </div>

        {imgWarn !== '' && (
          <Text color="yellow.500" fontSize="sm" mt="1">
            {imgWarn}
          </Text>
        )}
      </FormControl>

      <CardColors bg="#2DC100" color="#fff" />
    </>
  )
}
