import { Box, HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

export default function CustomizePosition() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>, key: 'top' | 'bottom' | 'left' | 'right') => {
    const val = Number(e.target.value)
    if (val > 400) {
      toaster('warning', 'Please enter a valid number')
      return
    }

    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles[key] = val
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles[key] = val
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

  if (typeof widget.styles?.position === 'undefined') {
    return null
  }

  return (
    <Box mt="4">
      {widget.styles.position.indexOf('left') > -1 && (
        <PositionInput position="left" value={widget.styles?.left || 0} onChange={handleChange} />
      )}
      {widget.styles.position.indexOf('right') > -1 && (
        <PositionInput position="right" value={widget.styles?.right || 0} onChange={handleChange} />
      )}
      {widget.styles.position.indexOf('top') > -1 && (
        <PositionInput position="top" value={widget.styles?.top || 0} onChange={handleChange} />
      )}
      {widget.styles.position.indexOf('bottom') > -1 && (
        <PositionInput position="bottom" value={widget.styles?.bottom || 0} onChange={handleChange} />
      )}
    </Box>
  )
}

type PositionInputProps = {
  position: 'top' | 'bottom' | 'left' | 'right'
  value: number
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: 'top' | 'bottom' | 'left' | 'right') => void
}

function PositionInput({ position, value, onChange }: PositionInputProps) {
  return (
    <HStack mt="2">
      <Text w="16" textTransform="capitalize">
        {position}
      </Text>
      <InputGroup>
        <Input w="28" min="0" placeholder={position} value={value} onChange={(e) => onChange(e, position)} />
        <InputRightAddon children="px" />
      </InputGroup>
    </HStack>
  )
}
