import { Spinner, Text, useColorModeValue, VStack } from '@chakra-ui/react'
import WidgetChanel from '@components/widgetChannels/WidgetChannel'
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
import { flowAtom, widgetChannelOrderAtom } from '@globalStates/atoms'
import { type WidgetChannelType } from '@globalStates/Interfaces'
import { __ } from '@helpers/i18nwrap'
import useUpdateWidgetChannelsSequence from '@hooks/mutations/widgetChannel/useUpdateWidgetChannelsSequence'
import useFetchWidgetChannels from '@hooks/queries/widgetChannel/useFetchWidgetChannels'
import { useAtom } from 'jotai'
import { useEffect, useMemo, useState } from 'react'

function ChannelsList() {
  const { isWidgetChannelsFetching, widgetChannels } = useFetchWidgetChannels()
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

    setFlow(prev => {
      prev.sequence = maxNumber + 1
    })
  }, [widgetChannels])

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
      const oldIndex = widgetChannels.findIndex((item: WidgetChannelType) => item?.id === e.active.id)
      const newIndex = widgetChannels.findIndex((item: WidgetChannelType) => item?.id === e.over?.id)
      const newWidgetChannels: WidgetChannelType[] = arrayMove(widgetChannels, oldIndex, newIndex)
      updateWidgetChannelsOrder(newWidgetChannels)
    }
  }

  const channelIds = useMemo(
    () => widgetChannels?.map((item: WidgetChannelType) => item.id),
    [widgetChannels]
  )

  return (
    <>
      {isWidgetChannelsFetching && <Spinner />}
      {widgetChannels?.length < 1 && <Text>{__('Create new channel from here.')}</Text>}
      {!!widgetChannels?.length && (
        <DndContext
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <SortableContext items={channelIds} strategy={verticalListSortingStrategy}>
            <VStack>
              {widgetChannels?.map((widgetChannel: WidgetChannelType) => (
                <WidgetChanel key={widgetChannel.id} widgetChannel={widgetChannel} />
              ))}

              {activeId ? (
                <DragOverlay style={{ marginTop: 0 }}>
                  <WidgetChanel
                    bg={bgColorToggle}
                    cursor="grabbing"
                    shadow="md"
                    widgetChannel={widgetChannels.find(
                      (item: WidgetChannelType) => +item.id === activeId
                    )}
                  />
                </DragOverlay>
              ) : undefined}
            </VStack>
          </SortableContext>
        </DndContext>
      )}
    </>
  )
}

export default ChannelsList
