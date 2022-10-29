import { Spinner, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import { WidgetChannelType } from '@globalStates/Interfaces'
import useFetchWidgetChannels from '@hooks/queries/widgetChannel/useFetchWidgetChannels'
import WidgetChanel from '@components/widgetChannels/WidgetChannel'
import { closestCenter, DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { useEffect, useState } from 'react'
import { useAtom } from 'jotai'
import { flowAtom, widgetChannelOrderAtom } from '@globalStates/atoms'
import useUpdateWidgetChannelsSequence from '@hooks/mutations/widgetChannel/useUpdateWidgetChannelsSequence'

function ChannelsList() {
  const { widgetChannels, isWidgetChannelsFetching } = useFetchWidgetChannels()
  const { updateWidgetChannelsOrder } = useUpdateWidgetChannelsSequence()
  const [activeId, setActiveId] = useState<number>(0)
  const [, setChannelOrder] = useAtom(widgetChannelOrderAtom)
  const [, setFlow] = useAtom(flowAtom)
  const bgColorToggle = useColorModeValue('gray.100', 'gray.600')

  useEffect(() => {
    if (widgetChannels?.length < 1) return
    let maxNumber = 0
    widgetChannels?.map((item: WidgetChannelType) => {
      if (item.sequence > maxNumber) {
        maxNumber = item.sequence
      }
    })
    setChannelOrder(maxNumber + 1)
    setFlow((prev) => {
      prev.sequence = maxNumber + 1
    })
  }, [widgetChannels])

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
      const oldIndex = widgetChannels.findIndex((item: WidgetChannelType) => item?.id === e.active.id)
      const newIndex = widgetChannels.findIndex((item: WidgetChannelType) => item?.id === e.over?.id)
      const newWidgetChannels: WidgetChannelType[] = arrayMove(widgetChannels, oldIndex, newIndex)
      updateWidgetChannelsOrder(newWidgetChannels, newIndex, oldIndex)
    }
  }

  return (
    <>
      {isWidgetChannelsFetching && <Spinner />}
      {widgetChannels?.length < 1 && <Text>Create new channel from here.</Text>}
      {!!widgetChannels?.length && (
        <DndContext
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
        >
          <SortableContext items={widgetChannels.map((item: WidgetChannelType) => item.id)} strategy={verticalListSortingStrategy}>
            <VStack>
              {widgetChannels?.map((widgetChannel: WidgetChannelType) => (
                <WidgetChanel key={widgetChannel.id} widgetChannel={widgetChannel} />
              ))}

              {activeId ? (
                <DragOverlay style={{ marginTop: 0 }}>
                  <WidgetChanel
                    shadow="md"
                    cursor="grabbing"
                    bg={bgColorToggle}
                    widgetChannel={widgetChannels.find((item: WidgetChannelType) => +item.id === activeId)}
                  />
                </DragOverlay>
              ) : null}
            </VStack>
          </SortableContext>
        </DndContext>
      )}
    </>
  )
}

export default ChannelsList
