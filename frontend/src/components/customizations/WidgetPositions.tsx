import { Box, SimpleGrid, Tooltip, useColorModeValue } from '@chakra-ui/react'
import CustomizePosition from '@components/customizations/CustomizePosition'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'

function WidgetPositions() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()
  const grayColorToggle = useColorModeValue('gray.200', 'gray.700')
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')

  const handleChange = async (position: string) => {
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.position = position
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.position = position
      })
    )
    toaster(status, data)
  }

  return (
    <Box>
      <Title>{__('Widget Position', 'bit-assist')}</Title>
      <SimpleGrid columns={3} spacing={2} width="20">
        <Tooltip label={__('Top Left', 'bit-assist')} placement="left">
          <Box
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
            bg={`${widget.styles?.position === 'top-left' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'top-left' && brandColorToggle}`}
            borderWidth="2px"
            cursor="pointer"
            height="6"
            onClick={() => handleChange('top-left')}
          />
        </Tooltip>
        <Box bg={grayColorToggle} height="6" />
        <Tooltip label={__('Top Right', 'bit-assist')} placement="right">
          <Box
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
            bg={`${widget.styles?.position === 'top-right' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'top-right' && brandColorToggle}`}
            borderWidth="2px"
            cursor="pointer"
            height="6"
            onClick={() => handleChange('top-right')}
          />
        </Tooltip>
        <Box bg={grayColorToggle} height="6" />
        <Box bg={grayColorToggle} height="6" />
        <Box bg={grayColorToggle} height="6" />
        <Tooltip label={__('Bottom Left', 'bit-assist')} placement="left">
          <Box
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
            bg={`${widget.styles?.position === 'bottom-left' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'bottom-left' && brandColorToggle}`}
            borderWidth="2px"
            cursor="pointer"
            height="6"
            onClick={() => handleChange('bottom-left')}
          />
        </Tooltip>
        <Box bg={grayColorToggle} height="6" />
        <Tooltip label={__('Bottom Right', 'bit-assist')} placement="right">
          <Box
            _hover={{ bg: brandColorToggle, borderColor: brandColorToggle }}
            bg={`${widget.styles?.position === 'bottom-right' && brandColorToggle}`}
            borderColor={`${widget.styles?.position === 'bottom-right' && brandColorToggle}`}
            borderWidth="2px"
            cursor="pointer"
            height="6"
            onClick={() => handleChange('bottom-right')}
          />
        </Tooltip>
      </SimpleGrid>

      <CustomizePosition />
    </Box>
  )
}

export default WidgetPositions
