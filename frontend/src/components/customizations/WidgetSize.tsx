/* eslint-disable react/no-children-prop */
import { Box, Input, InputGroup, InputRightAddon } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function WidgetSize() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 2) : undefined
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles.size = val
    })
    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.size = val
      }),
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const { status, data } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000),
  ).current

  useEffect(() => () => {
    debounceUpdateWidget.cancel()
  }, [debounceUpdateWidget])

  return (
    <Box>
      <Title>Widget Size</Title>
      <InputGroup>
        <Input min="0" w="28" type="number" placeholder="60" value={widget.styles?.size ?? ''} onChange={handleChange} />
        <InputRightAddon children="px" />
      </InputGroup>
    </Box>
  )
}

export default WidgetSize
