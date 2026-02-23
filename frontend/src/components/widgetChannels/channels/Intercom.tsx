import { Link, Text } from '@chakra-ui/react'
import { flowAtom } from '@globalStates/atoms'
import { __, sprintf } from '@helpers/i18nwrap'
import { useAtom } from 'jotai'
import { useEffect } from 'react'

function Intercom() {
  const [, setFlow] = useAtom(flowAtom)

  useEffect(() => {
    setFlow(prev => {
      if (prev.config?.card_config === undefined) {
        prev.config.card_config = {}
      }
      prev.config.card_config.isChatWidget = true
    })
  }, [])

  return (
    <Text>
      {sprintf(
      // translators: %s: Service name (e.g. Crisp, Intercom)
      __('Make Sure to add the %s script to your website.'),
      __('Intercom')
    )}{' '}
      <Link href="https://www.intercom.com/" isExternal textDecoration="underline">
        {__('Learn more')}
      </Link>
    </Text>
  )
}

export default Intercom
