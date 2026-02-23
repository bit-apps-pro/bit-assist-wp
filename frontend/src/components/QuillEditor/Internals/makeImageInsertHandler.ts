import type Quill from 'quill'

import { __ } from '@helpers/i18nwrap'

interface ImageHandlerOptions {
  isDark?: boolean
}

export function makeImageInsertHandler(options?: ImageHandlerOptions) {
  return function imageHandler(this: { quill: Quill }) {
    const quill = this.quill

    let colors = {
      heading: 'var(--chakra-colors-gray-800)',
      overlay: 'var(--chakra-colors-blackAlpha-500)',
      primary: 'var(--chakra-colors-purple-500)',
      primaryText: 'var(--chakra-colors-white)',
      surface: 'var(--chakra-colors-white)',
      surfaceAlt: 'var(--chakra-colors-white)',
      text: 'var(--chakra-colors-gray-800)'
    }

    if (options?.isDark) {
      colors = {
        heading: 'var(--chakra-colors-gray-200)',
        overlay: 'var(--chakra-colors-blackAlpha-600)',
        primary: 'var(--chakra-colors-blue-600)',
        primaryText: 'var(--chakra-colors-white)',
        surface: 'var(--chakra-colors-gray-700)',
        surfaceAlt: 'var(--chakra-colors-gray-800)',
        text: 'var(--chakra-colors-gray-200)'
      }
    }

    // Create modal for image input
    const modal = document.createElement('div')
    modal.setAttribute('role', 'dialog')
    modal.setAttribute('aria-modal', 'true')
    modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${colors.overlay};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `

    const form = document.createElement('div')
    const titleId = 'ba-insert-image-title'
    form.setAttribute('role', 'document')
    form.setAttribute('aria-labelledby', titleId)
    form.style.cssText = `
    background: ${colors.surface};
    padding: 20px;
    border-radius: var(--chakra-radii-md);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90vw;
    border: 1px solid var(--chakra-colors-chakra-border-color);
    color: ${colors.text};
  `

    form.innerHTML = `
    <h3 id="${titleId}" style="margin: 0 0 20px 0; font-family: sans-serif; color: ${colors.heading};">${__('Insert Image')}</h3>
    <div style="margin-bottom: 15px;">
      <label for="imageUrl" style="display: block; margin-bottom: 5px; font-family: sans-serif; font-weight: bold;">${__('Image URL')} *</label>
      <input type="url" id="imageUrl" placeholder="https://example.com/image.jpg" style="width: 100%; padding: 8px; border: 1px solid var(--chakra-colors-chakra-border-color); border-radius: var(--chakra-radii-md); box-sizing: border-box; background: ${colors.surfaceAlt}; color: ${colors.text};" required>
    </div>
    <div style="margin-bottom: 15px;">
      <label for="imageAlt" style="display: block; margin-bottom: 5px; font-family: sans-serif; font-weight: bold;">${__('Alt Text')} *</label>
      <input type="text" id="imageAlt" placeholder="${__('Image description')}" style="width: 100%; padding: 8px; border: 1px solid var(--chakra-colors-chakra-border-color); border-radius: var(--chakra-radii-md); box-sizing: border-box; background: ${colors.surfaceAlt}; color: ${colors.text};" required>
    </div>
    <div style="display: flex; gap: 10px; margin-bottom: 15px;">
      <div style="flex: 1;">
        <label for="imageWidth" style="display: block; margin-bottom: 5px; font-family: sans-serif; font-weight: bold;">${__('Width')}</label>
        <input type="text" id="imageWidth" placeholder="${__('e.g., 300 or 100%')}" style="width: 100%; padding: 8px; border: 1px solid var(--chakra-colors-chakra-border-color); border-radius: var(--chakra-radii-md); box-sizing: border-box; background: ${colors.surfaceAlt}; color: ${colors.text};">
      </div>
      <div style="flex: 1;">
        <label for="imageHeight" style="display: block; margin-bottom: 5px; font-family: sans-serif; font-weight: bold;">${__('Height')}</label>
        <input type="text" id="imageHeight" placeholder="${__('e.g., 200 or auto')}" style="width: 100%; padding: 8px; border: 1px solid var(--chakra-colors-chakra-border-color); border-radius: var(--chakra-radii-md); box-sizing: border-box; background: ${colors.surfaceAlt}; color: ${colors.text};">
      </div>
    </div>
    <div style="display: flex; gap: 10px; justify-content: flex-end;">
      <button type="button" id="cancelBtn" style="padding: 8px 16px; border: 1px solid var(--chakra-colors-chakra-border-color); background: ${colors.surfaceAlt}; color: ${colors.text}; border-radius: var(--chakra-radii-md); cursor: pointer; font-family: sans-serif;">${__('Cancel')}</button>
      <button type="button" id="insertBtn" style="padding: 8px 16px; border: none; background: ${colors.primary}; color: ${colors.primaryText}; border-radius: var(--chakra-radii-md); cursor: pointer; font-family: sans-serif;">${__('Insert Image')}</button>
    </div>
  `

    modal.append(form)
    document.body.append(modal)
    const prevOverflow = document.body.style.overflow
    const prevActive = document.activeElement as HTMLElement | null
    document.body.style.overflow = 'hidden'

    // Focus on URL input
    const urlInput = form.querySelector('#imageUrl') as HTMLInputElement
    urlInput.focus()

    // Handle form submission
    const insertBtn = form.querySelector('#insertBtn') as HTMLButtonElement
    const cancelBtn = form.querySelector('#cancelBtn') as HTMLButtonElement
    const altInput = form.querySelector('#imageAlt') as HTMLInputElement
    const widthInput = form.querySelector('#imageWidth') as HTMLInputElement
    const heightInput = form.querySelector('#imageHeight') as HTMLInputElement

    function closeModal() {
      modal.remove()
      document.body.style.overflow = prevOverflow
      if (prevActive && typeof prevActive.focus === 'function') {
        prevActive.focus()
      }
    }

    const insertImage = () => {
      const url = urlInput.value.trim()
      const alt = altInput.value.trim()
      const width = widthInput.value.trim()
      const height = heightInput.value.trim()

      if (!url) {
        urlInput.focus()
        urlInput.style.borderColor = 'var(--chakra-colors-red-500)'
        return
      }

      if (!alt) {
        altInput.focus()
        altInput.style.borderColor = 'var(--chakra-colors-red-500)'
        return
      }

      const range = quill.getSelection(true)

      quill.insertEmbed(range.index, 'image', url)

      const applyDimensions = (imgElement: HTMLImageElement) => {
        const element: HTMLImageElement = imgElement
        element.setAttribute('alt', alt)
        const applyDim = (name: 'height' | 'width', value: string) => {
          if (!value) return
          const v = value.trim().toLowerCase()
          if (v === 'auto') {
            element.removeAttribute(name)
            element.style.removeProperty(name)
            return
          }
          if (v.endsWith('%')) {
            element.removeAttribute(name)
            element.style.setProperty(name, value)
            return
          }
          const num = Number.parseInt(v, 10)
          if (!Number.isNaN(num) && num > 0) {
            element.setAttribute(name, String(num))
            element.style.removeProperty(name)
          }
        }
        applyDim('width', width)
        applyDim('height', height)
      }

      requestAnimationFrame(() => {
        const images = quill.container.querySelectorAll('img')
        const lastImage = [...images].at(-1) as HTMLImageElement | undefined
        if (lastImage && lastImage.src === url) {
          applyDimensions(lastImage)
        }
      })

      // Move cursor after image
      quill.setSelection(range.index + 1, 0)

      // Close modal
      closeModal()
    }

    // Event listeners
    insertBtn.addEventListener('click', insertImage)
    cancelBtn.addEventListener('click', closeModal)

    // Handle Enter/Escape and trap focus within modal
    form.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault()
        insertImage()
        return
      }
      if (e.key === 'Escape') {
        e.preventDefault()
        closeModal()
        return
      }
      if (e.key === 'Tab') {
        const focusAbles = form.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (!focusAbles.length) return
        const first = focusAbles[0]
        const last = [...focusAbles].at(-1) as HTMLElement
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    })

    // Clear error styling on input
    urlInput.addEventListener('input', () => {
      urlInput.style.borderColor = 'var(--chakra-colors-chakra-border-color)'
    })
    altInput.addEventListener('input', () => {
      altInput.style.borderColor = 'var(--chakra-colors-chakra-border-color)'
    })

    // Close modal when clicking outside
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        closeModal()
      }
    })
  }
}
