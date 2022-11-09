import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
  FormControl,
  FormLabel,
  Input,
  ModalFooter
} from '@chakra-ui/react'
import { defaultCreateWidgetInfo } from '@globalStates/DefaultStates'
import { CreateWidgetInfo } from '@globalStates/Interfaces'
import useCreateWidget from '@hooks/mutations/widget/useCreateWidget'
import useToaster from '@hooks/useToaster'
import { useState } from 'react'
import { HiPlus } from 'react-icons/hi'

function AddWidget() {
  const toaster = useToaster()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createWidgetInfo, setCreateWidgetInfo] = useState<CreateWidgetInfo>(defaultCreateWidgetInfo)
  const { createWidget, isWidgetCreating } = useCreateWidget(onClose, setCreateWidgetInfo)

  const addNewWidget = async () => {
    if (createWidgetInfo?.name === '') {
      return toaster('error', 'Widget name is required')
    }
    const { status, data } = await createWidget(createWidgetInfo)
    toaster(status, data)
  }

  const onModalClose = () => {
    onClose()
    setCreateWidgetInfo(defaultCreateWidgetInfo)
  }

  const handleChanges = (value: string, key: string) => {
    setCreateWidgetInfo((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <>
      <Button mb="4" mr="2" variant="outline" colorScheme="gray" leftIcon={<HiPlus />} onClick={onOpen}>
        Add Widget
      </Button>

      <Modal isCentered scrollBehavior="inside" size="2xl" isOpen={isOpen} onClose={onModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text>Create New Widget</Text>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isRequired>
              <FormLabel>Widget Name</FormLabel>
              <Input value={createWidgetInfo?.name ?? ''} onChange={(e) => handleChanges(e.target.value, 'name')} />
            </FormControl>
          </ModalBody>
          <ModalFooter gap="2">
            <Button onClick={onModalClose}>Cancel</Button>
            <Button colorScheme="purple" onClick={addNewWidget} isLoading={isWidgetCreating} loadingText="Creating..." spinnerPlacement="start">
              Create
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AddWidget
