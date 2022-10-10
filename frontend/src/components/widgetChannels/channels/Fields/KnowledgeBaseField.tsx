import { DragHandleIcon } from '@chakra-ui/icons'
import { Box, Flex, HStack, IconButton, Input, useColorMode, useColorModeValue } from '@chakra-ui/react'
import { useSortable } from '@dnd-kit/sortable'
import { FiChevronDown, FiX } from 'react-icons/fi'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { Editor } from '@tinymce/tinymce-react'

const KnowledgeBaseField = ({ id, field, ...props }) => {
  const [, setFlow] = useAtom(flowAtom)
  const [isEditing, setIsEditing] = useState(false)
  const { colorMode } = useColorMode()
  const bgColorToggle = useColorModeValue('white', 'gray.700')

  const { attributes, listeners, setNodeRef, transition, transform, isDragging } = useSortable({
    id: field.id,
  })

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
    opacity: isDragging ? 0.4 : 1,
    touchAction: 'pinch-zoom',
  }

  const handleDelete = (index: number) => {
    setFlow((prev) => {
      prev.config.card_config.knowledge_bases.splice(index, 1)
    })
  }

  const handleChange = (value: string | boolean | number, key: string, index: number) => {
    setFlow((prev) => {
      prev.config.card_config.knowledge_bases[index][key] = value
    })
  }

  return (
    <HStack w="full" style={style} ref={setNodeRef}>
      <HStack w="full" borderWidth={1} p="2" rounded="sm" bg={bgColorToggle}>
        <Flex
          {...listeners}
          {...attributes}
          rounded="sm"
          bg={props.bg}
          cursor={props.cursor || 'grab'}
          justifyContent={'center'}
          alignItems={'center'}
          w={6}
          h={8}
        >
          <DragHandleIcon aria-label="draggable button" />
        </Flex>
        <Box w="full">
          <HStack w="full" mb={'2'}>
            <Input value={field.title || ''} onChange={(e) => handleChange(e.target.value, 'title', id)} />
            <IconButton
              aria-label="Show Desc"
              onClick={() => setIsEditing((prev) => !prev)}
              size="sm"
              icon={<FiChevronDown />}
            />
          </HStack>
          {isEditing && (
            <Editor
              tinymceScriptSrc={'http://localhost:3000/tinymce/tinymce.min.js'}
              value={`${field.description}`}
              onEditorChange={(val, editor) => handleChange(val, 'description', id)}
              init={{
                height: 300,
                menubar: false,
                plugins: ['autolink', 'lists', 'link', 'image', 'code', 'table'],
                toolbar:
                  'undo redo | blocks | ' +
                  'bold italic link image forecolor | alignleft aligncenter ' +
                  'alignright alignjustify | bullist numlist outdent indent | ' +
                  'removeformat',
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

export default KnowledgeBaseField
