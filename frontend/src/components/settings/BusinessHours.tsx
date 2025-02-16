import { Box, Checkbox, HStack, Input, Switch, Text, VStack } from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import Title from '@components/global/Title'
import Timezones from '@components/settings/Timezones'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import { type SelectedOptionValue } from '@globalStates/Interfaces'
import useUpdateWidgetPro from '@hooks/mutations/widget/useUpdateWidgetPro'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import { useAtom } from 'jotai'
import { debounce } from 'lodash'
import 'react-select-search/style.css'
import { useEffect, useRef, useState } from 'react'
import SelectSearch from 'react-select-search'

function BusinessHours() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget } = useUpdateWidgetPro()
  const [isChanged, setIsChanged] = useState(false)
  const [isEnabled, setIsEnabled] = useState(false)
  const tabIndex = config.IS_PRO ? 0 : -1

  const [defaultBusinessHours] = useState([
    { day: 'sunday', end: '18:00', start: '09:00' },
    { day: 'monday', end: '18:00', start: '09:00' },
    { day: 'tuesday', end: '18:00', start: '09:00' },
    { day: 'wednesday', end: '18:00', start: '09:00' },
    { day: 'thursday', end: '18:00', start: '09:00' },
    { day: 'friday' },
    { day: 'saturday' }
  ])

  useEffect(() => {
    if (widget.business_hours?.length > 0) {
      setIsEnabled(true)
    } else {
      setIsEnabled(false)
    }
  }, [widget.business_hours])

  const debounceUpdateWidget = useRef(
    debounce(async newWidget => {
      const { data, status } = await updateWidget(newWidget)
      toaster(status, data)
    }, 1000)
  ).current

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    setIsChanged(true)
    setWidget(prev => {
      const newFields = [...(prev.business_hours || [])]
      newFields[index] = { ...newFields[index], [e.target.name]: e.target.value }
      prev.business_hours = newFields
    })
  }

  const updateChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (!isChanged) {
      return
    }
    debounceUpdateWidget(
      produce(widget, draft => {
        const newFields = [...(draft.business_hours || [])]
        newFields[index] = { ...newFields[index], [e.target.name]: e.target.value }
        draft.business_hours = newFields
      })
    )
    setIsChanged(false)
  }

  const handleCheckboxChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    if (e.target.checked) {
      setWidget(prev => {
        prev.business_hours[index].start = '09:00'
        prev.business_hours[index].end = '18:00'
      })

      debounceUpdateWidget(
        produce(widget, draft => {
          draft.business_hours[index].start = '09:00'
          draft.business_hours[index].end = '18:00'
        })
      )
    } else {
      setWidget(prev => {
        delete prev.business_hours[index].start
        delete prev.business_hours[index].end
      })

      debounceUpdateWidget(
        produce(widget, draft => {
          delete draft.business_hours[index].start
          delete draft.business_hours[index].end
        })
      )
    }
  }

  const handleTimezoneChange = async (selectedOption: SelectedOptionValue | SelectedOptionValue[]) => {
    setWidget(prev => {
      prev.timezone = selectedOption.toString()
    })

    const { data, status } = await updateWidget(
      produce(widget, draft => {
        draft.timezone = selectedOption.toString()
      })
    )
    toaster(status, data)
  }

  const handleSwitchEnable = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsEnabled(e.target.checked)
    const val = e.target.checked ? defaultBusinessHours : []

    setWidget(prev => {
      prev.business_hours = val
    })

    if (config.IS_PRO) {
      debounceUpdateWidget(
        produce(widget, draft => {
          draft.business_hours = val
        })
      )
    }
  }

  useEffect(
    () => () => {
      debounceUpdateWidget.cancel()
    },
    [debounceUpdateWidget]
  )

  return (
    <Box>
      <Box alignItems="center" display="flex" mb={-10}>
        <Title>
          Enable Business Hours
          {/* <FormLabel mb="0">Enable Business Hours</FormLabel> */}
          <Switch colorScheme="purple" isChecked={!!isEnabled} ml={4} onChange={handleSwitchEnable} />
        </Title>
      </Box>

      {isEnabled && (
        <ProWrapper>
          <Box mt={4}>
            <VStack alignItems="flex-start">
              <VStack alignItems="flex-start" maxW="full" mb="2">
                <Text>TimeZone</Text>
                <Box id="timezoneSelect" maxW="full" w="lg">
                  <SelectSearch
                    className="select-search"
                    defaultValue={widget.timezone ?? ''}
                    disabled={!config.IS_PRO}
                    onBlur={() => {
                      //
                    }}
                    onChange={handleTimezoneChange}
                    onFocus={() => {
                      //
                    }}
                    options={Timezones}
                    placeholder="Choose your timezone"
                    search
                  />
                </Box>
              </VStack>

              {widget.business_hours?.map((item, index) => (
                <HStack key={item.day} maxW="full" minH="10">
                  <Checkbox
                    colorScheme="purple"
                    isChecked={!!item?.start}
                    onChange={e => handleCheckboxChange(e, index)}
                    size="lg"
                    tabIndex={tabIndex}
                  >
                    <Text fontSize="md" w="24">
                      {item?.day && item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                    </Text>
                  </Checkbox>
                  {!!item?.start && (
                    <>
                      <Input
                        name="start"
                        onBlur={e => updateChange(e, index)}
                        onChange={e => handleInputChange(e, index)}
                        placeholder="09:00"
                        tabIndex={tabIndex}
                        value={item?.start ?? ''}
                        w="24"
                      />
                      <Text>-</Text>
                      <Input
                        name="end"
                        onBlur={e => updateChange(e, index)}
                        onChange={e => handleInputChange(e, index)}
                        placeholder="18:00"
                        tabIndex={tabIndex}
                        value={item?.end ?? ''}
                        w="24"
                      />
                    </>
                  )}
                </HStack>
              ))}
            </VStack>
          </Box>
        </ProWrapper>
      )}
    </Box>
  )
}

export default BusinessHours
