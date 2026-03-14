import { Checkbox, CheckboxGroup, FormControl, HStack } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { __ } from '@wordpress/i18n'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import { useEffect, useRef } from 'react'

export const WidgetShowOn = () => {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleChanges = (value: (number | string)[], key: string) => {
    const val = value
    setWidget(prev => {
      if (prev.styles === null || prev.styles === undefined) {
        prev.styles = {}
      }
      prev.styles = { ...prev.styles, [key]: value }
    })

    debounceUpdateWidget(
      produce(widget, draft => {
        if (draft.styles === null || draft.styles === undefined) {
          draft.styles = {}
        }
        draft.styles.widget_show_on = val
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
    <FormControl>
      <Title>{__('Widget Show On', 'bit-assist')}</Title>
      <CheckboxGroup
        colorScheme="purple"
        onChange={val => handleChanges(val, 'widget_show_on')}
        value={widget.styles?.widget_show_on ?? ['desktop', 'mobile']}
      >
        <HStack spacing={4}>
          <Checkbox aria-label={__('Show on desktop', 'bit-assist')} size="lg" value="desktop">
            {__('Desktop', 'bit-assist')}
          </Checkbox>
          <Checkbox aria-label={__('Show on mobile', 'bit-assist')} size="lg" value="mobile">
            {__('Mobile', 'bit-assist')}
          </Checkbox>
        </HStack>
      </CheckboxGroup>
    </FormControl>
  )
}
