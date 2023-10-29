import { Text, Link } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

function Intercom() {
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
      Make Sure to add the Intercom script to your website.{' '}
      <Link href="https://www.intercom.com/" isExternal textDecoration="underline">
        Learn more
      </Link>
    </Text>
  )
}

export default Intercom
