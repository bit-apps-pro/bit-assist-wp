import { Box, SimpleGrid, Tooltip, useColorModeValue, useToast } from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'

const WidgetPositions = () => {
  const grayColorToggle = useColorModeValue('gray.200', 'gray.700')
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')

  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()

  const handleChange = async (e) => {
    const position = e.target.getAttribute('data-position')

    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.position = position
    })

    const response: any = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.position = position
      })
    )
    ResponseToast({ toast, response, action: 'update', messageFor: 'Widget position' })
  }

  return (
    <Box>
      <Title>Widget Position</Title>
      <SimpleGrid columns={3} spacing={2} width="20">
        <Tooltip label="Top Left" placement="left">
          <Box
            height="6"
            cursor="pointer"
            borderWidth="2px"
            data-position="top-left"
            onClick={handleChange}
            bg={`${widget.styles?.position === 'top-left' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'top-left' && brandColorToggle}`}
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
          />
        </Tooltip>
        <Box bg={grayColorToggle} height="6" />
        <Tooltip label="Top Right" placement="right">
          <Box
            height="6"
            cursor="pointer"
            borderWidth="2px"
            data-position="top-right"
            onClick={handleChange}
            bg={`${widget.styles?.position === 'top-right' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'top-right' && brandColorToggle}`}
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
          />
        </Tooltip>
        <Box bg={grayColorToggle} height="6" />
        <Box bg={grayColorToggle} height="6" />
        <Box bg={grayColorToggle} height="6" />
        <Tooltip label="Bottom Left" placement="left">
          <Box
            height="6"
            cursor="pointer"
            borderWidth="2px"
            data-position="bottom-left"
            onClick={handleChange}
            bg={`${widget.styles?.position === 'bottom-left' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'bottom-left' && brandColorToggle}`}
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
          />
        </Tooltip>
        <Box bg={grayColorToggle} height="6" />
        <Tooltip label="Bottom Right" placement="right">
          <Box
            height="6"
            cursor="pointer"
            borderWidth="2px"
            data-position="bottom-right"
            onClick={handleChange}
            bg={`${widget.styles?.position === 'bottom-right' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'bottom-right' && brandColorToggle}`}
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
          />
        </Tooltip>
      </SimpleGrid>
    </Box>
  )
}

export default WidgetPositions
