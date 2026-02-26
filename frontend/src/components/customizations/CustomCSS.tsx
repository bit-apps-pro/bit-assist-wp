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
import { __ } from '@wordpress/i18n'
import { useAtom } from 'jotai'
import { useState } from 'react'

function CustomCSS() {
  const [widget, setWidget] = useAtom(widgetAtom)
  const { isWidgetUpdating, updateWidget } = useUpdateWidgetPro()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const toaster = useToaster()
  const tabIndex = config.IS_PRO ? 0 : -1
  const [customCss, setCustomCss] = useState<string | undefined>()

  const handleSaveCustomCSS = async () => {
    const { data, status } = await updateWidget({ ...widget, custom_css: customCss })

    setWidget(prev => {
      prev.custom_css = customCss
    })

    toaster(status, data)
    onClose()
  }

  return (
    <Box maxW="lg">
      <Title>{__('Custom CSS', 'bit-assist')}</Title>
      <ProWrapper>
        <Textarea
          color="inherit"
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
          <ModalHeader py="2">{__('Custom CSS', 'bit-assist')}</ModalHeader>
          <ModalCloseButton />
          <ModalBody p="0">
            <Box boxShadow="md">
              <Editor
                defaultLanguage="css"
                defaultValue={widget.custom_css}
                height="40vh"
                onChange={setCustomCss}
                theme="vs-dark"
                value={customCss || ''}
                width="100%"
              />
            </Box>
          </ModalBody>
          <ModalFooter py="2">
            <Button mr={3} onClick={onClose}>
              {__('Cancel', 'bit-assist')}
            </Button>
            <Button
              colorScheme="purple"
              isLoading={isWidgetUpdating}
              loadingText={__('Updating...', 'bit-assist')}
              onClick={handleSaveCustomCSS}
              shadow="md"
            >
              {__('Update', 'bit-assist')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default CustomCSS
