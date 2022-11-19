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
  useDisclosure,
  VStack
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { TColor } from '@atomik-color/core/dist/types'
import { str2Color } from '@atomik-color/core'
import ColorPickerWrap from '@components/global/ColorPickerWrap'
import CustomFormField from '@components/widgetChannels/channels/Fields/CustomFormField'
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FiPlus } from 'react-icons/fi'
import StoreResponses from '@components/widgetChannels/StoreResponses'
import ProWrapper from '@components/global/ProWrapper'
import config from '@config/config'

function CustomForm() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [activeId, setActiveId] = useState<number>(0)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.500')
  const { onOpen, onClose, isOpen } = useDisclosure()

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
      prev.config.card_config = { ...prev.config.card_config, [key]: color }
    })
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  const handleDragStart = (e: DragStartEvent) => {
    const { id } = e.active
    setActiveId(+id)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(0)
    if (e.active.id !== e.over?.id) {
      const oldIndex = flow.config?.card_config?.form_fields?.findIndex((item) => item?.id === e.active.id) || 0
      const newIndex = flow.config?.card_config?.form_fields?.findIndex((item) => item?.id === e.over?.id) || 0
      const newWidgetChannels = arrayMove(flow.config?.card_config?.form_fields || [], oldIndex, newIndex)
      setFlow((prev) => {
        prev.config.card_config = { ...prev.config.card_config, form_fields: newWidgetChannels }
      })
    }
  }

  const handleAddField = (value: string) => {
    if (value === '') return

    const fieldCount = flow.config?.card_config?.form_fields?.filter((item) => item.field_type === value)?.length || 0

    setFlow((prev) => {
      if (typeof prev.config?.card_config?.form_fields === 'undefined') {
        prev.config.card_config = { ...prev.config.card_config, form_fields: [] }
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config?.form_fields?.push({
        id: prev.config.card_config.maxId || 0,
        label: `${value.charAt(0).toUpperCase() + value.slice(1)} ${fieldCount == 0 ? '' : fieldCount + 1}`,
        field_type: value,
        required: true,
      })
    })
    onClose()
  }

  const handleFormChange = (value: string | number | boolean, key: string) => {
    setFlow((prev) => {
      prev.config.card_config = { ...prev.config.card_config, [key]: value }
    })
  }

  return (
    <>
      <VStack spacing={3} alignSelf="center" w="full" borderWidth={1} p={[2, 4]} rounded="md">
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
              <VStack w="full" spacing="3">
                {flow.config.card_config.form_fields.map((field, index) => <CustomFormField key={field.id} id={index} field={field} />)}

                {activeId ? (
                  <DragOverlay style={{ marginTop: 0 }}>
                    <CustomFormField
                      cursor="grabbing"
                      bg={bgColorToggle}
                      id={activeId}
                      field={flow.config?.card_config?.form_fields?.find((item) => +item.id === activeId)}
                    />
                  </DragOverlay>
                ) : null}
              </VStack>
            </SortableContext>
          </DndContext>
        )}

        <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose}>
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
                <Button onClick={() => handleAddField('rating')}>Rating</Button>
                {/*
                <Button onClick={() => handleAddField('feedback')}>Feedback</Button> 
                <Button onClick={() => handleAddField('file')}>File</Button>
                <Button onClick={() => handleAddField('select')}>Select</Button>
                */}
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </VStack>

      <FormControl>
        <FormLabel>Button Text</FormLabel>
        <Input
          value={flow.config?.card_config?.submit_button_text ?? 'Submit'}
          onChange={(e) => handleFormChange(e.target.value, 'submit_button_text')}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Success Message</FormLabel>
        <Input
          value={flow.config?.card_config?.success_message}
          placeholder="Submitted successfully"
          onChange={(e) => handleFormChange(e.target.value, 'success_message')}
        />
      </FormControl>

      <StoreResponses />

      <FormControl>
        <FormLabel>Send Mail To</FormLabel>
        <Input
          placeholder="Your email"
          value={flow.config?.card_config?.send_mail_to || ''}
          onChange={(e) => handleFormChange(e.target.value, 'send_mail_to')}
        />
      </FormControl>

      <ProWrapper>
        <FormControl>
          <FormLabel>Webhook URL</FormLabel>
          <Input
            placeholder="https://"
            value={flow.config?.card_config?.webhook_url || ''}
            onChange={(e) => handleFormChange(e.target.value, 'webhook_url')}
            tabIndex={config.IS_PRO ? 0 : -1}
          />
        </FormControl>
      </ProWrapper>

      <Stack w="full" spacing="0" gap="2" flexDirection={['column', 'row']}>
        <FormControl>
          <FormLabel>Form Theme Color</FormLabel>
          <ColorPickerWrap
            color={flow.config?.card_config?.card_bg_color}
            handleChange={(val: TColor) => handleColorChange(val, 'card_bg_color')}
            handleClose={() => { }}
          />
        </FormControl>

        <FormControl>
          <FormLabel>Form Text Color</FormLabel>
          <ColorPickerWrap
            color={flow.config?.card_config?.card_text_color}
            handleChange={(val: TColor) => handleColorChange(val, 'card_text_color')}
            handleClose={() => { }}
          />
        </FormControl>
      </Stack>
    </>
  )
}

export default CustomForm
