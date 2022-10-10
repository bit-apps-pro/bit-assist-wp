import { Badge, HStack, Text } from '@chakra-ui/react'

interface Props {
  badge?: string
  children?: React.ReactNode;
}

const Title = ({ children, badge }: Props) => {
  return (
    <HStack mb="4">
      {badge && <Badge fontSize="0.85em" colorScheme="purple">{badge}</Badge>}
      <Text fontWeight="medium" fontSize={'lg'}>{children}</Text>
    </HStack>
  )
}

export default Title