import { Button, HStack, Select, Stack, Text } from '@chakra-ui/react'
import { __, sprintf } from '@wordpress/i18n'
import React from 'react'
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'

interface PaginationProps {
  children: React.ReactNode
  pageLimit: number
  pageNumber: number
  setPageLimit: (pageNumber: ((pageNumber: number) => number) | number) => void
  setPageNumber: (pageNumber: ((pageNumber: number) => number) | number) => void
  totalResponses: number
}

function Pagination({
  children,
  pageLimit,
  pageNumber,
  setPageLimit,
  setPageNumber,
  totalResponses
}: PaginationProps) {
  const totalPages = Math.ceil(totalResponses / pageLimit)

  const handlePageLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageLimit = Number(e.target.value)
    const newTotalPages = Math.ceil(totalResponses / newPageLimit)

    setPageLimit(newPageLimit)
    if (pageNumber > newTotalPages) {
      setPageNumber(newTotalPages)
      return
    }
    setPageNumber(pageNumber)
  }

  return (
    <Stack
      alignItems="center"
      direction="row"
      flexWrap="wrap"
      gap="3"
      justifyContent={['center', 'space-between']}
      mt="4"
      w="full"
    >
      <HStack>
        <Select id="page_limit" maxW="20" onChange={handlePageLimitChange} value={pageLimit}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={30}>30</option>
          <option value={40}>40</option>
          <option value={50}>50</option>
        </Select>
        <Text whiteSpace="nowrap">{__('Row per page', 'bit-assist')}</Text>
      </HStack>

      <HStack>
        {children}

        <Button
          disabled={pageNumber === 1 || totalPages === 0}
          leftIcon={<FiArrowLeft />}
          onClick={() => setPageNumber((prev: number) => prev - 1)}
          rounded="full"
          size="sm"
        >
          {__('Prev', 'bit-assist')}
        </Button>

        <Button
          disabled={pageNumber === totalPages || totalPages === 0}
          onClick={() => setPageNumber((prev: number) => prev + 1)}
          rightIcon={<FiArrowRight />}
          rounded="full"
          size="sm"
        >
          {__('Next', 'bit-assist')}
        </Button>

        <Text whiteSpace="nowrap">
          {sprintf(
            // translators: 1: Current page number, 2: Total pages
            __('%1$s / %2$s page', 'bit-assist'),
            pageNumber,
            totalPages
          )}
        </Text>
      </HStack>
    </Stack>
  )
}

export default Pagination
