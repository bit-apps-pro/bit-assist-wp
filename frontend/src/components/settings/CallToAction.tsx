import {
  Box,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __, sprintf } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'

function CallToAction() {
  const [showTooltip, setShowTooltip] = useState(false)
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const textColorToggle = useColorModeValue('white', 'gray.800')

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const updateData = (val: number | string, key: string) => {
    setWidget(prev => {
      if (prev.call_to_action === null) {
        prev.call_to_action = {}
      }
      prev.call_to_action = { ...prev.call_to_action, [key]: val }
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.call_to_action === null) {
          draft.call_to_action = {}
        }
        draft.call_to_action = { ...draft.call_to_action, [key]: val }
      })
    )
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateData(e.target.value, 'text')
  }

  const handleSliderChange = (val: number) => {
    updateData(val, 'delay')
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  return (
    <Box>
      <Title>{__('Call To Action', 'bit-assist')}</Title>

      <VStack alignItems="flex-start" maxW="full" spacing="4" w="lg">
        <Text>
          {sprintf(
            // translators: %s: Delay in seconds
            __('Display a call to action message next to widget after %s seconds.', 'bit-assist'),
            widget.call_to_action?.delay ?? 0
          )}
        </Text>
        <Slider
          colorScheme="purple"
          defaultValue={0}
          max={60}
          min={0}
          onChange={val => handleSliderChange(val)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          value={widget.call_to_action?.delay}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <Tooltip
            bg={brandColorToggle}
            color={textColorToggle}
            hasArrow
            isOpen={showTooltip}
            label={`${widget.call_to_action?.delay ?? 0} ${__('seconds', 'bit-assist')}`}
            placement="top"
          >
            <SliderThumb bg={brandColorToggle} />
          </Tooltip>
        </Slider>
        <Textarea
          color="inherit"
          onChange={handleChange}
          placeholder={__('Message', 'bit-assist')}
          value={widget.call_to_action?.text ?? ''}
        />
      </VStack>
    </Box>
  )
}

export default CallToAction
