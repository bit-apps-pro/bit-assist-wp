import { Button, useColorModeValue, VStack } from '@chakra-ui/react'
import KnowledgeBaseField from '@components/widgetChannels/channels/Fields/KnowledgeBaseField'
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
import { useState } from 'react'
import { FiPlus } from 'react-icons/fi'

import CardColors from './common/CardColors'

function KnowledgeBase() {
  const [flow, setFlow] = useAtom(flowAtom)
  const [activeId, setActiveId] = useState<number>(0)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.500')

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragStart = (e: DragStartEvent) => {
    const { id } = e.active
    setActiveId(+id)
  }

  const handleDragEnd = (e: DragEndEvent) => {
    setActiveId(0)
    if (e.active.id !== e.over?.id) {
      const oldIndex =
        flow.config?.card_config?.knowledge_bases?.findIndex(item => item?.id === e.active.id) || 0
      const newIndex =
        flow.config?.card_config?.knowledge_bases?.findIndex(item => item?.id === e.over?.id) || 0
      const newWidgetChannels = arrayMove(
        flow.config?.card_config?.knowledge_bases || [],
        oldIndex,
        newIndex
      )
      setFlow(prev => {
        prev.config.card_config = { ...prev.config.card_config, knowledge_bases: newWidgetChannels }
      })
    }
  }

  const handleAddField = () => {
    setFlow(prev => {
      if (prev.config?.card_config?.knowledge_bases === undefined) {
        prev.config.card_config = { ...prev.config.card_config, knowledge_bases: [] }
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config?.knowledge_bases?.push({
        description: __('Knowledge Base Description', 'bit-assist'),
        id: prev.config.card_config.maxId || 0,
        title: __('Knowledge Base Title', 'bit-assist')
      })
    })
  }

  return (
    <>
      <VStack alignSelf="center" borderWidth={1} p={[2, 4]} rounded="md" spacing={3} w="full">
        {flow.config?.card_config?.knowledge_bases && (
          <DndContext
            collisionDetection={closestCenter}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
            sensors={sensors}
          >
            <SortableContext
              items={flow.config.card_config.knowledge_bases.map(item => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <VStack spacing={3} w="full">
                {flow.config.card_config.knowledge_bases.map((field, index) => (
                  <KnowledgeBaseField field={field} id={index} key={field.id} />
                ))}

                {activeId ? (
                  <DragOverlay style={{ marginTop: 0 }}>
                    <KnowledgeBaseField
                      bg={bgColorToggle}
                      cursor="grabbing"
                      field={flow.config.card_config.knowledge_bases.find(item => +item.id === activeId)}
                      id={activeId}
                    />
                  </DragOverlay>
                ) : undefined}
              </VStack>
            </SortableContext>
          </DndContext>
        )}

        <Button onClick={handleAddField} rightIcon={<FiPlus />}>
          {__('Add KB', 'bit-assist')}
        </Button>
      </VStack>

      <CardColors bg="#1EDFD4" color="#fff" />
    </>
  )
}

export default KnowledgeBase
