import { Badge, HStack, Text } from '@chakra-ui/react'

interface Props {
  badge?: string
  children: React.ReactNode
}

function Title({ badge = '', children }: Props) {
  return (
    <HStack mb="4">
      {badge && (
        <Badge colorScheme="purple" fontSize="0.85em">
          {badge}
        </Badge>
      )}
      <Text fontSize="lg" fontWeight="medium">
        {children}
      </Text>
    </HStack>
  )
}

export default Title
