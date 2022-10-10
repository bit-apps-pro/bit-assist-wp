import { Button, FormControl, FormLabel, Stack, useColorModeValue, VStack } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import React, { useEffect, useState } from 'react'
import { TColor } from '@atomik-color/core/dist/types'
import { str2Color } from '@atomik-color/core'
import ColorPickerWrap from '@components/global/ColorPickerWrap'
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
import FaqField from '@components/widgetChannels/channels/Fields/FaqField'

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
      prev.config.card_config = { card_bg_color: str2Color('#424b67'), card_text_color: str2Color('#fff') }
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
      const oldIndex = flow.config?.card_config?.faqs.findIndex((item) => item?.id === active?.id)
      const newIndex = flow.config?.card_config?.faqs.findIndex((item) => item?.id === over?.id)
      const newWidgetChannels = arrayMove(flow.config?.card_config?.faqs, oldIndex, newIndex)
      setFlow((prev) => {
        prev.config.card_config.faqs = newWidgetChannels
      })
    }
  }

  const handleAddField = () => {
    setFlow((prev) => {
      if (typeof prev.config?.card_config?.faqs === 'undefined') {
        prev.config.card_config.faqs = []
      }
      prev.config.card_config.maxId = (prev.config.card_config.maxId || 0) + 1
      prev.config.card_config.faqs.push({
        id: prev.config.card_config.maxId,
        title: 'FAQ Title',
        description: 'FAQ Description',
      })
    })
  }

  return (
    <>
      <VStack alignSelf={'center'} w="full">
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
              <VStack w="full">
                {flow.config.card_config.faqs.map((field, index) => {
                  return <FaqField key={field.id} id={index} field={field} />
                })}

                <DragOverlay style={{ marginTop: 0 }}>
                  {activeId && (
                    <FaqField
                      shadow="lg"
                      cursor="grabbing"
                      bg={bgColorToggle}
                      id={activeId}
                      field={flow.config.card_config.faqs.find((item) => item.id == activeId)}
                    />
                  )}
                </DragOverlay>
              </VStack>
            </SortableContext>
          </DndContext>
        )}

        <Button rightIcon={<FiPlus />} onClick={handleAddField}>
          Add FAQ
        </Button>
      </VStack>

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
    </>
  )
}

export default CustomForm
