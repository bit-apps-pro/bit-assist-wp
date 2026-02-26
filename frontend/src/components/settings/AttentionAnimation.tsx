import {
  Box,
  Select,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Switch,
  Text,
  Tooltip,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef, useState } from 'react'

function AttentionAnimation() {
  const [isEnabled, setIsEnabled] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const brandColorToggle = useColorModeValue('purple.500', 'purple.200')
  const textColorToggle = useColorModeValue('white', 'gray.800')
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  useEffect(() => {
    if (widget.styles?.animation_active === 1) {
      setIsEnabled(true)
    } else {
      setIsEnabled(false)
    }
  }, [widget.styles?.animation_active])

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked)
    const animationActive = e.target.checked ? 1 : 0

    // const animationDelay = e.target.checked ? 1 : 0

    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      if (prev.styles == undefined) {
        prev.styles = {}
      } else {
        prev.styles.animation_active = animationActive
      }
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        if (draft.styles != undefined) {
          draft.styles.animation_active = animationActive
        }
      })
    )
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const animationType = Number(e.target.value)
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      if (prev.styles == undefined) {
        prev.styles = {}
      } else {
        prev.styles.animation_type = animationType
      }
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        if (draft.styles != undefined) {
          draft.styles.animation_type = animationType
        }
      })
    )
    toaster(status, data)
  }

  const updateData = (value: number | string, key: string) => {
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles.animation_delay = { ...prev.styles?.animation_delay, [key]: value }
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.animation_delay = { ...draft.styles?.animation_delay, [key]: value }
      })
    )
  }

  const handleSliderChange = (value: number) => {
    updateData(value, 'delay')
  }
  return (
    <Box maxW="full" w="lg">
      <Title>
        {__('Attention Animation', 'bit-assist')}
        <Switch colorScheme="purple" isChecked={!!isEnabled} ml={4} onChange={handleSwitchEnable} />
      </Title>

      {isEnabled && (
        <VStack alignItems="flex-start" maxW="full" spacing="4" w="lg">
          <Select onChange={handleChange} value={widget.styles?.animation_type ?? ''}>
            <option value={1}>{__('Wiggle', 'bit-assist')}</option>
            <option value={2}>{__('Jump', 'bit-assist')}</option>
            <option value={3}>{__('Shock Wave', 'bit-assist')}</option>
          </Select>

          <Text>
            {__('Animation Delay:', 'bit-assist')} {widget.styles?.animation_delay?.delay ?? 0}{' '}
            {__('seconds', 'bit-assist')}
          </Text>
          <Slider
            colorScheme="purple"
            defaultValue={0}
            max={60}
            min={0}
            onChange={val => handleSliderChange(val)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            value={widget.styles?.animation_delay?.delay}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>

            <Tooltip
              bg={brandColorToggle}
              color={textColorToggle}
              hasArrow
              isOpen={showTooltip}
              label={`${widget.styles?.animation_delay?.delay ?? 0} ${__('seconds', 'bit-assist')}`}
              placement="top"
            >
              <SliderThumb bg={brandColorToggle} />
            </Tooltip>
          </Slider>
        </VStack>
      )}
    </Box>
  )
}

export default AttentionAnimation
