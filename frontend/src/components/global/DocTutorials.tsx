import { Button } from '@chakra-ui/react'
import { FaYoutube } from 'react-icons/fa'
import { FiFileText } from 'react-icons/fi'

interface DocTutorialsProps {
  docLink?: string | undefined
  tutorial?: string | undefined
}

export default function DocTutorials({ docLink, tutorial }: DocTutorialsProps) {
  return (
    <>
      {tutorial && (
        <Button
          as="a"
          borderRadius={'full'}
          href={
            tutorial ||
            'https://www.youtube.com/watch?v=atVwkzFNnmM&list=PL7c6CDwwm-AKc9ZA1pBg8nujZF6fHgtm5&index=1&pp=iAQB'
          }
          leftIcon={<FaYoutube color="red" />}
          rel="noopener noreferrer"
          size="sm"
          target="_blank"
        >
          Tutorial
        </Button>
      )}
      {docLink && (
        <Button
          as="a"
          borderRadius={'full'}
          href={docLink || 'https://bitapps.pro/docs/bit-assist/'}
          leftIcon={<FiFileText color="blue" />}
          rel="noopener noreferrer"
          size="sm"
          target="_blank"
        >
          Documentation
        </Button>
      )}
    </>
  )
}
