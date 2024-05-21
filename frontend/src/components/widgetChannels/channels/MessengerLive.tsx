import { Link, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

export default function MessengerLive() {
  // const [, setFlow] = useAtom(flowAtom)

  // useEffect(() => {
  //   setFlow((prev) => {
  //     if (typeof prev.config?.card_config === 'undefined') {
  //       prev.config.card_config = {}
  //     }
  //     prev.config.card_config.isChatWidget = true
  //   })
  // }, [])

  return (
    // <Text>
    //   Make Sure to add the Messenger script to your website.{' '}
    //   <Link href="https://business.facebook.com/latest/inbox/settings" isExternal textDecoration="underline">
    //     Learn more
    //   </Link>
    // </Text>
    <>
      <Text p={3} mt={-6} color="red.500">
        On May 9, 2024, you will no longer be able to access any of the functionality of the Chat Plugin. Effective
        immediately, Chat Plugin in guest mode is no longer available. Other features like m.me links will still be
        available for you to use.
      </Text>
      <Text p={3} mt={-12}>
        This notice is provided by the Facebook officially! Now you can not use the chat plugin rather you can use our
        Messenger or Custom channel to connect user through Facebook Messenger!
      </Text>
    </>
  )
}
