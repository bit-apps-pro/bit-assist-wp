import { FormControl, FormLabel, HStack, Input, Stack, Switch, Text } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function DeleteResponses() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const updateData = async (val: boolean | number, key: string) => {
    setWidget(prev => {
      if (prev.delete_responses === null) {
        prev.delete_responses = {}
      }
      prev.delete_responses = { ...prev.delete_responses, [key]: val }
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.delete_responses === null) {
          draft.delete_responses = {}
        }
        draft.delete_responses = { ...draft.delete_responses, [key]: val }
      })
    )
  }

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData(e.target.checked, 'is_enabled')
  }

  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : 0
    if (Number.isNaN(val)) {
      toaster('warning', __('Delete responses must be a number'))
      return
    }

    updateData(val, 'delete_after')
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  return (
    <Stack alignItems="center" flexDirection={['column', 'row']} gap="2" spacing="0">
      <FormControl alignItems="center" display="flex">
        <FormLabel mb="0">{__('Delete Responses')}</FormLabel>
        <Switch
          colorScheme="purple"
          isChecked={!!widget.delete_responses?.is_enabled}
          onChange={handleSwitchEnable}
        />
      </FormControl>
      <HStack>
        <Text>{__('After')}</Text>
        <Input
          disabled={!widget.delete_responses?.is_enabled}
          min="0"
          onChange={handleInput}
          value={widget.delete_responses?.delete_after ?? 0}
          w="28"
        />
        <Text>{__('Days')}</Text>
      </HStack>
    </Stack>
  )
}

export default DeleteResponses
