import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import ResponseToast from '@components/global/ResponseToast'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import Editor from '@monaco-editor/react'
import { useAtom } from 'jotai'

const CustomCSS = () => {
  const toast = useToast({ isClosable: true })
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleChangeCustomCSS = (value: string) => {
    setWidget((prev) => {
      prev.custom_css = value
    })
  }

  const handleSaveCustomCSS = async () => {
    const response = await updateWidget(widget)
    ResponseToast({ toast, response, action: 'update', messageFor: 'Widget custom css' })
    onClose()
  }

  return (
    <Box>
      <Title>Custom CSS</Title>
      <Textarea
        onClick={onOpen}
        filter="auto"
        blur="1.1px"
        w="80"
        h="32"
        cursor="pointer"
        overflow="hidden"
        bg="gray.800"
        color="green.500"
        value={widget.custom_css || '/*write your custom css here*/'}
        readOnly
      />

      <Modal id="custom_css" size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Custom CSS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box boxShadow={'md'}>
              <Editor
                height="40vh"
                width="100%"
                theme="vs-dark"
                onChange={handleChangeCustomCSS}
                defaultLanguage="css"
                defaultValue="/*write your custom css here*/"
                value={widget.custom_css || ''}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomCSS}
              isLoading={isWidgetUpdating}
              loadingText="Updating..."
              colorScheme="purple"
              shadow={'md'}
            >
              update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default CustomCSS
