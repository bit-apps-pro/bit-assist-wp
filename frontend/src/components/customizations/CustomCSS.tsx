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
  useDisclosure
} from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidgetPro from '@hooks/mutations/widget/useUpdateWidgetPro'
import Editor from '@monaco-editor/react'
import { useAtom } from 'jotai'
import config from '@config/config'
import ProWrapper from '@components/global/ProWrapper'

function CustomCSS() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidgetPro()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1

  const handleChangeCustomCSS = (value: string | undefined) => {
    setWidget((prev) => {
      prev.custom_css = value
    })
  }

  const handleSaveCustomCSS = async () => {
    const { status, data } = await updateWidget(widget)
    toaster(status, data)
    onClose()
  }

  return (
    <Box maxW="lg">
      <Title>Custom CSS</Title>
      <ProWrapper>
        <Textarea
          h="36"
          readOnly
          filter="auto"
          cursor="pointer"
          overflow="hidden"
          onClick={onOpen}
          value={widget.custom_css || ''}
          tabIndex={tabIndex}
        />
      </ProWrapper>

      <Modal id="custom_css" size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="2">Custom CSS</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            <Box boxShadow="md">
              <Editor
                height="40vh"
                width="100%"
                theme="vs-dark"
                onChange={handleChangeCustomCSS}
                defaultLanguage="css"
                value={widget.custom_css || ''}
              />
            </Box>
          </ModalBody>
          <ModalFooter py="2">
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleSaveCustomCSS}
              isLoading={isWidgetUpdating}
              loadingText="Updating..."
              colorScheme="purple"
              shadow="md"
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default CustomCSS
