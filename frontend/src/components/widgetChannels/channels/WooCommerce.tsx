import {
  Box,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Switch,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect, useRef } from 'react'

import CardColors from './common/CardColors'

export default function WooCommerce() {
  const [flow, setFlow] = useAtom(flowAtom)
  const channelColorToggle = useColorModeValue('white', 'gray.700')
  const isFieldAdded = useRef(false)

  const handleAddField = (value: string, label: string) => {
    if (value === '') return

    setFlow(prev => {
      if (prev.config?.card_config?.form_fields === undefined) {
        prev.config.card_config = { ...prev.config.card_config, form_fields: [] }
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config?.form_fields?.push({
        field_type: value,
        id: prev.config.card_config.maxId || 0,
        label: `${label}`,
        required: true
      })
    })
  }

  const handleChange = (value: boolean | number | string, key: string, index: number) => {
    setFlow(prev => {
      const newFields = [...(prev.config?.card_config?.form_fields || [])]
      newFields[index] = { ...newFields[index], [key]: value }
      prev.config.card_config = { ...prev.config.card_config, form_fields: newFields }
    })
  }

  const handleFormChange = (value: boolean | number | string, key: string) => {
    setFlow(prev => {
      prev.config.card_config = { ...prev.config.card_config, [key]: value }
    })
  }

  const handleCheckBoxes = (value: (number | string)[] | boolean | number | string, key: string) => {
    setFlow(prev => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  useEffect(() => {
    if (flow.config?.card_config?.submit_button_text !== undefined) return
    setFlow(prev => {
      if (prev.config?.card_config === undefined) {
        prev.config.card_config = {}
      }
      prev.config.store_responses = true
      prev.config.card_config.submit_button_text = 'Submit'
    })
  }, [])

  useEffect(() => {
    if (isFieldAdded.current || flow.config?.card_config?.form_fields) return

    handleAddField('number', 'Order Id')
    handleAddField('email', 'Billing Email')

    isFieldAdded.current = true
  }, [])

  return (
    <>
      <VStack alignSelf="center" borderWidth={1} p={[2, 4]} rounded="md" spacing={3} w="full">
        {flow.config?.card_config?.form_fields && (
          <VStack spacing="3" w="full">
            {flow.config.card_config.form_fields.map((field, id) => (
              <HStack key={field.id} w="full">
                <HStack
                  bg={channelColorToggle}
                  borderWidth={1}
                  p="2"
                  rounded="md"
                  shadow="base"
                  w="full"
                >
                  <Flex alignItems="center" h={8} justifyContent="center" rounded="sm" w={6}></Flex>
                  <Box w="full">
                    <HStack alignItems="flex-start" justifyContent="space-between">
                      <Text fontWeight={500} mb="2">
                        {field?.field_type &&
                          `${field?.field_type.charAt(0).toUpperCase()}${field?.field_type.slice(1)}`}{' '}
                        Field
                        {!field?.required && (
                          <Text color="gray.400" display="inline">
                            &nbsp;&nbsp;(Optional)
                          </Text>
                        )}
                      </Text>

                      <HStack alignItems="center">
                        <Text>Required</Text>
                        <Switch
                          colorScheme="purple"
                          disabled={field?.field_type === 'number'}
                          isChecked={field?.required || false}
                          onChange={e => handleChange(e.target.checked, 'required', id)}
                        />
                      </HStack>
                    </HStack>
                    <VStack alignItems="flex-start">
                      <Input
                        onChange={e => handleChange(e.target.value, 'label', id)}
                        placeholder="label"
                        value={field?.label}
                      />
                    </VStack>
                  </Box>
                </HStack>
              </HStack>
            ))}
          </VStack>
        )}
      </VStack>

      <FormControl>
        <FormLabel display="inline-block">Show Order Details</FormLabel>
        <CheckboxGroup
          colorScheme="purple"
          onChange={value => handleCheckBoxes(value, 'order_details')}
          value={flow.config?.order_details ?? []}
        >
          <Stack direction={['column', 'row']} spacing={[1, 5]} wrap="wrap">
            <Checkbox aria-label="shipping status" size="lg" value="shipping_status">
              Shipping Status
            </Checkbox>
            <Checkbox aria-label="total items" size="lg" value="total_items">
              Total Items
            </Checkbox>
            <Checkbox aria-label="total amount" size="lg" value="total_amount">
              Total Amount
            </Checkbox>
            <Checkbox aria-label="total amount" size="lg" value="billing_name">
              Billing Name
            </Checkbox>
            <Checkbox aria-label="total amount" size="lg" value="shipping_name">
              Shipping Name
            </Checkbox>
          </Stack>
        </CheckboxGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Button Text</FormLabel>
        <Input
          onChange={e => handleFormChange(e.target.value, 'submit_button_text')}
          value={flow.config?.card_config?.submit_button_text ?? 'Submit'}
        />
      </FormControl>

      <CardColors bg="#a63492" color="#fff" />
    </>
  )
}
