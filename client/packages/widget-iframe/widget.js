import './css/style.scss'
import leftArrow from './images/left-circle-arrow.svg'
import closeIcon from './images/close-icon.svg'

export default class Widget {
	#apiEndPoint = 'http://bit-assist-wp.test/wp-json/bit-assist/v1'
	#root
	#widgetData
	#clientDomain
	#widgetBubble
	#contentWrapper
	#widgetWrapper
	#channels
	#isMobileDevice
	#clientPageUrl
	#scrollPercent
	#callToAction
	#isOfficeHours
	#card
	#selectedFormBg
	#cardBody
	#formBody

	constructor(config) {
		this.#isOfficeHours = true
		this.#isMobileDevice = false
		this.#root = document.documentElement
		this.#clientDomain = config.clientDomain
		this.#contentWrapper = document.querySelector('#contentWrapper')
		this.#widgetWrapper = document.querySelector('#widgetWrapper')
		this.#widgetBubble = document.querySelector(config.widgetBubble)
		this.#fetchWidgetData()
		this.#addEvents()
	}

	// ====================
	// Events
	// ====================
	#addEvents = () => {
		window.addEventListener('message', this.#onMessageReceived)
		document.addEventListener('click', this.#checkClickOutside)

		this.#widgetBubble.addEventListener('click', this.#onBubbleClick)
		this.#widgetBubble.addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				this.#onBubbleClick(e)
			}
		})
	}

	#closeWidget = () => {
		this.#hideCard()
		this.#hideChannels()
		this.#widgetBubble?.classList.remove('open')
		this.#contentWrapper?.classList.add('hide')
		this.#widgetOpenActions(false)
	}

	#hideChannels = () => {
		if (this.#channels?.classList.contains('show')) {
			this.#channels?.classList.remove('show')
		}
	}

	#hideCard = () => {
		if (this.#card?.classList.contains('show')) {
			this.#card?.classList.remove('show')
		}
	}

	#checkClickOutside = e => {
		if (this.#widgetWrapper.contains(e.target)) {
			return
		}

		this.#closeWidget()
	}

	#onBubbleClick = (e, toggleIfNotExist = false) => {
		let close = true
		if (this.#card?.classList.contains('show')) {
			this.#hideCard()
			close = false
		}

		if (toggleIfNotExist && this.#channels?.classList.contains('show')) {
			return
		}

		this.#channels?.classList.toggle('show')
		if (close) {
			this.#contentWrapper.classList.toggle('hide')
			const isWidgetOpen = this.#widgetBubble?.classList.toggle('open')
			this.#widgetOpenActions(isWidgetOpen)
		}
	}

	#widgetOpenActions = isWidgetOpen => {
		this.#openClientWidget(isWidgetOpen)
		if (isWidgetOpen && !this.#callToAction?.classList.contains('hide')) {
			this.#callToAction?.classList.add('hide')
		}

		if (!isWidgetOpen) {
			this.#resetClientWidgetSize()
		}
	}

	#onChannelClick = e => {
		e.preventDefault()
		const channel = e.target.closest('.channel')

		if (channel.dataset.url === '#') {
			const widgetChannel = this.#widgetData?.widget_channels.find(item => item.id === channel.dataset.id)

			if (widgetChannel.config?.card_config?.faqs) {
				this.#renderFaq(widgetChannel)
			} else if (widgetChannel.config?.card_config?.form_fields) {
				this.#renderForm(widgetChannel)
			} else if (widgetChannel.config?.card_config?.knowledge_bases) {
				this.#renderKnowledgeBase(widgetChannel)
			} else if (widgetChannel.config?.card_config?.isChatWidget) {
				this.#chatWidgetClick(widgetChannel.channel_name.toLowerCase())
			}
		} else if (channel.dataset.target === 'new_window') {
			window.open(channel.dataset.url, '_blank', 'popup')
		} else {
			window.open(channel.dataset.url, channel.dataset.target)
		}
	}

	#setCardStyle = config => {
		this.#selectedFormBg = config?.card_config?.card_bg_color?.str

		document.querySelector('#cardHeader>h4').innerHTML = config?.title
		this.#root.style.setProperty('--card-theme-color', this.#selectedFormBg)
		this.#root.style.setProperty('--card-text-color', config?.card_config?.card_text_color?.str)
	}

	#renderForm = widgetChannel => {
		this.#hideChannels()
		this.#renderCard()
		this.#setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		// Render form
		this.#formBody = document.createElement('form')
		this.#formBody.setAttribute('id', 'formBody')
		this.#formBody.setAttribute('method', 'POST')
		this.#formBody.innerHTML = `
        <div id="dynamicFields"></div>
        <input type="hidden" name="widget_channel_id" value="${widgetChannel.id}" />
        <button type="submit">${cardConfig?.submit_button_text}</button>
    `
		this.#cardBody.innerHTML = ''
		this.#cardBody.appendChild(this.#formBody)
		this.#formBody.addEventListener('submit', this.#formSubmitted)

		// Render fields
		const dynamicFields = document.querySelector('#dynamicFields')
		cardConfig?.form_fields?.forEach(field => {
			let fieldInput = document.createElement('input')
			if (field.field_type === 'textarea') {
				fieldInput = document.createElement('textarea')
			}

			fieldInput.setAttribute('name', field.label.toLowerCase().replace(/ /g, '_'))
			fieldInput.setAttribute('placeholder', field.label + (field.required ? '' : ' (optional)'))
			if (field.required) {
				fieldInput.setAttribute('required', '')
			}

			if (field.field_type === 'GDPR') {
				fieldInput.setAttribute('type', 'checkbox')

				const link = document.createElement('a')
				link.target = '_blank'
				link.innerHTML = field.label
				if (field?.url) {
					link.href = field.url
				}

				const gdprContainer = document.createElement('div')
				gdprContainer.classList.add('gdprContainer')
				gdprContainer.append(fieldInput, link)
				dynamicFields.appendChild(gdprContainer)
			} else {
				fieldInput.classList.add('formControl')
				fieldInput.setAttribute('type', field.field_type)
				dynamicFields.appendChild(fieldInput)
			}
		})
	}

	// Faq
	#renderFaq = widgetChannel => {
		this.#hideChannels()
		this.#renderCard()
		this.#setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		this.#cardBody.innerHTML = `
      <div id="faqBody">
        <div id="listWrapper">
          <div id="lists"></div>
          <input type="text" id="listSearch" class="formControl" placeholder="Search" />
        </div>
        <div id="faqDescription">
          <div class="descriptionTitle">
            <div class="closeDescBtn" tabindex="0">
              <img src="${leftArrow}" alt="back" />
            </div>
            <p></p>
          </div>
          <div class="content"></div>
        </div>
      </div>`

		document.querySelector('#listSearch').addEventListener('input', this.#searchList)
		document.querySelector('.closeDescBtn').addEventListener('click', this.#faqDescToggle)
		document.querySelector('.closeDescBtn').addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				this.#faqDescToggle()
			}
		})

		this.#renderFaqItem(cardConfig?.faqs)
	}

	#renderFaqItem = items => {
		this.#itemListAppend(items)
		document.querySelectorAll('.listItemTitleWrapper').forEach(item => {
			item.addEventListener('click', e => this.#faqDescToggle(e, items))
			item.addEventListener('keydown', e => {
				if (e.key === 'Enter') {
					this.#faqDescToggle(e, items)
				}
			})
		})
	}

	#faqDescToggle = (e, faqs) => {
		if (faqs) {
			const faq = faqs.find(
				item => parseInt(item.id, 10) === parseInt(e.target.closest('.listItemTitleWrapper').dataset.item_id, 10),
			)
			document.querySelector('.descriptionTitle p').innerHTML = faq?.title || ''
			document.querySelector('.content').innerHTML = faq?.description || ''
		}

		const faqBody = document.querySelector('#faqBody')
		const isOpen = faqBody?.classList.toggle('openDesc')
		if (isOpen) {
			const descHeight = document.querySelector('#faqDescription').scrollHeight
			Object.assign(faqBody.style, {
				height: descHeight > 400 ? '400px' : `${descHeight}px`,
				overflow: descHeight > 400 ? 'auto' : 'initial',
			})
		} else {
			faqBody.removeAttribute('style')
		}

		document.querySelector('#listWrapper')?.classList.toggle('hide')
	}

	// Knowledge base
	#renderKnowledgeBase = widgetChannel => {
		this.#hideChannels()
		this.#renderCard()
		this.#setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		this.#cardBody.innerHTML = `
      <div id="knowledgeBaseBody">
        <div id="listWrapper">
          <div id="lists"></div>
          <input type="text" id="listSearch" class="formControl" placeholder="Search" />
        </div>
        <div class="overlay"></div>
        <div id="knowledgeBaseDescription">
          <div class="descriptionTitle">
            <p></p>
            <div class="closeDescBtn" tabindex="0">
              <img src="${closeIcon}" alt="close" />
            </div>
          </div>
          <div class="content"></div>
        </div>
      </div>`

		document.querySelector('#listSearch').addEventListener('input', this.#searchList)
		document.querySelector('.closeDescBtn').addEventListener('click', this.#knowledgeBaseDescToggle)
		document.querySelector('.closeDescBtn').addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				this.#knowledgeBaseDescToggle()
			}
		})

		this.#renderKnowledgeBaseItem(cardConfig?.knowledge_bases)
	}

	#renderKnowledgeBaseItem = items => {
		this.#itemListAppend(items)
		document.querySelectorAll('.listItemTitleWrapper').forEach(item => {
			item.addEventListener('click', e => this.#knowledgeBaseDescToggle(e, items))
			item.addEventListener('keydown', e => {
				if (e.key === 'Enter') {
					this.#knowledgeBaseDescToggle(e, items)
				}
			})
		})
	}

	#knowledgeBaseDescToggle = (e, knowledgeBases) => {
		const knowledgeBaseBody = document.querySelector('#knowledgeBaseBody')

		if (!knowledgeBases) {
			knowledgeBaseBody?.classList.remove('openDesc')
			return
		}

		const knowledgeBase = knowledgeBases.find(
			item => parseInt(item.id, 10) === parseInt(e.target.closest('.listItemTitleWrapper').dataset.item_id, 10),
		)
		if (!knowledgeBase) {
			return
		}

		knowledgeBaseBody?.classList.add('openDesc')
		document.querySelector('.descriptionTitle p').innerHTML = knowledgeBase?.title || ''
		document.querySelector('.content').innerHTML = knowledgeBase?.description || ''

		this.#root.style.setProperty(
			'--modal-title-height',
			document.querySelector('.descriptionTitle').offsetHeight + 'px',
		)
	}

	#itemListAppend = items => {
		let itemsHtml = ''
		items?.forEach(item => {
			itemsHtml += `
        <div class="listItem">
          <div class="listItemTitleWrapper" data-item_id="${item.id}" tabindex="0">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M7.39736 14.1756C11.3119 14.1756 14.4851 11.0024 14.4851 7.08779C14.4851 3.1732 11.3119 0 7.39736 0C3.48277 0 0.30957 3.1732 0.30957 7.08779C0.30957 11.0024 3.48277 14.1756 7.39736 14.1756Z"
                fill="currentColor"
                fill-opacity="0.2"
              />
              <path
                d="M6.50421 10.1215C6.36955 10.1215 6.23488 10.0719 6.12856 9.96559C6.0297 9.86556 5.97426 9.73059 5.97426 9.58994C5.97426 9.4493 6.0297 9.31433 6.12856 9.21429L8.2549 7.08795L6.12856 4.96162C6.0297 4.86158 5.97426 4.72661 5.97426 4.58596C5.97426 4.44532 6.0297 4.31035 6.12856 4.21031C6.33411 4.00477 6.67432 4.00477 6.87987 4.21031L9.38186 6.7123C9.5874 6.91785 9.5874 7.25806 9.38186 7.46361L6.87987 9.96559C6.77355 10.0719 6.63888 10.1215 6.50421 10.1215Z"
                fill="currentColor"
              />
            </svg>
            <p class="title">${item.title}</p>
          </div>
        </div>`
		})
		document.querySelector('#lists').innerHTML = itemsHtml
	}

	#searchList = e => {
		const search = e.target.value.toLowerCase()
		const listItems = document.querySelectorAll('.listItem')
		listItems.forEach(item => {
			if (item.querySelector('.title').innerText.toLowerCase().includes(search)) {
				item?.classList.remove('hide')
			} else {
				item?.classList.add('hide')
			}
		})
	}

	// =====================
	// poseMessage to parent
	// =====================
	#openClientWidget = isWidgetOpen => {
		parent.postMessage({ action: 'widgetOpen', isWidgetOpen }, `${this.#clientDomain}`)
	}

	#removeClientWidget = () => {
		parent.postMessage({ action: 'removeWidget' }, `${this.#clientDomain}`)
	}

	#renderWidgetConf = () => {
		parent.postMessage(
			{
				action: 'widgetLoaded',
				height: (this.#widgetData?.styles?.size || 60) + 40,
				width: (this.#widgetData?.styles?.size || 60) + 40,
				position: this.#widgetData?.styles?.position,
				pageScroll: this.#widgetData?.page_scroll,
			},
			`${this.#clientDomain}`,
		)
	}

	#resetClientWidgetSize = () => {
		parent.postMessage(
			{ action: 'resetWidgetSize', height: this.#widgetWrapper.offsetHeight, width: this.#widgetWrapper.offsetWidth },
			`${this.#clientDomain}`,
		)
	}

	#chatWidgetClick = chatWidgetName => {
		parent.postMessage({ action: 'chatWidgetClick', chatWidgetName }, `${this.#clientDomain}`)
	}

	// =====================
	// poseMessage from parent
	// =====================
	#onMessageReceived = e => {
		const { action } = e.data
		if (action === 'windowLoaded') {
			const { url, winWidth, scrollPercent } = e.data
			this.#root.style.setProperty('--client-win-width', winWidth + 'px')

			this.#handleWindowLoaded(url, winWidth)
			this.#handleScrollPercent(scrollPercent)
		} else if (action === 'scrollPercent') {
			const { scrollPercent } = e.data
			this.#handleScrollPercent(scrollPercent)
		}
	}

	#handleWindowLoaded = (url, winWidth) => {
		this.#clientPageUrl = url.slice(this.#clientDomain.length + 1, url.length)
		this.#isMobileDevice = winWidth < 768
	}

	#handleScrollPercent = scrollPercent => {
		this.#scrollPercent = scrollPercent
		if (this.#widgetData?.page_scroll > 0) {
			this.#widgetShowAfterScroll()
		}
	}

	// =====================
	// Widget setup
	// =====================
	#fetchWidgetData = async () => {
		try {
			const { data } = await fetch(`${this.#apiEndPoint}/bitAssistWidget`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ domain: this.#clientDomain }),
			}).then(res => res.json())

			this.#widgetData = data

			if (!this.#widgetData) {
				this.#removeClientWidget()
				return
			}

			this.#widgetSetup()
		} catch (err) {
			console.log(err)
			this.#removeClientWidget()
		}
	}

	#widgetSetup = async () => {
		if (!this.#setWidgetVisibleOrNot()) {
			return
		}

		this.#renderWidgetConf()
		if (this.#widgetData?.business_hours.length && !this.#checkBusinessHours()) {
			return
		}

		this.#addCustomStyles()
		this.#renderChannels()
		this.#renderWidgetBubble()
		await this.#widgetShowDelay()
		this.#widgetShowAfterScroll()
		this.#showCallToAction()
	}

	// eslint-disable-next-line no-promise-executor-return
	#delay = n => new Promise(resolve => setTimeout(resolve, n * 1000))

	#setWidgetVisibleOrNot = () => {
		if (this.#widgetData?.exclude_pages?.length > 0) {
			let isExistAnyShowOn = false
			let isThisPageVisible = false

			const isPageExcluded = this.#widgetData?.exclude_pages.some(page => {
				if (page.visibility === 'showOn') {
					isExistAnyShowOn = true
				}

				if (
					(page.condition === 'contains' && this.#clientPageUrl.includes(page.url)) ||
					(page.condition === 'equal' && this.#clientPageUrl === page.url) ||
					(page.condition === 'startWith' && this.#clientPageUrl.startsWith(page.url)) ||
					(page.condition === 'endWith' && this.#clientPageUrl.endsWith(page.url))
				) {
					if (page.visibility === 'hideOn') {
						return true
					}

					isThisPageVisible = true
					return false
				}

				return false
			})

			if (
				(isExistAnyShowOn && !isPageExcluded && !isThisPageVisible) ||
				(!isExistAnyShowOn && isPageExcluded && !isThisPageVisible)
			) {
				this.#removeClientWidget()
				return false
			}
		}

		return true
	}

	#checkBusinessHours = () => {
		const date = new Date()
		const toDay = this.#widgetData?.business_hours[date.getDay()]

		if (!toDay || !toDay?.start || !toDay?.end) {
			this.#removeClientWidget()
			return false
		}

		const [startHour, startMinute] = toDay?.start.split(':').map(Number) || [0, 0]
		const [endHour, endMinute] = toDay?.end.split(':').map(Number) || [0, 0]

		// eslint-disable-next-line new-cap
		const timezone = this.#widgetData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
		const currentTime = date.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false })
		const [currentHour, currentMinute] = currentTime.split(':').map(Number)

		if (
			currentHour < startHour ||
			(currentHour === startHour && currentMinute < startMinute) ||
			currentHour > endHour ||
			(currentHour === endHour && currentMinute > endMinute)
		) {
			this.#isOfficeHours = false
		}

		return true
	}

	#addCustomStyles = () => {
		const styleElement = document.createElement('style')
		styleElement.appendChild(document.createTextNode(this.#widgetData?.custom_css))
		document.head.appendChild(styleElement)
	}

	#renderChannels = () => {
		this.#channels = document.createElement('div')
		this.#channels.id = 'channels'
		this.#channels.innerHTML = this.#widgetData?.widget_channels
			?.filter(
				widgetChannel =>
					((this.#isMobileDevice && widgetChannel.config?.channel_show_on.includes('mobile')) ||
						(!this.#isMobileDevice && widgetChannel.config?.channel_show_on.includes('desktop'))) &&
					((!this.#isOfficeHours && !widgetChannel.config?.hide_after_office_hours) || this.#isOfficeHours),
			)
			.map(
				widgetChannel => `
          <div class="channel" tabindex="0" data-id="${widgetChannel.id}" data-url="${
					widgetChannel.config?.url || '#'
				}" data-target="${widgetChannel.config.open_window_action}">
            <div class="channel-name">${widgetChannel.config.title}</div>
            <div class="channel-icon">
              <img src="${widgetChannel.channel_icon}" alt="${widgetChannel.config.title}">
            </div>
          </div>`,
			)
			.join('')
		this.#contentWrapper.appendChild(this.#channels)

		document.querySelectorAll('.channel').forEach(channel => {
			channel.addEventListener('click', this.#onChannelClick)
			channel.addEventListener('keydown', e => {
				if (e.key === 'Enter') {
					this.#onChannelClick(e)
				}
			})
		})
	}

	#renderCard = () => {
		if (document.querySelector('#card')) {
			this.#card?.classList.add('show')
			return
		}

		this.#card = document.createElement('div')
		this.#card.setAttribute('id', 'card')
		this.#card.classList.add('show')
		this.#card.innerHTML = `
        <div id="cardHeader">
          <h4></h4>
          <div class="closeCardBtn" tabindex="0">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M10.2666 8.89085L13.3822 5.77521C13.5301 5.6276 13.6133 5.4273 13.6134 5.21837C13.6136 5.00944 13.5308 4.80899 13.3832 4.66112C13.2356 4.51325 13.0353 4.43008 12.8264 4.4299C12.6174 4.42971 12.417 4.51253 12.2691 4.66014L9.15348 7.77578L6.03784 4.66014C5.88997 4.51227 5.68942 4.4292 5.48031 4.4292C5.27119 4.4292 5.07064 4.51227 4.92277 4.66014C4.7749 4.80801 4.69183 5.00856 4.69183 5.21767C4.69183 5.42679 4.7749 5.62734 4.92277 5.77521L8.03841 8.89085L4.92277 12.0065C4.7749 12.1543 4.69183 12.3549 4.69183 12.564C4.69183 12.7731 4.7749 12.9737 4.92277 13.1216C5.07064 13.2694 5.27119 13.3525 5.48031 13.3525C5.68942 13.3525 5.88997 13.2694 6.03784 13.1216L9.15348 10.0059L12.2691 13.1216C12.417 13.2694 12.6175 13.3525 12.8267 13.3525C13.0358 13.3525 13.2363 13.2694 13.3842 13.1216C13.5321 12.9737 13.6151 12.7731 13.6151 12.564C13.6151 12.3549 13.5321 12.1543 13.3842 12.0065L10.2666 8.89085Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
        <div id="cardBody"></div>
    `
		this.#contentWrapper.appendChild(this.#card)
		this.#cardBody = document.querySelector('#cardBody')

		const closeBtn = document.querySelector('.closeCardBtn')
		closeBtn.addEventListener('click', this.#closeWidget)
		closeBtn.addEventListener('keydown', e => {
			if (e.key === 'Enter') {
				this.#closeWidget()
			}
		})
	}

	#formSubmitted = async e => {
		e.preventDefault()
		const submitButton = document.querySelector('button[type="submit"]')

		const formData = new FormData(e.target)
		const data = {}
		for (const [key, value] of formData.entries()) {
			data[key] = value
		}

		const oldText = submitButton.innerHTML
		try {
			submitButton.innerHTML = 'Sending...'
			submitButton?.classList.add('disabled')
			const responseData = await fetch(`${this.#apiEndPoint}/responses`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ formData: data }),
			}).then(res => res.json())

			if (responseData?.status === 'success') {
				await this.#showToast('success', responseData?.data)
			} else {
				await this.#showToast('error', responseData?.data)
			}

			e.target.reset()
			submitButton?.classList.remove('disabled')
			submitButton.innerHTML = oldText
		} catch (err) {
			console.log(err)
			await this.#showToast('error')
			e.target.reset()
			submitButton?.classList.remove('disabled')
			submitButton.innerHTML = oldText
		}
	}

	#showToast = async (type, message) => {
		if (!this.#cardBody.contains(this.#formBody)) {
			return
		}

		const toast = document.createElement('div')
		toast.classList.add('toast')
		toast.classList.add(type)
		toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-text">
          <div class="toast-text-title">${type === 'success' ? 'Success' : 'Error'}</div>
          <div class="toast-text-body">${
						type === 'success' ? message : 'Something went wrong'
					}</div>
        </div>
      </div>
    `
		this.#cardBody.appendChild(toast)
		this.#formBody?.classList.add('hide')

		if (toast.classList.contains('success')) {
			document.querySelector('.toast-text-title').style.color = this.#selectedFormBg
		}

		await this.#delay(2)
		if (!this.#formBody?.classList.contains('hide')) {
			return
		}

		this.#cardBody.removeChild(toast)
		this.#formBody?.classList.remove('hide')
	}

	#renderWidgetBubble = () => {
		this.#root.style.setProperty('--widget-size', (this.#widgetData?.styles?.size || 60) + 'px')
		this.#root.style.setProperty('--widget-color', this.#widgetData?.styles?.color?.str)

		if (this.#widgetData?.widget_behavior === 2) {
			this.#widgetBubble.removeEventListener('click', this.#onBubbleClick)
			this.#widgetBubble.addEventListener('mouseenter', e => this.#onBubbleClick(e, true))
			this.#widgetWrapper.addEventListener('mouseleave', this.#onBubbleClick)
		} else if (this.#widgetData?.widget_behavior === 3) {
			this.#onBubbleClick()
		}

		this.#widgetBubble?.classList.add(this.#widgetData?.styles?.shape)
		this.#widgetWrapper?.classList.add(this.#widgetData?.styles?.position)

		document.querySelector('#widget-img').src = this.#widgetData?.styles?.iconUrl
		document.querySelector('#widget-img')?.classList.add('icon')

		// Change image color depend on background
		const brightness = Math.round(
			(parseInt(this.#widgetData?.styles?.color?.r, 10) * 299 +
				parseInt(this.#widgetData?.styles?.color?.g, 10) * 587 +
				parseInt(this.#widgetData?.styles?.color?.b, 10) * 114) /
				1000,
		)
		this.#root.style.setProperty('--widget-bubble-icon-color', brightness > 125 ? 'invert(0)' : 'invert(1)')
	}

	#widgetShowDelay = async () => {
		if (this.#widgetData?.initial_delay > 0) {
			await this.#delay(this.#widgetData.initial_delay)
		}
	}

	#widgetShowAfterScroll = () => {
		if (this.#scrollPercent >= this.#widgetData?.page_scroll) {
			this.#widgetWrapper.classList.remove('hide')
			this.#resetClientWidgetSize()
		} else {
			this.#widgetWrapper.classList.add('hide')
			this.#resetClientWidgetSize()
		}
	}

	#showCallToAction = async () => {
		if (!this.#widgetData?.call_to_action?.text) {
			return
		}

		if (this.#widgetData?.call_to_action?.delay > 0) {
			await this.#delay(this.#widgetData.call_to_action.delay)
		}

		this.#callToAction = document.createElement('div')
		this.#callToAction.id = 'callToActionMsg'
		this.#callToAction.innerHTML = this.#widgetData.call_to_action.text
		document.querySelector('#widgetBubbleRow').appendChild(this.#callToAction)

		if (this.#channels?.classList.contains('show')) {
			this.#callToAction?.classList.add('hide')
			return
		}

		this.#resetClientWidgetSize()
	}
}
