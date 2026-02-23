import { Box, HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

interface PositionInputProps {
  onChange: (e: React.ChangeEvent<HTMLInputElement>, key: 'bottom' | 'left' | 'right' | 'top') => void
  position: 'bottom' | 'left' | 'right' | 'top'
  value: number
}

export default function CustomizePosition() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    key: 'bottom' | 'left' | 'right' | 'top'
  ) => {
    const val = Number(e.target.value)
    if (val > 400) {
      toaster('warning', __('Please enter a valid number'))
      return
    }

    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles[key] = val
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles[key] = val
      })
    )
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  if (widget.styles?.position === undefined) {
    return
  }

  return (
    <Box mt="4">
      {widget.styles.position.includes('left') && (
        <PositionInput onChange={handleChange} position="left" value={widget.styles?.left || 0} />
      )}
      {widget.styles.position.includes('right') && (
        <PositionInput onChange={handleChange} position="right" value={widget.styles?.right || 0} />
      )}
      {widget.styles.position.includes('top') && (
        <PositionInput onChange={handleChange} position="top" value={widget.styles?.top || 0} />
      )}
      {widget.styles.position.includes('bottom') && (
        <PositionInput onChange={handleChange} position="bottom" value={widget.styles?.bottom || 0} />
      )}
    </Box>
  )
}

const positionLabels: Record<'bottom' | 'left' | 'right' | 'top', string> = {
  bottom: __('bottom'),
  left: __('left'),
  right: __('right'),
  top: __('top')
}

function PositionInput({ onChange, position, value }: PositionInputProps) {
  const label = positionLabels[position]
  return (
    <HStack mt="2">
      <Text textTransform="capitalize" w="16">
        {label}
      </Text>
      <InputGroup>
        <Input min="0" onChange={e => onChange(e, position)} placeholder={label} value={value} w="28" />
        <InputRightAddon>{__('px')}</InputRightAddon>
      </InputGroup>
    </HStack>
  )
}
