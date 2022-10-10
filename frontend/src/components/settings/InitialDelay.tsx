/* eslint-disable react/no-children-prop */
import { HStack, Input, InputGroup, InputRightAddon, Text, useToast } from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

const InitialDelay = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? parseInt(e.target.value) : 0
    setWidget((draft) => {
      draft.initial_delay = val
    })
    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.initial_delay = val
      })
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (widget) => {
      const response: any = await updateWidget(widget)
      ResponseToast({ toast, response, action: 'update', messageFor: 'Widget initial delay' })
    }, 1000)
  ).current

  useEffect(() => {
    return () => {
      debounceUpdateWidget.cancel()
    }
  }, [debounceUpdateWidget])

  return (
    <HStack>
      <Text w="28">Delay</Text>
      <InputGroup>
        <Input w="28" min="0" type="number" placeholder="Initial Delay in Second" value={widget.initial_delay ?? ''} onChange={handleChange} />
        <InputRightAddon children="Sec" />
      </InputGroup>
    </HStack>
  )
}

export default InitialDelay
