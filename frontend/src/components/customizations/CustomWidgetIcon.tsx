import { Box, Button, Flex, FormControl, FormLabel, IconButton, Image, Text, VStack } from '@chakra-ui/react'
import { FiUpload, FiX } from 'react-icons/fi'
import { flowAtom, widgetAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
import config from '@config/config'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import produce from 'immer'

export default function CustomWidgetIcon() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()
  const [imgWarn, setImgWarn] = useState('')

  const handleChange = async (imageUrl: string) => {
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.customImage = imageUrl
    })

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.customImage = imageUrl
      }),
    )
    toaster(status, data)
  }

  const setWidgetImg = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        title: 'Media',
        button: { text: 'Select picture' },
        library: { type: 'image' },
        multiple: false,
      })

      imgSelectionFrame.on('select', () => {
        const attachment = imgSelectionFrame.state().get('selection').first().toJSON()
        handleChange(attachment.url)
        if (attachment.filesizeInBytes > 512000) {
          setImgWarn('⚠ Larger size image might slow down load time')
        }
      })

      imgSelectionFrame.open()
    }
  }

  return (
    <Box mt="6">
      <Flex gap="4" alignItems="center">
        <CustomImagePreview customImage={widget.styles?.customImage} removeImage={handleChange} />
        <Button onClick={setWidgetImg} leftIcon={<FiUpload />}>
          Browse
        </Button>
      </Flex>

      <Text mt="1" fontSize="sm" color="gray.500">
        image size 100 x 100px
      </Text>

      {imgWarn !== '' && (
        <Text mt="1" fontSize="sm" color="yellow.500">
          {imgWarn}
        </Text>
      )}
    </Box>
  )
}

type CustomImagePreviewProps = {
  customImage?: string
  removeImage: (imageUrl: string) => void
}

function CustomImagePreview({ customImage, removeImage }: CustomImagePreviewProps) {
  return (
    <>
      {customImage ? (
        <Box position="relative">
          <Image
            src={customImage}
            alt="Custom image"
            boxSize="14"
            objectFit="cover"
            objectPosition="center"
            border="1px"
            borderColor="gray.200"
          />
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
            onClick={() => removeImage('')}
          />
        </Box>
      ) : (
        <Box boxSize="14" bg="gray.200" rounded="sm" display="flex" alignItems="center" justifyContent="center">
          <Text fontSize="10px" color="gray.600">
            No Image
          </Text>
        </Box>
      )}
    </>
  )
}
