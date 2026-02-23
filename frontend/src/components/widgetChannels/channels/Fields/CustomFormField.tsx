import { DragHandleIcon } from '@chakra-ui/icons'
import {
  Box,
  Flex,
  HStack,
  IconButton,
  Input,
  Switch,
  Text,
  useColorModeValue,
  VStack
} from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flowAtom } from '@globalStates/atoms'
import { type DynamicFormField } from '@globalStates/Interfaces'
import { __ } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'
import { FiX } from 'react-icons/fi'

import FileSettings from './customFormHelper/FileSettings'
import RatingSettings from './customFormHelper/RatingSettings'

interface CustomFormFieldProps {
  bg?: string
  cursor?: string
  field: DynamicFormField | undefined
  id: number
}

function CustomFormField({ bg = 'none', cursor = 'grab', field, id }: CustomFormFieldProps) {
  const [, setFlow] = useAtom(flowAtom)
  const channelColorToggle = useColorModeValue('white', 'gray.700')

  const { attributes, isDragging, listeners, setNodeRef, transform, transition } = useSortable({
    id: field?.id || 0
  })

  const style = {
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'pinch-zoom',
    transform: CSS.Transform.toString(transform),
    transition
  }

  const handleDelete = (index: number) => {
    setFlow(prev => {
      prev.config?.card_config?.form_fields?.splice(index, 1)
    })
  }

  const handleChange = (value: boolean | number | string, key: string, index: number) => {
    setFlow(prev => {
      const newFields = [...(prev.config?.card_config?.form_fields || [])]
      newFields[index] = { ...newFields[index], [key]: value }
      prev.config.card_config = { ...prev.config.card_config, form_fields: newFields }
    })
  }

  return (
    <HStack ref={setNodeRef} style={style} w="full">
      <HStack bg={channelColorToggle} borderWidth={1} p="2" rounded="md" shadow="base" w="full">
        <Flex
          {...listeners}
          {...attributes}
          alignItems="center"
          bg={bg}
          cursor={cursor}
          h={8}
          justifyContent="center"
          rounded="sm"
          w={6}
        >
          <DragHandleIcon aria-label={__('draggable button')} />
        </Flex>
        <Box w="full">
          <HStack alignItems="flex-start" justifyContent="space-between">
            <Text fontWeight={500} mb="2">
              {field?.field_type &&
                `${field?.field_type.charAt(0).toUpperCase()}${field?.field_type.slice(1)}`}{' '}
              {__('Field')}
              {!field?.required && (
                <Text color="gray.400" display="inline">
                  &nbsp;&nbsp;({__('Optional')})
                </Text>
              )}
            </Text>
            <HStack alignItems="center">
              <Text>{__('Required')}</Text>
              <Switch
                colorScheme="purple"
                isChecked={field?.required || false}
                onChange={e => handleChange(e.target.checked, 'required', id)}
              />
            </HStack>
          </HStack>
          <VStack alignItems="flex-start">
            <Input
              onChange={e => handleChange(e.target.value, 'label', id)}
              placeholder={__('label')}
              value={field?.label}
            />
            {field?.field_type === 'GDPR' && (
              <Input
                onChange={e => handleChange(e.target.value, 'url', id)}
                placeholder={__('url')}
                value={field?.url}
              />
            )}
            {field?.field_type === 'rating' && (
              <RatingSettings handleChange={handleChange} id={id} type={field?.rating_type} />
            )}
            {field?.field_type === 'file' && (
              <FileSettings field={field} handleChange={handleChange} id={id} />
            )}
          </VStack>
        </Box>
      </HStack>
      <Box>
        <IconButton
          aria-label={__('Delete')}
          icon={<FiX />}
          isRound
          onClick={() => handleDelete(id)}
          size="sm"
        />
      </Box>
    </HStack>
  )
}

export default CustomFormField
