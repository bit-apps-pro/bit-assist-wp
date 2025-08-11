import { useColorMode } from '@chakra-ui/react'
import Quill from 'quill'
import { useEffect, useLayoutEffect, useRef } from 'react'
import 'quill/dist/quill.snow.css'

import './quill-theme.css'
import { makeImageInsertHandler } from '../Internals/makeImageInsertHandler'

interface EditorType {
  defaultValue?: string
  onChange?: (html: string) => void
  placeholder?: string
  theme?: 'bubble' | 'snow'
  tools?: unknown
}

export default function QuillEditor({
  defaultValue,
  onChange,
  placeholder,
  theme = 'snow',
  tools
}: EditorType) {
  const containerRef = useRef<HTMLDivElement>(null)
  const defaultValueRef = useRef(defaultValue)
  const onChangeRef = useRef(onChange)
  const { colorMode } = useColorMode()

  useLayoutEffect(() => {
    onChangeRef.current = onChange
  })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // eslint-disable-next-line unicorn/prefer-dom-node-append
    const editorContainer = container.appendChild(container.ownerDocument.createElement('div'))
    const quill = new Quill(editorContainer, {
      modules: {
        toolbar: {
          container: tools,
          handlers: {
            image: makeImageInsertHandler({ isDark: colorMode === 'dark' })
          }
        }
      },
      placeholder,
      theme
    })

    if (defaultValueRef.current) {
      quill.setContents(quill.clipboard.convert({ html: defaultValueRef.current }))
    }

    quill.on(Quill.events.TEXT_CHANGE, () => {
      onChangeRef.current?.(quill.root.innerHTML)
    })

    return () => {
      container.innerHTML = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <div className={colorMode === 'dark' ? 'ba-quill-dark' : undefined} ref={containerRef} />
}
