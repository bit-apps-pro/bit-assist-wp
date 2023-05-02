import {
  FormControl,
  FormLabel,
  Input,
  useColorModeValue,
  VStack,
  Checkbox,
  CheckboxGroup,
  HStack,
  Switch,
  Text,
  Box,
  Flex,
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import CardColors from './common/CardColors'

export default function WooCommerce() {
  const [flow, setFlow] = useAtom(flowAtom)
  const channelColorToggle = useColorModeValue('white', 'gray.700')
  useEffect(() => {
    if (typeof flow.config?.card_config?.submit_button_text !== 'undefined') return
    setFlow((prev) => {
      if (typeof prev.config?.card_config === 'undefined') {
        prev.config.card_config = {}
      }
      prev.config.store_responses = true
      prev.config.card_config.submit_button_text = 'Submit'
    })
  }, [])

  const handleAddField = (value: string, label: string) => {
    if (value === '') return

    setFlow((prev) => {
      if (typeof prev.config?.card_config?.form_fields === 'undefined') {
        prev.config.card_config = { ...prev.config.card_config, form_fields: [] }
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config?.form_fields?.push({
        id: prev.config.card_config.maxId || 0,
        label: `${label}`,
        field_type: value,
        required: true,
      })
    })
  }

  if (typeof flow.config?.card_config?.form_fields === 'undefined') {
    handleAddField('number', 'Order Id')
    handleAddField('email', 'Billing Email')
  }

  const handleChange = (value: string | boolean | number, key: string, index: number) => {
    setFlow((prev) => {
      const newFields = [...(prev.config?.card_config?.form_fields || [])]
      newFields[index] = { ...newFields[index], [key]: value }
      prev.config.card_config = { ...prev.config.card_config, form_fields: newFields }
    })
  }

  const handleFormChange = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config.card_config = { ...prev.config.card_config, [key]: value }
    })
  }

  const handleCheckBoxes = (value: string | number | boolean | (string | number)[], key: string) => {
    setFlow((prev) => {
      prev.config = { ...prev.config, [key]: value }
    })
  }

  return (
    <>
      <VStack spacing={3} alignSelf="center" w="full" borderWidth={1} p={[2, 4]} rounded="md">
        {flow.config?.card_config?.form_fields && (
          <VStack w="full" spacing="3">
            {flow.config.card_config.form_fields.map((field, id) => (
              <HStack w="full" key={field.id}>
                <HStack w="full" borderWidth={1} shadow="base" p="2" rounded="md" bg={channelColorToggle}>
                  <Flex rounded="sm" justifyContent="center" alignItems="center" w={6} h={8}></Flex>
                  <Box w="full">
                    <HStack alignItems="flex-start" justifyContent="space-between">
                      <Text fontWeight={500} mb="2">
                        {field?.field_type &&
                          `${field?.field_type.charAt(0).toUpperCase()}${field?.field_type.slice(1)}`}{' '}
                        Field
                        {!field?.required && (
                          <Text display="inline" color="gray.400">
                            &nbsp;&nbsp;(Optional)
                          </Text>
                        )}
                      </Text>

                      <HStack alignItems="center">
                        <Text>Required</Text>
                        <Switch
                          colorScheme="purple"
                          isChecked={field?.required || false}
                          onChange={(e) => handleChange(e.target.checked, 'required', id)}
                        />
                      </HStack>
                    </HStack>
                    <VStack alignItems="flex-start">
                      <Input
                        value={field?.label}
                        onChange={(e) => handleChange(e.target.value, 'label', id)}
                        placeholder="label"
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
          onChange={(value) => handleCheckBoxes(value, 'order_details')}
          colorScheme="purple"
          value={flow.config?.order_details ?? []}
        >
          <HStack spacing={4}>
            <Checkbox size="md" value="shipping_status" aria-label="shipping status">
              Shipping Status
            </Checkbox>
            <Checkbox size="md" value="total_items" aria-label="total items">
              Total Items
            </Checkbox>
            <Checkbox size="md" value="total_amount" aria-label="total amount">
              Total Amount
            </Checkbox>
            <Checkbox size="md" value="billing_name" aria-label="total amount">
              Billing Name
            </Checkbox>
            <Checkbox size="md" value="shipping_name" aria-label="total amount">
              Shipping Name
            </Checkbox>
          </HStack>
        </CheckboxGroup>
      </FormControl>

      <FormControl>
        <FormLabel>Button Text</FormLabel>
        <Input
          value={flow.config?.card_config?.submit_button_text ?? 'Submit'}
          onChange={(e) => handleFormChange(e.target.value, 'submit_button_text')}
        />
      </FormControl>

      <CardColors bg="#a63492" color="#fff" />
    </>
  )
}
