import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  SimpleGrid,
  useColorModeValue,
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import ProWrapper from '@components/global/ProWrapper'
import CustomFormField from '@components/widgetChannels/channels/Fields/CustomFormField'
import StoreResponses from '@components/widgetChannels/StoreResponses'
import config from '@config/config'
import { type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { flowAtom } from '@globalStates/atoms'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'

import CardColors from './common/CardColors'

function CustomForm() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [activeId, setActiveId] = useState<number>(0)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.500')
  const { isOpen, onClose, onOpen } = useDisclosure()

  useEffect(() => {
    if (flow.config?.store_responses !== undefined) return

    setFlow(prev => {
      if (prev.config?.card_config === undefined) {
        prev.config.card_config = {}
      }
      prev.config.store_responses = true
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragStart = (e: DragStartEvent) => {
    const { id } = e.active
    setActiveId(+id)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(0)
    if (e.active.id !== e.over?.id) {
      const oldIndex =
        flow.config?.card_config?.form_fields?.findIndex(item => item?.id === e.active.id) || 0
      const newIndex =
        flow.config?.card_config?.form_fields?.findIndex(item => item?.id === e.over?.id) || 0
      const newWidgetChannels = arrayMove(
        flow.config?.card_config?.form_fields || [],
        oldIndex,
        newIndex
      )
      setFlow(prev => {
        prev.config.card_config = { ...prev.config.card_config, form_fields: newWidgetChannels }
      })
    }
  }

  const handleAddField = (value: string) => {
    if (value === '') return

    const fieldCount =
      flow.config?.card_config?.form_fields?.filter(item => item.field_type === value)?.length || 0

    setFlow(prev => {
      if (prev.config?.card_config?.form_fields === undefined) {
        prev.config.card_config = { ...prev.config.card_config, form_fields: [] }
      }

      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1

      const newField = {
        field_type: value,
        id: prev.config.card_config.maxId || 0,
        label: `${value.charAt(0).toUpperCase() + value.slice(1)}${fieldCount == 0 ? '' : ` ${fieldCount + 1}`}`,
        required: true
      }

      if (value === 'rating') {
        Object.assign(newField, { rating_type: 'star' })
      }

      prev.config.card_config?.form_fields?.push(newField)
    })
    onClose()
  }

  const handleFormChange = (value: boolean | number | string, key: string) => {
    setFlow(prev => {
      prev.config.card_config = { ...prev.config.card_config, [key]: value }
    })
  }

  return (
    <>
      <VStack alignSelf="center" borderWidth={1} p={[2, 4]} rounded="md" spacing={3} w="full">
        {flow.config?.card_config?.form_fields && (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
          >
            <SortableContext
              items={flow.config.card_config.form_fields.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack spacing="3" w="full">
                {flow.config.card_config.form_fields.map((field, index) => (
                  <CustomFormField field={field} id={index} key={field.id} />
                ))}

                {activeId ? (
                  <DragOverlay style={{ marginTop: 0 }}>
                    <CustomFormField
                      bg={bgColorToggle}
                      cursor="grabbing"
                      field={flow.config?.card_config?.form_fields?.find(item => +item.id === activeId)}
                      id={activeId}
                    />
                  </DragOverlay>
                ) : undefined}
              </VStack>
            </SortableContext>
          </DndContext>
        )}

        <Popover isOpen={isOpen} onClose={onClose} onOpen={onOpen}>
          <PopoverTrigger>
            <Button rightIcon={<FiPlus />}>{__('Add Field', 'bit-assist')}</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <SimpleGrid columns={3} gap={1}>
                <Button onClick={() => handleAddField('text')}>{__('Text', 'bit-assist')}</Button>
                <Button onClick={() => handleAddField('email')}>{__('Email', 'bit-assist')}</Button>
                <Button onClick={() => handleAddField('number')}>{__('Number', 'bit-assist')}</Button>
                <Button onClick={() => handleAddField('date')}>{__('Date', 'bit-assist')}</Button>
                <Button onClick={() => handleAddField('textarea')}>
                  {__('Textarea', 'bit-assist')}
                </Button>
                <Button onClick={() => handleAddField('GDPR')}>{__('GDPR', 'bit-assist')}</Button>
                <Button onClick={() => handleAddField('rating')}>{__('Rating', 'bit-assist')}</Button>
                <Button onClick={() => handleAddField('feedback')}>
                  {__('Feedback', 'bit-assist')}
                </Button>
                <Button onClick={() => handleAddField('file')}>{__('File', 'bit-assist')}</Button>
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </VStack>

      <FormControl>
        <FormLabel>{__('Button Text', 'bit-assist')}</FormLabel>
        <Input
          onChange={e => handleFormChange(e.target.value, 'submit_button_text')}
          placeholder={__('Submit', 'bit-assist')}
          value={flow.config?.card_config?.submit_button_text}
        />
      </FormControl>

      <FormControl>
        <FormLabel>{__('Success Message', 'bit-assist')}</FormLabel>
        <Input
          onChange={e => handleFormChange(e.target.value, 'success_message')}
          placeholder={__('Submitted successfully', 'bit-assist')}
          value={flow.config?.card_config?.success_message}
        />
      </FormControl>

      <StoreResponses />

      <FormControl>
        <FormLabel>{__('Send Mail To', 'bit-assist')}</FormLabel>
        <Input
          onChange={e => handleFormChange(e.target.value, 'send_mail_to')}
          placeholder={__('Your email', 'bit-assist')}
          value={flow.config?.card_config?.send_mail_to || ''}
        />
      </FormControl>

      <ProWrapper>
        <FormControl>
          <FormLabel>{__('Webhook URL', 'bit-assist')}</FormLabel>
          <Input
            onChange={e => handleFormChange(e.target.value, 'webhook_url')}
            placeholder="https://..."
            tabIndex={config.IS_PRO ? 0 : -1}
            value={flow.config?.card_config?.webhook_url || ''}
          />
        </FormControl>
      </ProWrapper>

      <CardColors bg="#0038FF" color="#fff" />
    </>
  )
}

export default CustomForm
