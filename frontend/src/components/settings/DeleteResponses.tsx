import { Box, FormControl, FormLabel, HStack, Input, Stack, Switch, Text, useToast, VStack, Wrap, WrapItem } from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

const DeleteResponses = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData(e.target.checked, 'is_enabled')
  }
  const handleInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value ? parseInt(e.target.value) : 0
    updateData(value, 'delete_after')
  }

  const updateData = async (val: number | boolean, key: string) => {
    setWidget((prev) => {
      if (prev.delete_responses === null) {
        prev.delete_responses = {}
      }
      prev.delete_responses[key] = val
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.delete_responses === null) {
          draft.delete_responses = {}
        }
        draft.delete_responses[key] = val
      })
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (widget) => {
      const response: any = await updateWidget(widget)
      ResponseToast({ toast, response, action: 'update', messageFor: 'Widget delete responses' })
    }, 1000)
  ).current

  useEffect(() => {
    return () => {
      debounceUpdateWidget.cancel()
    }
  }, [debounceUpdateWidget])

  return (
    <Stack alignItems={'center'} flexDirection={['column', 'row']} spacing="0" gap="2">
        <FormControl display="flex" alignItems="center">
          <FormLabel htmlFor="deleteResponses" mb="0">
            Delete Responses
          </FormLabel>
          <Switch isChecked={!!widget.delete_responses?.is_enabled} colorScheme={'purple'} onChange={handleSwitchEnable} id="deleteResponses" />
        </FormControl>
        <HStack>
          <Text>After</Text>
          <Input disabled={!! !widget.delete_responses?.is_enabled} min="0" value={widget.delete_responses?.delete_after ?? 0} onChange={handleInput} type="number" w="28" />
          <Text>Days</Text>
        </HStack>
    </Stack>
  )
}

export default DeleteResponses
