/* eslint-disable react/no-children-prop */
import { FormControl, FormLabel, Switch } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function WidgetCredit() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

    setWidget((prev) => {
      prev.hide_credit = e.target.checked
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        draft.hide_credit = e.target.checked
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
    <FormControl display="flex" alignItems="center">
      <FormLabel mb="0" fontSize={'lg'}>Hide Credit</FormLabel>
      <Switch isChecked={!!widget.hide_credit} colorScheme="purple" onChange={handleChange} />
    </FormControl>
  )
}

export default WidgetCredit
