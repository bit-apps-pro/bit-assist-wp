import { FormControl, FormLabel, HStack, Input, Stack, Switch, Text } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function DeleteResponses() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData(e.target.checked, 'is_enabled')
  }
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value ? Number(e.target.value) : 0
    if (isNaN(val)) {
      toaster('warning', 'Delete responses must be a number')
      return
    }

    updateData(val, 'delete_after')
  }

  const updateData = async (val: number | boolean, key: string) => {
    setWidget((prev) => {
      if (prev.delete_responses === null) {
        prev.delete_responses = {}
      }
      prev.delete_responses = { ...prev.delete_responses, [key]: val }
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.delete_responses === null) {
          draft.delete_responses = {}
        }
        draft.delete_responses = { ...draft.delete_responses, [key]: val }
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
    <Stack alignItems="center" flexDirection={['column', 'row']} spacing="0" gap="2">
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="deleteResponses" mb="0">Delete Responses</FormLabel>
        <Switch isChecked={!!widget.delete_responses?.is_enabled} colorScheme="purple" onChange={handleSwitchEnable} id="deleteResponses" />
      </FormControl>
      <HStack>
        <Text>After</Text>
        <Input disabled={!widget.delete_responses?.is_enabled} min="0" value={widget.delete_responses?.delete_after ?? 0} onChange={handleInput} w="28" />
        <Text>Days</Text>
      </HStack>
    </Stack>
  )
}

export default DeleteResponses
