import { Button } from '@chakra-ui/react'
import { FaYoutube } from 'react-icons/fa'
import { FiFileText } from 'react-icons/fi'

interface DocTutorialsProps {
  tutorial?: string | null
  docLink?: string | null
}

export default function DocTutorials({ tutorial, docLink }: DocTutorialsProps) {
  return (
    <>
      {tutorial && (
        <Button
          as="a"
          href={
            !tutorial
              ? 'https://www.youtube.com/watch?v=atVwkzFNnmM&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=1&pp=iAQB'
              : tutorial
          }
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<FaYoutube color="red" />}
          size="sm"
          borderRadius={'full'}
        >
          Tutorial
        </Button>
      )}
      {docLink && (
        <Button
          as="a"
          href={!docLink ? 'https://bitapps.pro/docs/bit-assist/' : docLink}
          target="_blank"
          rel="noopener noreferrer"
          leftIcon={<FiFileText color="blue" />}
          size="sm"
          borderRadius={'full'}
        >
          Documentation
        </Button>
      )}
    </>
  )
}
