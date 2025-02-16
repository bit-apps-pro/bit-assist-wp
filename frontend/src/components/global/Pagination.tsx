import { Button, HStack, Select, Stack, Text } from '@chakra-ui/react'
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
        <Text whiteSpace="nowrap">Row per page</Text>
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
          Prev
        </Button>

        <Button
          disabled={pageNumber === totalPages || totalPages === 0}
          onClick={() => setPageNumber((prev: number) => prev + 1)}
          rightIcon={<FiArrowRight />}
          rounded="full"
          size="sm"
        >
          Next
        </Button>

        <Text whiteSpace="nowrap">
          {pageNumber} /{totalPages} page
        </Text>
      </HStack>
    </Stack>
  )
}

export default Pagination
