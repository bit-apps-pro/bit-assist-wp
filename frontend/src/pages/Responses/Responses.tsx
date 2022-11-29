import {
  Button,
  Checkbox,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Badge,
  useDisclosure,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Tooltip,
  Link,
  useColorModeValue,
  Flex
} from '@chakra-ui/react'
import { WidgetResponse } from '@globalStates/Interfaces'
import useFetchResponses from '@hooks/queries/response/useFetchResponses'
import useDeleteResponses from '@hooks/mutations/response/useDeleteResponses'
import { textTrim, toSlug } from '@utils/utils'
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { FiDownload, FiEye, FiFile, FiTrash2 } from 'react-icons/fi'
import Pagination from '@components/global/Pagination'
import useFetchOthersData from '@hooks/queries/response/useFetchOthersData'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import style from './Response.module.css'

import config from '@config/config'

export default function Responses() {
  const [pageLimit, setPageLimit] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { othersData } = useFetchOthersData()
  const { widgetResponses, isResponsesLoading, isFetching, isFetched } = useFetchResponses(pageLimit, pageNumber)
  const { deleteResponses, isResponsesDeleting } = useDeleteResponses(pageLimit, pageNumber)
  const { isOpen, onOpen: openDelModal, onClose: closeDelModal } = useDisclosure()
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const navigate = useNavigate()
  const { isOpen: isDrawerOpen, onOpen: onDrawerOpen, onClose: onDrawerClose } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const drawerResponse = useRef<WidgetResponse | null>(null)

  const handleDeleteWidget = async () => {
    await deleteResponses(checkedItems)
    setCheckedItems([])
    closeDelModal()
  }

  const convertDate = (date: string) => {
    const dateObj = new Date(date)
    return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, responseId: string) => {
    const { checked } = e.target
    setCheckedItems((prev: any) => {
      if (checked) {
        return [...prev, responseId]
      }
      return prev.filter((item: any) => item !== responseId)
    })
  }

  const handleCheckAllBox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target
    setCheckedItems(() => {
      if (checked) {
        return widgetResponses?.map((item: WidgetResponse) => item.id)
      }
      return []
    })
  }

  useEffect(() => {
    if (checkedItems?.length < 1) return
    setCheckedItems([])
  }, [pageNumber, pageLimit])

  const handleResponseClick = (widgetResponse: WidgetResponse) => {
    drawerResponse.current = widgetResponse
    onDrawerOpen()
  }

  const handleDrawerClose = () => {
    drawerResponse.current = null
    onDrawerClose()
  }

  return (
    <>
      <HStack mb="4" flexWrap="wrap">
        <HStack alignItems="center">
          <Button p="1" size="sm" variant="ghost" onClick={() => navigate(-1)}>
            <MdArrowBackIosNew size="1rem" aria-label="back button" />
          </Button>
          <Text as="h2" fontSize="lg" textTransform="none">
            Response List
            {' '}
            {othersData?.channelName && `- ${othersData.channelName}`}
          </Text>
          {isResponsesLoading && <Spinner />}
        </HStack>
        <SelectedDeleteBtn checkedItems={checkedItems} openDelModal={openDelModal} />
      </HStack>

      <TableContainer borderWidth="1px" rounded="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th w="4">
                <Checkbox
                  colorScheme="purple"
                  isChecked={widgetResponses?.length && widgetResponses.length === checkedItems?.length}
                  isIndeterminate={!!(checkedItems?.length && checkedItems.length < widgetResponses?.length)}
                  onChange={handleCheckAllBox}
                  aria-label="select all"
                />
              </Th>
              {othersData?.formFields?.map((field: { id: string; label: string }) => (
                <Th key={`${field.id}th`}>{textTrim(field.label, 20)}</Th>
              ))}
              <Th w="6">Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(widgetResponses)
              && widgetResponses.map((widgetResponse: WidgetResponse) => (
                <Tr key={widgetResponse.id}>
                  <Td py='2'>
                    <HStack spacing={3}>
                      <Checkbox
                        colorScheme="purple"
                        isChecked={!!checkedItems.includes(widgetResponse.id)}
                        onChange={(e) => handleCheckboxChange(e, widgetResponse.id)}
                        aria-label="select single checkbox"
                      />
                      <IconButton
                        ref={btnRef}
                        onClick={() => handleResponseClick(widgetResponse)}
                        aria-label='detailed view' icon={<FiEye fontSize={'1rem'} />} size='sm' h='auto' variant={'unstyled'}
                      />
                    </HStack>
                  </Td>

                  {othersData?.formFields?.map((field: { id: string; label: string }) => {
                    const isFile = typeof widgetResponse.response[toSlug(field.label, '_')] === 'object'

                    return (
                      <Td key={`${field.id}td`} maxW={isFile ? '300px' : 'auto'} py='2'>
                        {isFile ? (
                          <HStack overflow='hidden' spacing={1}>
                            <DownloadLinks
                              files={widgetResponse.response[toSlug(field.label, '_')]}
                              widgetChannelId={widgetResponse.widget_channel_id} />
                          </HStack>
                        )
                          : textTrim(widgetResponse.response[toSlug(field.label, '_')], 40)}
                      </Td>
                    )
                  })}

                  <Td py='2'>{convertDate(widgetResponse.created_at)}</Td>
                </Tr>
              ))}
            {widgetResponses?.length < 1 && (
              <Tr>
                <Td rowSpan={3}>No responses</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {!isResponsesLoading && (
        <Pagination
          pageNumber={pageNumber}
          pageLimit={pageLimit}
          totalResponses={othersData?.totalResponses || 0}
          setPageNumber={setPageNumber}
          setPageLimit={setPageLimit}
        >
          {!isFetched && isFetching && <Spinner size="sm" />}
        </Pagination>
      )}

      <ResponseDrawer
        drawerResponse={drawerResponse.current}
        isDrawerOpen={isDrawerOpen}
        handleDrawerClose={handleDrawerClose}
        btnRef={btnRef} />

      <ResponseModal
        isOpen={isOpen}
        closeDelModal={closeDelModal}
        handleDeleteWidget={handleDeleteWidget}
        isResponsesDeleting={isResponsesDeleting} />
    </>
  )
}

type DownloadLinksProps = { files: string[], widgetChannelId: string }

function DownloadLinks({ files, widgetChannelId }: DownloadLinksProps) {
  const grayColorToggle = useColorModeValue('gray.200', 'gray.600')

  return (
    <>
      {files.map((file: string) => {
        const { AJAX_URL, NONCE, ROUTE_PREFIX } = config
        const uri = new URL(AJAX_URL)
        uri.searchParams.append('action', `${ROUTE_PREFIX}downloadResponseFile`)
        uri.searchParams.append('_ajax_nonce', NONCE)
        uri.searchParams.append('widgetChannelID', widgetChannelId)
        uri.searchParams.append('fileID', file)
        uri.searchParams.append('fileName', file)

        return (
          <Tooltip placement='top' key={Math.random()} label={file}>
            <Flex className={style.downloadLink} gap='0.5'>
              <Link
                target='_blank'
                href={uri.href}
                display='flex' alignItems="center" gap='1'
                h='7'
              >
                <FiFile fontSize='0.875rem' />
                {textTrim(file, 6)}
              </Link>
              <Link
                href={`${uri.href}&download`}
                className={style.fileDownloadIcon} rounded='full' p='1.5' _hover={{ backgroundColor: grayColorToggle }}>
                <FiDownload fontSize='0.875rem' />
              </Link>
            </Flex>
          </Tooltip>
        )
      })}
    </>
  )
}

type SelectedDeleteBtnProps = { checkedItems: string[]; openDelModal: () => void }

function SelectedDeleteBtn({ checkedItems, openDelModal }: SelectedDeleteBtnProps) {
  return (
    <>
      {checkedItems?.length ? (
        <HStack spacing={1}>
          <IconButton
            onClick={openDelModal}
            fontSize="1rem"
            size="sm"
            rounded="full"
            aria-label="Delete Icon"
            variant="ghost"
            icon={<FiTrash2 />}
          />
          <Badge textTransform="lowercase">
            {checkedItems.length}
            {' '}
            items selected
          </Badge>
        </HStack>
      ) : null}
    </>
  )
}

type ResponseDrawerProps = {
  drawerResponse: WidgetResponse | null
  isDrawerOpen: boolean
  handleDrawerClose: () => void
  btnRef: MutableRefObject<HTMLButtonElement | null>
}

function ResponseDrawer({ drawerResponse, isDrawerOpen, handleDrawerClose, btnRef }: ResponseDrawerProps) {
  return (
    <Drawer isOpen={isDrawerOpen} placement="right" onClose={handleDrawerClose} finalFocusRef={btnRef}>
      <DrawerOverlay bg="blackAlpha.400" />
      <DrawerContent marginTop="32px">
        <DrawerCloseButton />
        <DrawerHeader>Response Details</DrawerHeader>

        <DrawerBody>
          {drawerResponse && Object.entries<string | string[]>(drawerResponse.response).map(([label, value]) => (
            <Box key={label + Math.random()}>
              <Text fontSize="md" fontWeight="bold" mb="2">
                {label.toUpperCase().replace(/_/g, ' ')}
              </Text>

              {typeof value === 'object'
                ? (
                  <HStack maxW='300px' flexWrap='wrap' mb='2' spacing='0' gap='1'>
                    <DownloadLinks
                      files={value}
                      widgetChannelId={drawerResponse.widget_channel_id} />
                  </HStack>
                )
                : <Text fontSize="sm" mb="2">{value}</Text>}
            </Box>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}


type ResponseModalProps = {
  isOpen: boolean
  closeDelModal: () => void
  handleDeleteWidget: () => void
  isResponsesDeleting: boolean
}

function ResponseModal({ isOpen, closeDelModal, handleDeleteWidget, isResponsesDeleting }: ResponseModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={closeDelModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Confirmation</ModalHeader>
        <ModalCloseButton disabled={isResponsesDeleting} />
        <ModalBody>Are you sure want to delete selected responses?</ModalBody>

        <ModalFooter>
          <Button disabled={isResponsesDeleting} mr={3} onClick={closeDelModal}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteWidget}
            isLoading={isResponsesDeleting}
            loadingText="Deleting..."
            colorScheme="red"
            shadow="md"
          >
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}