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
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
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
  useSensors,
} from '@dnd-kit/core'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { FiPlus } from 'react-icons/fi'
import StoreResponses from '@components/widgetChannels/StoreResponses'
import ProWrapper from '@components/global/ProWrapper'
import config from '@config/config'
import CardColors from './common/CardColors'
import Title from '@components/global/Title'

export default function WooCommerce() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [activeId, setActiveId] = useState<number>(0)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.500')
  const { onOpen, onClose, isOpen } = useDisclosure()

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
        label: `${value.charAt(0).toUpperCase() + value.slice(1)}${fieldCount == 0 ? '' : ` ${fieldCount + 1}`}`,
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
      {/* Customer's Fields */}
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
                {flow.config.card_config.form_fields.map((field, index) => (
                  <CustomFormField key={field.id} id={index} field={field} />
                ))}

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
            <Button rightIcon={<FiPlus />}>Customer's Field</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <SimpleGrid columns={3} gap={1}>
                <Button onClick={() => handleAddField('text')}>First Name</Button>
                <Button onClick={() => handleAddField('text')}>Last Name</Button>
                <Button onClick={() => handleAddField('order')}>Order No</Button>
                <Button onClick={() => handleAddField('email')}>Email</Button>
                <Button onClick={() => handleAddField('phone')}>Phone</Button>
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </VStack>

      {/* Customer Can See
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
                {flow.config.card_config.form_fields.map((field, index) => (
                  <CustomFormField key={field.id} id={index} field={field} />
                ))}

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
            <Button rightIcon={<FiPlus />}>Customer's Field</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverArrow />
            <PopoverBody>
              <SimpleGrid columns={3} gap={1}>
                <Button onClick={() => handleAddField('text')}>First Name</Button>
                <Button onClick={() => handleAddField('text')}>Last Name</Button>
                <Button onClick={() => handleAddField('number')}>Order No</Button>
                <Button onClick={() => handleAddField('email')}>Email</Button>
                <Button onClick={() => handleAddField('email')}>Phone</Button>
              </SimpleGrid>
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </VStack> */}

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

      <CardColors bg="#0038FF" color="#fff" />
    </>
  )
}
