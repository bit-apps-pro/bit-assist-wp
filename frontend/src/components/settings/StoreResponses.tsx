import { Box, FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function StoreResponses() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget(prev => {
      prev.store_responses = e.target.checked
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        draft.store_responses = e.target.checked
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
    <Box>
      <FormControl alignItems="center" display="flex">
        <FormLabel mb="0">Store Responses</FormLabel>
        <Switch
          colorScheme="purple"
          isChecked={!!widget.store_responses}
          onChange={handleSwitchEnable}
        />
      </FormControl>
    </Box>
  )
}

export default StoreResponses
