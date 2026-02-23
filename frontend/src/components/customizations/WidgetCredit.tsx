import { FormControl, FormLabel, Switch } from '@chakra-ui/react'
import { widgetAtom } from '@globalStates/atoms'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

function WidgetCredit() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setWidget(prev => {
      prev.hide_credit = e.target.checked
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        draft.hide_credit = e.target.checked
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
    <FormControl alignItems="center" display="flex">
      <FormLabel fontSize={'lg'} mb="0">
        {__('Hide Credit')}
      </FormLabel>
      <Switch colorScheme="purple" isChecked={Boolean(widget.hide_credit)} onChange={handleChange} />
    </FormControl>
  )
}

export default WidgetCredit
