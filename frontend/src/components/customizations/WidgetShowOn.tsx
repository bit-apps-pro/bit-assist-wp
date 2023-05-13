import { Checkbox, CheckboxGroup, FormControl, FormLabel, HStack } from '@chakra-ui/react'
import { useAtom } from 'jotai'
import { widgetAtom } from '@globalStates/atoms'
import Title from '@components/global/Title'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import useToaster from '@hooks/useToaster'
import { useEffect, useRef } from 'react'
import { debounce } from 'lodash'
import { produce } from 'immer'

export const WidgetShowOn = () => {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidget()
  const toaster = useToaster()

  const handleChanges = (value: (string | number)[], key: string) => {
    const val = value
    setWidget((prev) => {
      if (prev.styles === null) {
        prev.styles = {}
      }
      prev.styles = { ...prev.styles, [key]: value }
    })

    debounceUpdateWidget(
      produce(widget, (draft) => {
        if (draft.styles === null) {
          draft.styles = {}
        }
        draft.styles.widget_show_on = val
      }),
    )
  }

  const debounceUpdateWidget = useRef(
    debounce(async (newWidget) => {
      const { status, data } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000),
  ).current

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget],
  )

  return (
    <FormControl>
      <Title>Widget Show On</Title>
      <CheckboxGroup
        onChange={(val) => handleChanges(val, 'widget_show_on')}
        colorScheme="purple"
        value={widget.styles?.widget_show_on ?? ['desktop', 'mobile']}
      >
        <HStack spacing={4}>
          <Checkbox size="lg" value="desktop" aria-label="show on desktop">
            Desktop
          </Checkbox>
          <Checkbox size="lg" value="mobile" aria-label="show on mobile">
            Mobile
          </Checkbox>
        </HStack>
      </CheckboxGroup>
    </FormControl>
  )
}
