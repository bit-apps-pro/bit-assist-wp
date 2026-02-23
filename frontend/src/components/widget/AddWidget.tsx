import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure
} from '@chakra-ui/react'
import { defaultCreateWidgetInfo } from '@globalStates/DefaultStates'
import { type CreateWidgetInfo } from '@globalStates/Interfaces'
import { __ } from '@helpers/i18nwrap'
import useCreateWidget from '@hooks/mutations/widget/useCreateWidget'
import useToaster from '@hooks/useToaster'
import { useState } from 'react'
import { HiPlus } from 'react-icons/hi'

function AddWidget() {
  const toaster = useToaster()
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [createWidgetInfo, setCreateWidgetInfo] = useState<CreateWidgetInfo>(defaultCreateWidgetInfo())
  const { createWidget, isWidgetCreating } = useCreateWidget(onClose, setCreateWidgetInfo)

  const addNewWidget = async () => {
    if (createWidgetInfo?.name === '') {
      return toaster('error', __('Widget name is required'))
    }
    const { data, status } = await createWidget(createWidgetInfo)
    toaster(status, data)
  }

  const onModalClose = () => {
    onClose()
    setCreateWidgetInfo(defaultCreateWidgetInfo())
  }

  const handleChanges = (value: string, key: string) => {
    setCreateWidgetInfo(prev => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <Button
        colorScheme="purple"
        leftIcon={<HiPlus />}
        mb="4"
        mr="2"
        onClick={onOpen}
        variant="outline"
      >
        {__('Add Widget')}
      </Button>

      <Modal isCentered isOpen={isOpen} onClose={onModalClose} scrollBehavior="inside" size="2xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>{__('Create New Widget')}</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>{__('Widget Name')}</FormLabel>
              <Input
                onChange={e => handleChanges(e.target.value, 'name')}
                value={createWidgetInfo?.name ?? ''}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter gap="2">
            <Button onClick={onModalClose}>{__('Cancel')}</Button>
            <Button
              colorScheme="purple"
              isLoading={isWidgetCreating}
              loadingText={__('Creating...')}
              onClick={addNewWidget}
              spinnerPlacement="start"
            >
              {__('Create')}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddWidget
