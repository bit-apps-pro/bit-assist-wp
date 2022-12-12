import { Box, Button, Flex, FormControl, FormLabel, IconButton, Image, Text } from '@chakra-ui/react'
import { FiUpload, FiX } from 'react-icons/fi'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
import config from '@config/config'

export default function CustomIcon() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [imgWarn, setImgWarn] = useState('')

  const handleChanges = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }

      if (key === 'unique_id') {
        prev.config.url = value.toString()
      }
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
        handleChanges(attachment.url, 'channel_icon')
        if (attachment.filesizeInBytes > 512000) {
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
            src={flow.config?.channel_icon || ''}
            alt={flow.config.title || 'Custom channel icon'}
            boxSize="40px"
            borderRadius="full"
            objectFit="cover"
            objectPosition="center"
            fallbackSrc={`${config.ROOT_URL}/img/channel/${flow.channel_name.toLowerCase()}.svg`}
          />
          {flow.config?.channel_icon ? (
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
              onClick={() => handleChanges('', 'channel_icon')}
            />
          ) : null}
        </Box>
        <Button onClick={setChannelImg} leftIcon={<FiUpload />}>
          Browse
        </Button>
      </Flex>
      <Text mt="1" fontSize="sm" color="gray.500">
        image size 40 x 40px
      </Text>

      {imgWarn !== '' && (
        <Text mt="1" fontSize="sm" color="yellow.500">
          {imgWarn}
        </Text>
      )}
    </FormControl>
  )
}
