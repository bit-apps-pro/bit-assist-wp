import {
  HStack,
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Text,
} from '@chakra-ui/react'
import { ResponseFileType, WidgetResponse } from '@globalStates/Interfaces'
import { MutableRefObject } from 'react'
import DownloadLinks from './DownloadLinks'

type ResponseDrawerProps = {
  drawerResponse: WidgetResponse | null
  isDrawerOpen: boolean
  handleDrawerClose: () => void
  btnRef: MutableRefObject<HTMLButtonElement | null>
}

export default function ResponseDrawer({ drawerResponse, isDrawerOpen, handleDrawerClose, btnRef }: ResponseDrawerProps) {
  return (
    <Drawer isOpen={isDrawerOpen} placement="right" onClose={handleDrawerClose} finalFocusRef={btnRef}>
      <DrawerOverlay bg="blackAlpha.400" />
      <DrawerContent marginTop="32px">
        <DrawerCloseButton />
        <DrawerHeader>Response Details</DrawerHeader>

        <DrawerBody>
          {drawerResponse && Object.entries<string | ResponseFileType[]>(drawerResponse.response).map(([label, value]) => (
            <Box key={label + Math.random()}>
              <Text fontSize="md" fontWeight="bold" mb="2">
                {label.toUpperCase().replace(/_/g, ' ')}
              </Text>

              {typeof value === 'object'
                ? (
                  <HStack maxW='300px' flexWrap='wrap' mb='2' spacing='0' gap='1'>
                    <DownloadLinks
                      files={value}
                      widgetChannelId={drawerResponse.widget_channel_id} />
                  </HStack>
                )
                : <Text fontSize="sm" mb="2">{value}</Text>}
            </Box>
          ))}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}