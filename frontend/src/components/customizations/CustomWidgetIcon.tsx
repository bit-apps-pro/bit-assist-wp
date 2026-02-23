import { Box, Button, Flex, IconButton, Image, Text } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { FiUpload, FiX } from 'react-icons/fi'

interface CustomImagePreviewProps {
  customImage?: string
  removeImage: (imageUrl: string) => void
}

export default function CustomWidgetIcon() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()
  const [imgWarn, setImgWarn] = useState('')

  const handleChange = async (imageUrl: string) => {
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.customImage = imageUrl
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.customImage = imageUrl
      })
    )
    toaster(status, data)
  }

  const setWidgetImg = () => {
    if (typeof wp !== 'undefined' && wp.media) {
      const imgSelectionFrame = wp.media({
        button: { text: __('Select picture') },
        library: { type: 'image' },
        multiple: false,
        title: __('Media')
      })

      imgSelectionFrame.on('select', () => {
        const attachment = imgSelectionFrame.state().get('selection').first().toJSON()
        handleChange(attachment.url)
        if (attachment.filesizeInBytes > 512_000) {
          setImgWarn(__('⚠ Larger size image might slow down load time'))
        }
      })

      imgSelectionFrame.open()
    }
  }

  return (
    <Box mt="6">
      <Flex alignItems="center" gap="4">
        <CustomImagePreview customImage={widget.styles?.customImage} removeImage={handleChange} />
        <Button leftIcon={<FiUpload />} onClick={setWidgetImg}>
          {__('Browse')}
        </Button>
      </Flex>

      <Text color="gray.500" fontSize="sm" mt="1">
        {__('image size 100 x 100px')}
      </Text>

      {imgWarn !== '' && (
        <Text color="yellow.500" fontSize="sm" mt="1">
          {imgWarn}
        </Text>
      )}
    </Box>
  )
}

function CustomImagePreview({ customImage, removeImage }: CustomImagePreviewProps) {
  return (
    <>
      {customImage ? (
        <Box position="relative">
          <Image
            alt={__('Custom image')}
            border="1px"
            borderColor="gray.200"
            boxSize="14"
            objectFit="cover"
            objectPosition="center"
            src={customImage}
          />
          <IconButton
            aria-label={__('Remove custom icon')}
            borderRadius="full"
            colorScheme="red"
            h="5"
            icon={<FiX />}
            minW="5"
            onClick={() => removeImage('')}
            position="absolute"
            right="-2"
            top="-1"
            w="5"
          />
        </Box>
      ) : (
        <Box
          alignItems="center"
          bg="gray.200"
          boxSize="14"
          display="flex"
          justifyContent="center"
          rounded="sm"
        >
          <Text color="gray.600" fontSize="10px">
            {__('No Image')}
          </Text>
        </Box>
      )}
    </>
  )
}
