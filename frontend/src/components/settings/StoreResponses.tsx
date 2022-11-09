import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function StoreResponses() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget((prev) => {
      prev.store_responses = e.target.checked
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.store_responses = e.target.checked
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
      <FormControl display="flex" alignItems="center">
        <FormLabel mb="0">Store Responses</FormLabel>
        <Switch isChecked={!!widget.store_responses} colorScheme="purple" onChange={handleSwitchEnable} />
      </FormControl>
    </Box>
  )
}

export default StoreResponses
