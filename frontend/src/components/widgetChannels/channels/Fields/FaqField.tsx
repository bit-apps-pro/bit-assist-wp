/* eslint-disable react/jsx-props-no-spreading */
import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, Flex, HStack, IconButton, Input, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { FiChevronDown, FiX } from 'react-icons/fi'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { Editor } from '@tinymce/tinymce-react'
import { Faqs } from '@globalStates/Interfaces'
import config from '@config/config'

interface FaqFieldProps {
  id: number
  field: Faqs | undefined
  cursor?: string
  bg?: string
}

function FaqField({ id, field, cursor = 'grab', bg = 'none' }: FaqFieldProps) {
  const [, setFlow] = useAtom(flowAtom)
  const [isEditing, setIsEditing] = useState(false)
  const { colorMode } = useColorMode()
  const bgColorToggle = useColorModeValue('white', 'gray.700')

  const {
    attributes, listeners, setNodeRef, transition, transform, isDragging,
  } = useSortable({
    id: field?.id || 0,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'pinch-zoom',
  }

  const handleDelete = (index: number) => {
    setFlow((prev) => {
      prev.config?.card_config?.faqs?.splice(index, 1)
    })
  }

  const handleChange = (value: string | boolean | number, key: string, index: number) => {
    setFlow((prev) => {
      const newFields = [...(prev.config?.card_config?.faqs || [])]
      newFields[index] = { ...newFields[index], [key]: value }
      prev.config.card_config = { ...prev.config.card_config, faqs: newFields }
    })
  }

  return (
    <HStack w="full" style={style} ref={setNodeRef}>
      <HStack w="full" borderWidth={1} p="2" shadow="base" rounded="md" bg={bgColorToggle}>
        <Flex
          {...listeners}
          {...attributes}
          rounded="sm"
          bg={bg}
          cursor={cursor}
          justifyContent="center"
          alignItems="center"
          w={6}
          h={8}
        >
          <DragHandleIcon aria-label="draggable button" />
        </Flex>
        <Box w="full">
          <HStack w="full" mb="2">
            <Input value={field?.title || ''} onChange={(e) => handleChange(e.target.value, 'title', id)} />
            <IconButton
              aria-label="Show Desc"
              onClick={() => setIsEditing((prev) => !prev)}
              size="sm"
              icon={<FiChevronDown />}
            />
          </HStack>
          {isEditing && (
            <Editor
              tinymceScriptSrc={`${config.ROOT_URL}/assets/tinymce/tinymce.min.js`}
              value={`${field?.description}`}
              onEditorChange={(val, editor) => handleChange(val, 'description', id)}
              init={{
                height: 200,
                menubar: false,
                plugins: ['autolink', 'link'],
                toolbar: 'bold italic link',
                link_default_target: '_blank',
                link_target_list: false,
                skin: colorMode === 'dark' ? 'oxide-dark' : 'oxide',
                content_css: colorMode === 'dark' ? 'dark' : 'default',
                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
              }}
            />
          )}
        </Box>
      </HStack>
      <Box>
        <IconButton aria-label="Delete Icon" size="sm" isRound icon={<FiX />} onClick={() => handleDelete(id)} />
      </Box>
    </HStack>
  )
}

export default FaqField
