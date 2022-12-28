import { Text } from '@chakra-ui/react'
import CardColors from './common/CardColors'
import OpenWindowAction from './OpenWindowAction'

export default function WPSearch() {
  return (
    <>
      <Text>Show pages & posts from your WordPress site.</Text>
      <CardColors bg="#2271b1" color="#fff" />
      <OpenWindowAction />
    </>
  )
}
