/* eslint-disable react/no-children-prop */
import { Box, Button, HStack, IconButton, Input, InputGroup, InputLeftAddon, Kbd, Select, Tooltip } from '@chakra-ui/react'
import Title from '@components/global/Title'
import { widgetAtom } from '@globalStates/atoms'
import useUpdateWidget from '@hooks/mutations/widget/useUpdateWidget'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import Page from '@components/settings/Page'
import { HiCheck, HiOutlineTrash, HiPlus } from 'react-icons/hi'
import useToaster from '@hooks/useToaster'
import { produce } from 'immer'
import ProWrapper from '@components/global/ProWrapper'
import config from '@config/config'

function PageFilters() {
  const toaster = useToaster()
  const [widget, setWidget] = useAtom(widgetAtom)
  const { updateWidget, isWidgetUpdating } = useUpdateWidget()
  const [isAdding, setIsAdding] = useState(false)
  const [pageDomain, setPageDomain] = useState('')
  const [pageUrl, setPageName] = useState('')
  const [pageVisibility, setPageVisibility] = useState('')
  const [pageCondition, setPageCondition] = useState('')
  const tabIndex = config.IS_PRO ? 0 : -1

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.repeat) {
      return
    }

    if (e.key === 'Enter') {
      addNewPage()
    } else if (e.key === 'Escape') {
      resetStates()
    }
  }

  useEffect(() => {
    setPageDomain(window.location.origin)
  }, [])

  const addNewPage = async () => {
    if (pageVisibility === '' || pageCondition === '' || (pageUrl === '' && pageCondition !== 'equal')) {
      toaster('warning', 'All fields are required')
      return
    }

    setWidget((prev) => {
      prev.exclude_pages.push({ url: pageUrl, condition: pageCondition, visibility: pageVisibility })
    })
    resetStates()

    const { status, data } = await updateWidget(
      produce(widget, (draft) => {
        draft.exclude_pages.push({ url: pageUrl, condition: pageCondition, visibility: pageVisibility })
      }),
    )
    toaster(status, data)
  }

  const addPageButtonClickHandle = () => {
    setIsAdding(true)
    setPageVisibility('showOn')
    setPageCondition('contains')
  }

  const resetStates = () => {
    setIsAdding(false)
    setPageName('')
    setPageCondition('')
    setPageVisibility('')
  }

  return (
    <Box>
      <Title>Page Filters</Title>

      <Box mt={4}>
        <Box mb="4" rounded="md" borderWidth={`${widget.exclude_pages?.length && '1px'}`}>
          {widget.exclude_pages?.map((page, index) => (
            <Page key={page?.url} index={index} pageDomain={pageDomain} page={page} updateWidget={updateWidget} isWidgetUpdating={isWidgetUpdating} />
          ))}
        </Box>
      </Box>

      {isAdding && (
        <ProWrapper>
          <Box>
            <HStack mb={2} py="2" pr="2" spacing="0" gap="2" overflow="auto">
              <Select tabIndex={tabIndex} w="15rem" minW="7rem" maxW="full" onChange={(e) => setPageVisibility(e.target.value)}>
                <option value="showOn">Show On</option>
                <option value="hideOn">Hide On</option>
              </Select>
              <Select tabIndex={tabIndex} w="25rem" minW="10rem" maxW="full" onChange={(e) => setPageCondition(e.target.value)}>
                <option value="contains">Pages that contain</option>
                <option value="equal">Specific page</option>
                <option value="startWith">Pages stars with</option>
                <option value="endWith">Pages ended with</option>
              </Select>
              <InputGroup>
                <InputLeftAddon children="your-domain/" />
                <Input
                  minW="10rem"
                  placeholder="Page slug"
                  value={pageUrl ?? ''}
                  onChange={(e) => setPageName(e.target.value)}
                  onKeyDown={handleKeyDown}
                  tabIndex={tabIndex}
                />
              </InputGroup>

              <Tooltip label="Cancel">
                <IconButton tabIndex={tabIndex} isRound aria-label="Remove Page" variant="ghost" colorScheme="red" icon={<HiOutlineTrash />} onClick={resetStates} />
              </Tooltip>
              <Tooltip label="Save">
                <IconButton
                  mr={2}
                  isRound
                  aria-label="Remove Page"
                  variant="ghost"
                  colorScheme="green"
                  icon={<HiCheck />}
                  onClick={() => addNewPage()}
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
        </ProWrapper>
      )}

      {!isAdding ? (
        <Button leftIcon={<HiPlus />} colorScheme="gray" variant="outline" onClick={addPageButtonClickHandle} isLoading={isWidgetUpdating}>
          Add Page
        </Button>
      ) : null}

      {(!config.IS_PRO && isAdding) ? (
        <Button colorScheme="red" mt="4" variant="outline" onClick={resetStates}>Remove Filter</Button>
      ) : null}
    </Box>
  )
}

export default PageFilters
