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
  Stack,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { TColor } from '@atomik-color/core/dist/types'
import { str2Color } from '@atomik-color/core'
import ColorPickerWrap from '@components/global/ColorPickerWrap'
import CustomFormField from '@components/widgetChannels/channels/Fields/CustomFormField'
import {
  closestCenter,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FiPlus } from 'react-icons/fi'
import StoreResponses from '@components/widgetChannels/StoreResponses'

const CustomForm = () => {
  const [flow, setFlow] = useAtom(flowAtom)
  const [activeId, setActiveId] = useState<number | null>(null)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.500')

  useEffect(() => {
    if (typeof flow.config?.card_config?.card_bg_color !== 'undefined') return
    setFlow((prev) => {
      if (typeof prev.config?.card_config === 'undefined') {
        prev.config.card_config = {}
      }
      prev.config.card_config = {
        card_bg_color: str2Color('#0038FF'),
        card_text_color: str2Color('#fff'),
        submit_button_text: 'Submit',
      }
    })
  }, [])

  const handleColorChange = (color: TColor, key: string) => {
    setFlow((prev) => {
      prev.config.card_config[key] = color
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = ({ active }) => {
    setActiveId(active?.id)
  }

  const handleDragEnd = ({ active, over }) => {
    setActiveId(null)
    if (active?.id !== over?.id) {
      const oldIndex = flow.config?.card_config?.form_fields.findIndex((item) => item?.id === active?.id)
      const newIndex = flow.config?.card_config?.form_fields.findIndex((item) => item?.id === over?.id)
      const newWidgetChannels = arrayMove(flow.config?.card_config?.form_fields, oldIndex, newIndex)
      setFlow((prev) => {
        prev.config.card_config.form_fields = newWidgetChannels
      })
    }
  }

  const handleAddField = (value: string) => {
    if (value === '') return

    setFlow((prev) => {
      if (typeof prev.config?.card_config?.form_fields === 'undefined') {
        prev.config.card_config.form_fields = []
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config.form_fields.push({
        id: prev.config.card_config.maxId,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        field_type: value,
        required: true,
      })
    })
  }

  const handleFormChange = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config.card_config[key] = value
    })
  }

  return (
    <>
      <VStack alignSelf={'center'} shadow="base" w="full" maxW="full" borderWidth={1} p={[2, 4]} rounded={'sm'}>
        {flow.config?.card_config?.form_fields && (
          <DndContext
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              items={flow.config.card_config.form_fields.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack w="full">
                {flow.config.card_config.form_fields.map((field, index) => {
                  return <CustomFormField key={field.id} id={index} field={field} />
                })}

                <DragOverlay style={{ marginTop: 0 }}>
                  {activeId && (
                    <CustomFormField
                      shadow="lg"
                      cursor="grabbing"
                      bg={bgColorToggle}
                      id={activeId}
                      field={flow.config.card_config.form_fields.find((item) => item.id == activeId)}
                    />
                  )}
                </DragOverlay>
              </VStack>
            </SortableContext>
          </DndContext>
        )}

        <Popover>
          <PopoverTrigger>
            <Button rightIcon={<FiPlus />}>Add Field</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <SimpleGrid columns={3} gap={1}>
                <Button onClick={() => handleAddField('text')}>Text</Button>
                <Button onClick={() => handleAddField('email')}>Email</Button>
                <Button onClick={() => handleAddField('number')}>Number</Button>
                <Button onClick={() => handleAddField('date')}>Date</Button>
                <Button onClick={() => handleAddField('textarea')}>Textarea</Button>
                <Button onClick={() => handleAddField('GDPR')}>GDPR</Button>
                {/* <Button onClick={() => handleAddField('file')}>File</Button> 
                <Button onClick={() => handleAddField('select')}>Select</Button>
                <Button onClick={() => handleAddField('rating')}>Rating</Button>
                <Button onClick={() => handleAddField('emoji')}>Emoji</Button>
                <Button onClick={() => handleAddField('feedback')}>Feedback</Button> */}
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <FormControl>
          <FormLabel htmlFor="submitButtonText">Button Text</FormLabel>
          <Input
            id="submitButtonText"
            value={flow.config?.card_config?.submit_button_text ?? 'Submit'}
            onChange={(e) => handleFormChange(e.target.value, 'submit_button_text')}
          />
        </FormControl>
      </VStack>

      <FormControl>
        <FormLabel htmlFor="webhook_url">Webhook URL</FormLabel>
        <Input
          id="webhook_url"
          placeholder="https://"
          value={flow.config?.card_config?.webhook_url ?? ''}
          onChange={(e) => handleFormChange(e.target.value, 'webhook_url')}
        />
      </FormControl>

      <Stack w={'full'} spacing="0" gap="2" flexDirection={['column', 'row']}>
        <FormControl>
          <FormLabel>Form Theme Color</FormLabel>
          <ColorPickerWrap
            color={flow.config?.card_config?.card_bg_color}
            handleChange={(val: TColor) => handleColorChange(val, 'card_bg_color')}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Form Text Color</FormLabel>
          <ColorPickerWrap
            color={flow.config?.card_config?.card_text_color}
            handleChange={(val: TColor) => handleColorChange(val, 'card_text_color')}
          />
        </FormControl>
      </Stack>

      <StoreResponses />
    </>
  )
}

export default CustomForm
