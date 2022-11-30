/* eslint-disable react/jsx-props-no-spreading */
import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, Flex, HStack, IconButton, Input, Switch, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { FiX } from 'react-icons/fi'
import { CSS } from '@dnd-kit/utilities'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { DynamicFormField } from '@globalStates/Interfaces'
import RatingSettings from './customFormHelper/RatingSettings'
import FileSettings from './customFormHelper/FileSettings'

interface CustomFormFieldProps {
  id: number
  field: DynamicFormField | undefined
  cursor?: string
  bg?: string
}

function CustomFormField({ id, field, cursor = 'grab', bg = 'none' }: CustomFormFieldProps) {
  const [, setFlow] = useAtom(flowAtom)
  const channelColorToggle = useColorModeValue('white', 'gray.700')

  const { attributes, listeners, setNodeRef, transition, transform, isDragging } = useSortable({
    id: field?.id || 0,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'pinch-zoom',
  }

  const handleDelete = (index: number) => {
    setFlow((prev) => {
      prev.config?.card_config?.form_fields?.splice(index, 1)
    })
  }

  const handleChange = (value: string | boolean | number, key: string, index: number) => {
    setFlow((prev) => {
      const newFields = [...(prev.config?.card_config?.form_fields || [])]
      newFields[index] = { ...newFields[index], [key]: value }
      prev.config.card_config = { ...prev.config.card_config, form_fields: newFields }
    })
  }

  return (
    <HStack w="full" style={style} ref={setNodeRef}>
      <HStack w="full" borderWidth={1} shadow="base" p="2" rounded="md" bg={channelColorToggle}>
        <Flex
          {...listeners}
          {...attributes}
          rounded="sm"
          bg={bg}
          cursor={cursor}
          justifyContent="center"
          alignItems="center"
          w={6}
          h={8}
        >
          <DragHandleIcon aria-label="draggable button" />
        </Flex>
        <Box w="full">
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontWeight={500} mb="2">
              {field?.field_type && `${field?.field_type.charAt(0).toUpperCase()}${field?.field_type.slice(1)}`}
              {' '}
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
          <VStack alignItems='flex-start'>
            <Input
              value={field?.label}
              onChange={(e) => handleChange(e.target.value, 'label', id)}
              placeholder="label"
            />
            {field?.field_type === 'GDPR' && (
              <Input value={field?.url} onChange={(e) => handleChange(e.target.value, 'url', id)} placeholder="url" />
            )}
            {field?.field_type === 'rating' && (
              <RatingSettings id={id} type={field?.rating_type} handleChange={handleChange} />
            )}
            {field?.field_type === 'file' && (
              <FileSettings id={id} field={field} handleChange={handleChange} />
            )}
          </VStack>
        </Box>
      </HStack>
      <Box>
        <IconButton aria-label="Delete Icon" size="sm" isRound icon={<FiX />} onClick={() => handleDelete(id)} />
      </Box>
    </HStack>
  )
}

export default CustomFormField