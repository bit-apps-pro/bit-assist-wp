import { Flex, Link, Tooltip, useColorModeValue } from '@chakra-ui/react'
import config from '@config/config'
import { type ResponseFileType } from '@globalStates/Interfaces'
import { textTrim } from '@utils/utils'
import { FiDownload, FiFile } from 'react-icons/fi'

import style from './Response.module.css'

interface DownloadLinksProps {
  files: ResponseFileType[]
  widgetChannelId: string
}

export default function DownloadLinks({ files, widgetChannelId }: DownloadLinksProps) {
  const grayColorToggle = useColorModeValue('gray.200', 'gray.600')

  return (
    <>
      {files.map((file: ResponseFileType) => {
        const { AJAX_URL, NONCE, ROUTE_PREFIX } = config
        const uri = new URL(AJAX_URL)
        uri.searchParams.append('action', `${ROUTE_PREFIX}downloadResponseFile`)
        uri.searchParams.append('_ajax_nonce', NONCE)
        uri.searchParams.append('widgetChannelID', widgetChannelId)
        uri.searchParams.append('fileID', file.uniqueName)
        uri.searchParams.append('fileName', file.originalName)

        return (
          <Tooltip key={Math.random()} label={file.originalName} placement="top">
            <Flex className={style.downloadLink} gap="0.5">
              <Link alignItems="center" display="flex" gap="1" h="7" href={uri.href} target="_blank">
                <FiFile fontSize="0.875rem" />
                {textTrim(file.originalName, 6)}
              </Link>
              <Link
                _hover={{ backgroundColor: grayColorToggle }}
                className={style.fileDownloadIcon}
                href={`${uri.href}&download`}
                p="1.5"
                rounded="full"
              >
                <FiDownload fontSize="0.875rem" />
              </Link>
            </Flex>
          </Tooltip>
        )
      })}
    </>
  )
}
