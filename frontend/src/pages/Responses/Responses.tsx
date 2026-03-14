import {
  Badge,
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
  Tooltip,
  Tr,
  useDisclosure
} from '@chakra-ui/react'
import Pagination from '@components/global/Pagination'
import DownloadLinks from '@components/response/DownloadLinks'
import ResponseDeleteModal from '@components/response/ResponseDeleteModal'
import ResponseDrawer from '@components/response/ResponseDrawer'
import { type WidgetResponse } from '@globalStates/Interfaces'
import useDeleteResponses from '@hooks/mutations/response/useDeleteResponses'
import useFetchOthersData from '@hooks/queries/response/useFetchOthersData'
import useFetchResponses from '@hooks/queries/response/useFetchResponses'
import { textTrim, toSlug } from '@utils/utils'
import { __ } from '@wordpress/i18n'
import React, { useEffect, useRef, useState } from 'react'
import { FiEye, FiRefreshCw, FiTrash2 } from 'react-icons/fi'
import { MdArrowBackIosNew } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'

const convertDate = (date: string) => {
  const dateObj = new Date(date)
  return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString()}`
}

export default function Responses() {
  const [pageLimit, setPageLimit] = useState<number>(10)
  const [pageNumber, setPageNumber] = useState<number>(1)
  const { othersData } = useFetchOthersData()
  const { isFetched, isFetching, isResponsesLoading, refresh, widgetResponses } = useFetchResponses(
    pageLimit,
    pageNumber
  )
  const { deleteResponses, isResponsesDeleting } = useDeleteResponses(pageLimit, pageNumber)
  const { isOpen, onClose: closeDelModal, onOpen: openDelModal } = useDisclosure()
  const [checkedItems, setCheckedItems] = useState<string[]>([])
  const navigate = useNavigate()
  const { isOpen: isDrawerOpen, onClose: onDrawerClose, onOpen: onDrawerOpen } = useDisclosure()
  const btnRef = useRef<HTMLButtonElement | null>(null)
  const drawerResponse = useRef<undefined | WidgetResponse>()

  const handleDeleteWidget = async () => {
    await deleteResponses(checkedItems)
    setCheckedItems([])
    closeDelModal()
  }

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, responseId: string) => {
    const { checked } = e.target
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setCheckedItems((prev: any) => {
      if (checked) {
        return [...prev, responseId]
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    drawerResponse.current = undefined
    onDrawerClose()
  }

  return (
    <>
      <HStack flexWrap="wrap" mb="4">
        <HStack alignItems="center">
          <Tooltip label={__('Back to channel list', 'bit-assist')} placement="top">
            <IconButton
              aria-label={__('Back to widget channel settings', 'bit-assist')}
              icon={<MdArrowBackIosNew />}
              onClick={() => navigate(-1)}
            />
          </Tooltip>
          <Text as="h2" fontSize="lg" textTransform="none">
            {__('Response List', 'bit-assist')}{' '}
            {othersData?.channelName && `- ${othersData.channelName}`}
          </Text>
          {isFetching ? (
            <IconButton
              aria-label={__('Loading', 'bit-assist')}
              icon={<Spinner size="sm" />}
              rounded="full"
              size="sm"
              variant="ghost"
            />
          ) : (
            <IconButton
              aria-label={__('Refresh', 'bit-assist')}
              icon={<FiRefreshCw />}
              onClick={() => refresh()}
              rounded="full"
              size="sm"
              variant="ghost"
            />
          )}
        </HStack>

        {checkedItems?.length ? (
          <HStack spacing={1}>
            <IconButton
              aria-label={__('Delete', 'bit-assist')}
              fontSize="1rem"
              icon={<FiTrash2 />}
              onClick={openDelModal}
              rounded="full"
              size="sm"
              variant="ghost"
            />
            <Badge textTransform="lowercase">
              {checkedItems.length} {__('items selected', 'bit-assist')}
            </Badge>
          </HStack>
        ) : undefined}
      </HStack>

      <TableContainer borderWidth="1px" rounded="lg" shadow="md">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th w="4">
                <Checkbox
                  aria-label={__('Select all', 'bit-assist')}
                  colorScheme="purple"
                  isChecked={widgetResponses?.length && widgetResponses.length === checkedItems?.length}
                  isIndeterminate={
                    !!(checkedItems?.length && checkedItems.length < widgetResponses?.length)
                  }
                  onChange={handleCheckAllBox}
                />
              </Th>
              {othersData?.formFields?.map((field: { id: string; label: string }) => (
                <Th key={`${field.id}th`}>{textTrim(field.label, 20)}</Th>
              ))}
              <Th w="6">{__('Created At', 'bit-assist')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {Array.isArray(widgetResponses) &&
              widgetResponses.map((widgetResponse: WidgetResponse) => (
                <Tr key={widgetResponse.id}>
                  <Td py="2">
                    <HStack spacing={3}>
                      <Checkbox
                        aria-label={__('Select', 'bit-assist')}
                        colorScheme="purple"
                        isChecked={!!checkedItems.includes(widgetResponse.id)}
                        onChange={e => handleCheckboxChange(e, widgetResponse.id)}
                      />
                      <IconButton
                        aria-label={__('View details', 'bit-assist')}
                        h="auto"
                        icon={<FiEye fontSize={'1rem'} />}
                        onClick={() => handleResponseClick(widgetResponse)}
                        ref={btnRef}
                        size="sm"
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
                <Td rowSpan={3}>{__('No responses', 'bit-assist')}</Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      </TableContainer>

      {widgetResponses?.length > 0 && !isResponsesLoading && (
        <Pagination
          pageLimit={pageLimit}
          pageNumber={pageNumber}
          setPageLimit={setPageLimit}
          setPageNumber={setPageNumber}
          totalResponses={othersData?.totalResponses || 0}
        >
          {!isFetched && isFetching && <Spinner size="sm" />}
        </Pagination>
      )}

      <ResponseDrawer
        btnRef={btnRef}
        drawerResponse={drawerResponse.current}
        handleDrawerClose={handleDrawerClose}
        isDrawerOpen={isDrawerOpen}
      />

      <ResponseDeleteModal
        closeDelModal={closeDelModal}
        handleDeleteWidget={handleDeleteWidget}
        isOpen={isOpen}
        isResponsesDeleting={isResponsesDeleting}
      />
    </>
  )
}
