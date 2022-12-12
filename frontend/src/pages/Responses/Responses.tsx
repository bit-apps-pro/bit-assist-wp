import {
  Button,
  Checkbox,
  HStack,
  IconButton,
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
} from '@chakra-ui/react'
import { WidgetResponse } from '@globalStates/Interfaces'
import useFetchResponses from '@hooks/queries/response/useFetchResponses'
import useDeleteResponses from '@hooks/mutations/response/useDeleteResponses'
import { textTrim, toSlug } from '@utils/utils'
import React, { useEffect, useRef, useState } from 'react'
import { FiEye, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import Pagination from '@components/global/Pagination'
import useFetchOthersData from '@hooks/queries/response/useFetchOthersData'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import ResponseDeleteModal from '@components/response/ResponseDeleteModal'
import ResponseDrawer from '@components/response/ResponseDrawer'
import DownloadLinks from '@components/response/DownloadLinks'

export default function Responses() {
  const [pageLimit, setPageLimit] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { othersData } = useFetchOthersData()
  const { widgetResponses, isResponsesLoading, isFetching, isFetched, refresh } = useFetchResponses(
    pageLimit,
    pageNumber,
  )
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
            Response List {othersData?.channelName && `- ${othersData.channelName}`}
          </Text>
          {isFetching ? (
            <IconButton aria-label="spinner" size="sm" variant="ghost" rounded="full" icon={<Spinner size="sm" />} />
          ) : (
            <IconButton
              onClick={refresh}
              aria-label="refresh button"
              size="sm"
              rounded="full"
              variant="ghost"
              icon={<FiRefreshCw />}
            />
          )}
        </HStack>

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
            <Badge textTransform="lowercase">{checkedItems.length} items selected</Badge>
          </HStack>
        ) : null}
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
            {Array.isArray(widgetResponses) &&
              widgetResponses.map((widgetResponse: WidgetResponse) => (
                <Tr key={widgetResponse.id}>
                  <Td py="2">
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
                        aria-label="detailed view"
                        icon={<FiEye fontSize={'1rem'} />}
                        size="sm"
                        h="auto"
                        variant={'unstyled'}
                      />
                    </HStack>
                  </Td>

                  {othersData?.formFields?.map((field: { id: string; label: string }) => {
                    const isFile = typeof widgetResponse.response[toSlug(field.label, '_')] === 'object'

                    return (
                      <Td key={`${field.id}td`} maxW={isFile ? '300px' : 'auto'} py="2">
                        {isFile ? (
                          <HStack overflow="hidden" spacing={1}>
                            <DownloadLinks
                              files={widgetResponse.response[toSlug(field.label, '_')]}
                              widgetChannelId={widgetResponse.widget_channel_id}
                            />
                          </HStack>
                        ) : (
                          textTrim(widgetResponse.response[toSlug(field.label, '_')], 40)
                        )}
                      </Td>
                    )
                  })}

                  <Td py="2">{convertDate(widgetResponse.created_at)}</Td>
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

      {widgetResponses?.length > 0 && !isResponsesLoading && (
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
        btnRef={btnRef}
      />

      <ResponseDeleteModal
        isOpen={isOpen}
        closeDelModal={closeDelModal}
        handleDeleteWidget={handleDeleteWidget}
        isResponsesDeleting={isResponsesDeleting}
      />
    </>
  )
}
