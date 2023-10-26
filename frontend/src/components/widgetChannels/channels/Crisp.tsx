import { Link, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export default function Crisp() {
  const [, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    setFlow((prev) => {
      if (typeof prev.config?.card_config === 'undefined') {
        prev.config.card_config = {}
      }
      prev.config.card_config.isChatWidget = true
    })
  }, [])

  return (
    <Text>
      Make Sure to add the Crisp's script to your website.{' '}
      <Link href="https://crisp.chat/" isExternal textDecoration="underline">
        Learn more
      </Link>
    </Text>
  )
}
