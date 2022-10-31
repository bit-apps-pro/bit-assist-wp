import { Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import Editor from '@monaco-editor/react'
import { useAtom } from 'jotai'
import config from '@config/config'
import ProWrapper from '@components/global/ProWrapper'

function CustomCSS() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()
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
          onClick={onOpen}
          filter="auto"
          blur="1.1px"
          h="36"
          cursor="pointer"
          overflow="hidden"
          bg="gray.800"
          color="green.500"
          value={widget.custom_css || '/*write your custom css here*/'}
          readOnly
          tabIndex={tabIndex}
        />
      </ProWrapper>

      <Modal id="custom_css" size="2xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Custom CSS</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box boxShadow="md">
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
              shadow="md"
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
