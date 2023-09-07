import { Button, Divider } from '@chakra-ui/react'
import { FaYoutube } from 'react-icons/fa'
import { FiFileText } from 'react-icons/fi'

interface DocTutorialsProps {
  tutorial: string
  docLink: string
}

export default function DocTutorials({ tutorial, docLink }: DocTutorialsProps) {
  return (
    <>
      <Button
        as="a"
        href={tutorial}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={<FaYoutube color="red" />}
        size="sm"
        borderRadius={'full'}
      >
        Tutorial
      </Button>
      {/* <Divider orientation="vertical" borderColor="gray.500" height="32px" /> */}
      <Button
        as="a"
        href={docLink}
        target="_blank"
        rel="noopener noreferrer"
        leftIcon={<FiFileText color="blue" />}
        size="sm"
        borderRadius={'full'}
      >
        Documentation
      </Button>
    </>
  )
}
