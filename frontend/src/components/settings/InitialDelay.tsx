/* eslint-disable react/no-children-prop */
import { HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function InitialDelay() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : 0
    if (isNaN(val) || val < 0 || val > 60) {
      toaster('warning', 'Initial delay must be between 0 and 60')
      return
    }

    setWidget((draft) => {
      draft.initial_delay = val
    })
    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.initial_delay = val
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
    <HStack>
      <Text w="28">Delay</Text>
      <InputGroup className='input-group'>
        <Input w="28" min="0" placeholder="Initial Delay in Second" value={widget.initial_delay ?? ''} onChange={handleChange} />
        <InputRightAddon children="Sec" />
      </InputGroup>
    </HStack>
  )
}

export default InitialDelay
