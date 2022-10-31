/* eslint-disable react/no-children-prop */
import { Box, Button, HStack, IconButton, Input, Tooltip, Kbd } from '@chakra-ui/react'
import useToaster from '@hooks/useToaster'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidgetPro from '@hooks/mutations/widget/useUpdateWidgetPro'
import { useAtom } from 'jotai'
import React, { useEffect, useRef, useState } from 'react'
import { HiCheck, HiOutlineTrash, HiPlus } from 'react-icons/hi'
import Domain from '@components/publish/Domain'
import Title from '@components/global/Title'
import config from '@config/config'

function Domains() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidgetPro()
  const [isAdding, setIsAdding] = useState(false)
  const [domainName, setDomainName] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const tabIndex = config.IS_PRO ? 0 : -1

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.repeat) {
      return
    }

    if (e.key === 'Enter') {
      addNewDomain()
    } else if (e.key === 'Escape') {
      resetStates()
    }
  }

  const addNewDomain = async () => {
    try {
      const origin = new URL(domainName).origin.replace('www.', '')

      // const pattern = /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/gm
      // pattern.test(origin) === false
      if (origin === '' || origin === 'null' || origin === null) {
        toaster('error', 'Please enter a valid domain name')
        return
      }

      if (window.location.host.replace('www.', '') === new URL(domainName).host.replace('www.', '')) {
        toaster('warning', 'You cannot add your own domain')
        return
      }

      const domainExists = widget.domains.find((domain: string) => domain === origin)
      if (domainExists) {
        toaster('warning', 'Domain already exists')
        return
      }

      const { status, data } = await updateWidget({ ...widget, domains: [...widget.domains, origin] })

      if (status === 'success') {
        setWidget((prev) => {
          prev.domains.push(origin)
        })
        resetStates()
      }

      toaster(status, data)
    } catch (error) {
      toaster('error', 'Please enter a valid domain name')
    }
  }

  const resetStates = () => {
    setDomainName('')
    setIsAdding(false)
  }

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  return (
    <Box>
      <Title badge="1">Add Bit Assist to your other website</Title>
      <Box w="sm" maxW="full">
        <Box mb="4" rounded="md" borderWidth={`${widget.domains?.length && '1px'}`}>
          {widget.domains?.map((domain, index) => (
            <Domain key={domain} index={index} domain={domain} updateWidget={updateWidget} isWidgetUpdating={isWidgetUpdating} />
          ))}
        </Box>

        {isAdding && (
          <Box mb={4}>
            <HStack mb={2}>
              <Input
                ref={inputRef}
                placeholder="ex: https://your-domain.com"
                value={domainName ?? ''}
                onChange={(e) => setDomainName(e.target.value)}
                onKeyDown={handleKeyDown}
                tabIndex={tabIndex}
              />
              <Tooltip label="Cancel">
                <IconButton
                  isRound
                  aria-label="Remove Domain"
                  variant="ghost"
                  colorScheme="red"
                  icon={<HiOutlineTrash />}
                  onClick={resetStates}
                  tabIndex={tabIndex}
                />
              </Tooltip>
              <Tooltip label="Save">
                <IconButton
                  isRound
                  aria-label="Remove Domain"
                  variant="ghost"
                  colorScheme="green"
                  icon={<HiCheck />}
                  onClick={() => addNewDomain()}
                  disabled={isWidgetUpdating}
                  tabIndex={tabIndex}
                />
              </Tooltip>
            </HStack>
            <span>
              Press
              {' '}
              <Kbd>enter</Kbd>
              {' '}
              to add, &nbsp;
              {' '}
              <Kbd>esc</Kbd>
              {' '}
              to cancel
            </span>
          </Box>
        )}

        {!isAdding && (
          <Button tabIndex={tabIndex} leftIcon={<HiPlus />} colorScheme="gray" variant="outline" onClick={() => setIsAdding(true)} isLoading={isWidgetUpdating}>
            Add Domain
          </Button>
        )}
      </Box>
    </Box>
  )
}

export default Domains
