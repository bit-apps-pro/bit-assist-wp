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
  ModalFooter,
  useToast,
} from '@chakra-ui/react'
import { defaultCreateWidgetInfo } from '@globalStates/DefaultStates'
import { CreateWidgetInfo } from '@globalStates/Interfaces'
import useCreateWidget from '@hooks/mutations/widget/useCreateWidget'
import { useState } from 'react'
import { HiPlus } from 'react-icons/hi'

const AddWidget = () => {
  const toast = useToast({ isClosable: true })
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [createWidgetInfo, setCreateWidgetInfo] = useState<CreateWidgetInfo>(defaultCreateWidgetInfo)
  const { createWidget, isWidgetCreating } = useCreateWidget(onClose, setCreateWidgetInfo)

  const addNewWidget = async () => {
    if (createWidgetInfo?.name === '') {
      return toast({ title: 'Widget name is required', position: 'top-right', status: 'error' })
    }
    createWidget(createWidgetInfo)
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
          <ModalBody pb="4">
            <FormControl isRequired>
              <FormLabel htmlFor="name">Widget Name</FormLabel>
              <Input id="name" value={createWidgetInfo?.name ?? ''} onChange={(e) => handleChanges(e.target.value, 'name')} />
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
