import { Text, Link } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

const Tawk = () => {
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
      Make Sure to add the Tawk.to script to your website.{' '}
      <Link href="https://www.tawk.to/" isExternal textDecoration="underline">
        Learn more
      </Link>
    </Text>
  )
}

export default Tawk
