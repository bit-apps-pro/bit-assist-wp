import { HStack, Input, InputGroup, InputRightAddon, Text } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function InitialDelay() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : 0
    if (Number.isNaN(val) || val < 0 || val > 60) {
      toaster('warning', __('Initial delay must be between 0 and 60'))
      return
    }

    setWidget(draft => {
      draft.initial_delay = val
    })
    debounceUpdateWidget(
      produce(widget, draft => {
        draft.initial_delay = val
      })
    )
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  return (
    <HStack>
      <Text w="28">{__('Delay')}</Text>
      <InputGroup className="input-group">
        <Input
          min="0"
          onChange={handleChange}
          placeholder={__('Initial Delay in Second')}
          value={widget.initial_delay ?? ''}
          w="28"
        />
        <InputRightAddon>{__('Sec')}</InputRightAddon>
      </InputGroup>
    </HStack>
  )
}

export default InitialDelay
