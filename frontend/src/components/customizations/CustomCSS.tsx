/* eslint-disable unicorn/filename-case */
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
import ProWrapper from '@components/global/ProWrapper'
import Title from '@components/global/Title'
import config from '@config/config'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidgetPro from '@hooks/mutations/widget/useUpdateWidgetPro'
import useToaster from '@hooks/useToaster'
import Editor from '@monaco-editor/react'
import { useAtom } from 'jotai'

function CustomCSS() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { isWidgetUpdating, updateWidget } = useUpdateWidgetPro()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1

  const handleChangeCustomCSS = (value: string | undefined) => {
    setWidget(prev => {
      prev.custom_css = value
    })
  }

  const handleSaveCustomCSS = async () => {
    const { data, status } = await updateWidget(widget)
    toaster(status, data)
    onClose()
  }

  return (
    <Box maxW="lg">
      <Title>Custom CSS</Title>
      <ProWrapper>
        <Textarea
          cursor="pointer"
          filter="auto"
          h="36"
          onClick={onOpen}
          readOnly
          tabIndex={tabIndex}
          value={widget.custom_css || ''}
        />
      </ProWrapper>

      <Modal id="custom_css" isCentered isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader py="2">Custom CSS</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            <Box boxShadow="md">
              <Editor
                defaultLanguage="css"
                height="40vh"
                onChange={handleChangeCustomCSS}
                theme="vs-dark"
                value={widget.custom_css || ''}
                width="100%"
              />
            </Box>
          </ModalBody>
          <ModalFooter py="2">
            <Button mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              isLoading={isWidgetUpdating}
              loadingText="Updating..."
              onClick={handleSaveCustomCSS}
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
