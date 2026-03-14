import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, Flex, HStack, IconButton, Input, useColorModeValue } from '@chakra-ui/react'
import QuillEditor from '@components/QuillEditor'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { flowAtom } from '@globalStates/atoms'
import { type KnowledgeBase } from '@globalStates/Interfaces'
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useState } from 'react'
import { FiChevronDown, FiX } from 'react-icons/fi'

interface KnowledgeBaseFieldProps {
  bg?: string
  cursor?: string
  field: KnowledgeBase | undefined
  id: number
}

function KnowledgeBaseField({ bg = 'none', cursor = 'grab', field, id }: KnowledgeBaseFieldProps) {
  const [, setFlow] = useAtom(flowAtom)
  const [isEditing, setIsEditing] = useState(false)
  const bgColorToggle = useColorModeValue('white', 'gray.700')

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
      prev.config?.card_config?.knowledge_bases?.splice(index, 1)
    })
  }

  const handleChange = (value: string, key: string, index: number) => {
    let changeValue = value
    if (key === 'description') {
      changeValue = value.replaceAll('<a', '<a target="_blank"')
    }

    setFlow(prev => {
      const newFields = [...(prev.config?.card_config?.knowledge_bases || [])]
      newFields[index] = { ...newFields[index], [key]: changeValue }
      prev.config.card_config = { ...prev.config.card_config, knowledge_bases: newFields }
    })
  }

  return (
    <HStack ref={setNodeRef} style={style} w="full">
      <HStack bg={bgColorToggle} borderWidth={1} p="2" rounded="md" shadow="base" w="full">
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
          <DragHandleIcon aria-label={__('draggable button', 'bit-assist')} />
        </Flex>
        <Box w="full">
          <HStack mb="2" w="full">
            <Input
              onChange={e => handleChange(e.target.value, 'title', id)}
              value={field?.title || ''}
            />
            <IconButton
              aria-label={__('Show description', 'bit-assist')}
              icon={<FiChevronDown />}
              onClick={() => setIsEditing(prev => !prev)}
              size="sm"
            />
          </HStack>
          {isEditing && (
            <QuillEditor
              defaultValue={field?.description}
              onChange={val => handleChange(val, 'description', id)}
              tools={[
                [{ header: [1, 2, 3, 4, false] }],
                [{ list: 'ordered' }, { list: 'bullet' }],
                ['bold', 'italic', 'underline', 'link', 'image'],
                [{ align: '' }, { align: 'center' }, { align: 'right' }, 'clean']
              ]}
            />
          )}
        </Box>
      </HStack>
      <Box>
        <IconButton
          aria-label={__('Delete', 'bit-assist')}
          icon={<FiX />}
          isRound
          onClick={() => handleDelete(id)}
          size="sm"
        />
      </Box>
    </HStack>
  )
}

export default KnowledgeBaseField
