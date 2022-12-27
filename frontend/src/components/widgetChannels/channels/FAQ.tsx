import { Button, useColorModeValue, VStack } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
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
import FaqField from '@components/widgetChannels/channels/Fields/FaqField'
import CardColors from './common/CardColors'

function CustomForm() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [activeId, setActiveId] = useState<number>(0)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.500')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  )

  const handleDragStart = (e: DragStartEvent) => {
    const { id } = e.active
    setActiveId(+id)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(0)
    if (e.active.id !== e.over?.id) {
      const oldIndex = flow.config?.card_config?.faqs?.findIndex((item) => item?.id === e.active.id) || 0
      const newIndex = flow.config?.card_config?.faqs?.findIndex((item) => item?.id === e.over?.id) || 0
      const newWidgetChannels = arrayMove(flow.config?.card_config?.faqs || [], oldIndex, newIndex)
      setFlow((prev) => {
        prev.config.card_config = { ...prev.config.card_config, faqs: newWidgetChannels }
      })
    }
  }

  const handleAddField = () => {
    setFlow((prev) => {
      if (typeof prev.config?.card_config?.faqs === 'undefined') {
        prev.config.card_config = { ...prev.config.card_config, faqs: [] }
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config?.faqs?.push({
        id: prev.config.card_config.maxId,
        title: 'FAQ Title',
        description: 'FAQ Description',
      })
    })
  }

  return (
    <>
      <VStack spacing={3} alignSelf="center" w="full" borderWidth={1} p={[2, 4]} rounded="md">
        {flow.config?.card_config?.faqs && (
          <DndContext
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            <SortableContext
              items={flow.config.card_config.faqs.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack spacing={3} w="full">
                {flow.config.card_config.faqs.map((field, index) => (
                  <FaqField key={field.id} id={index} field={field} />
                ))}

                {activeId ? (
                  <DragOverlay style={{ marginTop: 0 }}>
                    <FaqField
                      cursor="grabbing"
                      bg={bgColorToggle}
                      id={activeId}
                      field={flow.config.card_config.faqs.find((item) => +item.id === activeId)}
                    />
                  </DragOverlay>
                ) : null}
              </VStack>
            </SortableContext>
          </DndContext>
        )}

        <Button rightIcon={<FiPlus />} onClick={handleAddField}>
          Add FAQ
        </Button>
      </VStack>

      <CardColors bg="#424b67" color="#fff" />
    </>
  )
}

export default CustomForm
