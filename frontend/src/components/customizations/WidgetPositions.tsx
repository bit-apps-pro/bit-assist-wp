import { Box, SimpleGrid, Tooltip, useColorModeValue } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import CustomizePosition from '@components/customizations/CustomizePosition'

function WidgetPositions() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()
  const grayColorToggle = useColorModeValue('gray.200', 'gray.700')
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')

  const handleChange = async (position: string) => {
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.position = position
    })

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.position = position
      }),
    )
    toaster(status, data)
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
            onClick={() => handleChange('top-left')}
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
            onClick={() => handleChange('top-right')}
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
            onClick={() => handleChange('bottom-left')}
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
            onClick={() => handleChange('bottom-right')}
            bg={`${widget.styles?.position === 'bottom-right' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'bottom-right' && brandColorToggle}`}
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
          />
        </Tooltip>
      </SimpleGrid>

      <CustomizePosition />
    </Box>
  )
}

export default WidgetPositions
