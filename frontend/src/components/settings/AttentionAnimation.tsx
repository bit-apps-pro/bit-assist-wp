import {
  Select,
  Box,
  Input,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
  Switch,
} from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
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

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked)
    const animationActive = e.target.checked ? 1 : 0

    // const animationDelay = e.target.checked ? 1 : 0

    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles != null ? (prev.styles.animation_active = animationActive) : (prev.styles = {})
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        if (draft.styles != null) {
          draft.styles.animation_active = animationActive
        }
      }),
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const { status, data } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000),
  ).current

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget],
  )

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const animationType = Number(e.target.value)
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles != null ? (prev.styles.animation_type = animationType) : (prev.styles = {})
    })

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        if (draft.styles != null) {
          draft.styles.animation_type = animationType
        }
      }),
    )
    toaster(status, data)
  }

  const handleSliderChange = (value: number) => {
    updateData(value, 'delay')
  }

  const updateData = (value: string | number, key: string) => {
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.animation_delay = { ...prev.styles?.animation_delay, [key]: value }
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.animation_delay = { ...draft.styles?.animation_delay, [key]: value }
      }),
    )
  }

  return (
    <Box w="lg" maxW="full">
      <Title>
        Attention Animation
        <Switch ml={4} isChecked={!!isEnabled} colorScheme="purple" onChange={handleSwitchEnable} />
      </Title>

      {isEnabled && (
        <VStack spacing="4" alignItems="flex-start" w="lg" maxW="full">
          <Select value={widget.styles?.animation_type ?? ''} onChange={handleChange}>
            <option value={1}>Wiggle</option>
            <option value={2}>Jump</option>
            <option value={3}>Shock Wave</option>
            <option value={4}>Glow</option>
          </Select>

          <Text>Animation Delay: {widget.styles?.animation_delay?.delay ?? 0} seconds.</Text>
          <Slider
            defaultValue={0}
            value={widget.styles?.animation_delay?.delay}
            min={0}
            max={60}
            colorScheme="purple"
            onChange={(val) => handleSliderChange(val)}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
          >
            <SliderTrack>
              <SliderFilledTrack />
            </SliderTrack>

            <Tooltip
              hasArrow
              bg={brandColorToggle}
              color={textColorToggle}
              placement="top"
              isOpen={showTooltip}
              label={`${widget.styles?.animation_delay?.delay ?? 0} sec`}
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
