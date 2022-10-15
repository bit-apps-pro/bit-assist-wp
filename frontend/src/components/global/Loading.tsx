import { Flex, Spinner } from '@chakra-ui/react'

export default function Loading() {
  return (
    <Flex justifyContent="center">
      <Spinner />
    </Flex>
  )
}
