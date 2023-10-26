import { Link, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export default function MessengerLive() {
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
      Make Sure to add the Messenger script to your website.{' '}
      <Link href="https://business.facebook.com/latest/inbox/settings" isExternal textDecoration="underline">
        Learn more
      </Link>
    </Text>
  )
}
