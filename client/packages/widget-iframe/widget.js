import './css/style.scss'
import leftArrow from './public/images/left-circle-arrow.svg'
import rightArrow from './public/images/right-circle-arrow.svg'
import closeIcon from './public/images/close-icon.svg'

const $ = s => document.querySelector(s)

const createElm = (elm, attributes) => {
	const domElm = document.createElement(elm)

	for (const attribute in attributes) {
		domElm.setAttribute(attribute, attributes[attribute])
	}
	return domElm
}

export default class Widget {
	#apiEndPoint
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
	#closeCallToAction
	#isOfficeHours
	#card
	#selectedFormBg
	#cardBody
	#formBody
	#delayExist
	#iFrameWrapper

	constructor(config) {
		this.#delayExist = true
		this.#isOfficeHours = true
		this.#isMobileDevice = false
		this.#root = document.documentElement
		this.#clientDomain = config.clientDomain
		this.#contentWrapper = $('#contentWrapper')
		this.#widgetWrapper = $('#widgetWrapper')
		this.#widgetBubble = $(config.widgetBubble)
		this.#addEvents()
		this.#getClientInfo()
	}

	// ====================
	// Events
	// ====================
	#addEvents = () => {
		window.addEventListener('message', this.#onMessageReceived)
		this.#widgetBubble.addEventListener('click', this.#onBubbleClick)
	}

	#closeWidget = () => {
		this.#hideCard()
		this.#hideChannels()
		if (typeof this.#iFrameWrapper !== 'undefined') {
			this.#removeIframe()
		}
		this.#widgetBubble?.classList.remove('open')
		this.#contentWrapper?.classList.add('hide')
		this.#widgetOpenActions(false)
		this.#root.style.setProperty('--card-width', '330px')
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

	#onBubbleClick = (e, toggleIfNotExist = false) => {
		if (toggleIfNotExist && this.#channels?.classList.contains('show')) {
			return
		}

		this.#channels?.classList.toggle('show')

		if (this.#card?.classList.contains('show')) {
			this.#root.style.setProperty('--card-width', '330px')
			this.#hideCard()
			this.#resetClientWidgetSize()
		} else if (typeof this.#iFrameWrapper !== 'undefined') {
			this.#removeIframe()
		} else {
			this.#contentWrapper.classList.toggle('hide')
			const isWidgetOpen = this.#widgetBubble?.classList.toggle('open')
			this.#widgetOpenActions(isWidgetOpen)
		}
	}

	#removeIframe = () => {
		this.#iFrameWrapper.remove()
		this.#iFrameWrapper = undefined
		this.#resetClientWidgetSize()
	}

	#widgetOpenActions = isWidgetOpen => {
		this.#openClientWidget(isWidgetOpen)
		if (isWidgetOpen && !this.#callToAction?.classList.contains('hide')) {
			this.#callToActionHide()
			return
		}

		this.#resetClientWidgetSize()
	}

	#callToActionHide = () => {
		this.#callToAction?.classList.add('hide')
		this.#closeCallToAction?.classList.add('hide')

		this.#resetClientWidgetSize()
	}

	#onChannelClick = e => {
		e.preventDefault()
		const channel = e.target.closest('.channel')
		const { id, url, channel_name, target } = channel.dataset || {}

		const widgetChannel = this.#widgetData?.widget_channels.find(item => item.id === id)
		const { title, unique_id } = widgetChannel?.config || {}
		const { isChatWidget } = widgetChannel?.config?.card_config || {}

		if (channel_name === 'faq') {
			this.#renderFaq(widgetChannel)
		} else if (channel_name === 'custom-form') {
			this.#renderForm(widgetChannel)
		} else if (channel_name === 'knowledge-base') {
			this.#renderKnowledgeBase(widgetChannel)
		} else if (channel_name === 'google-map') {
			this.#renderIframe(url, channel_name, unique_id)
		} else if (channel_name === 'youtube' || channel_name === 'custom-iframe') {
			this.#renderIframe(url, channel_name)
		} else if (isChatWidget) {
			this.#chatWidgetClick(channel_name)
		} else if (target === 'new_window' && url !== '#') {
			window.open(url, '_blank', 'popup')
		} else if (url !== '#') {
			window.open(url, target)
		}

		this.#resetClientWidgetSize()
		this.#channelClickEventTrigger(channel_name, title, url)
	}

	#renderIframe = (url, channelName, iframe = false) => {
		this.#hideChannels()
		this.#iFrameWrapper = createElm('div', { id: 'iframe-wrapper', class: channelName.toLowerCase() })

		if (iframe) {
			this.#iFrameWrapper.innerHTML = iframe
		} else {
			const iframeElm = createElm('iframe', {
				scrolling: 'no',
				src: url,
				allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
				allowfullscreen: '',
			})
			this.#iFrameWrapper.append(iframeElm)
		}

		this.#contentWrapper.appendChild(this.#iFrameWrapper)
		this.#resetClientWidgetSize()
	}

	#setCardStyle = config => {
		this.#selectedFormBg = config?.card_config?.card_bg_color?.str

		$('#cardHeader>h4').innerHTML = config?.title
		this.#root.style.setProperty('--card-theme-color', this.#selectedFormBg)
		this.#root.style.setProperty('--card-text-color', config?.card_config?.card_text_color?.str)
	}

	#renderForm = widgetChannel => {
		this.#hideChannels()
		this.#renderCard()
		this.#setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		// Render form
		this.#formBody = createElm('form', { id: 'formBody', method: 'POST' })
		const dynamicFieldsDiv = createElm('div', { id: 'dynamicFields' })
		const hiddenInput = createElm('input', {
			type: 'hidden',
			name: 'widget_channel_id',
			value: widgetChannel.id,
		})
		const submitButton = createElm('button', { type: 'submit' })
		submitButton.innerText = cardConfig?.submit_button_text

		this.#formBody.append(dynamicFieldsDiv, hiddenInput, submitButton)

		this.#cardBody.innerHTML = ''
		this.#cardBody.appendChild(this.#formBody)
		this.#formBody.addEventListener('submit', this.#formSubmitted)
		this.#createAllFields(cardConfig?.form_fields)
	}

	#createAllFields = fields => {
		const dynamicFields = $('#dynamicFields')

		let flag = false
		fields?.forEach(field => {
			if (field.field_type === 'file' && !flag) {
				$('#formBody').setAttribute('enctype', 'multipart/form-data')
				flag = true
			}

			if (field.field_type === 'rating') {
				this.#createRatingField(field, dynamicFields, 'rating')
			} else if (field.field_type === 'feedback') {
				this.#createRatingField(field, dynamicFields, 'feedback')
			} else {
				this.#createTextField(field, dynamicFields)
			}
		})
	}

	#createRatingField = (field, dynamicFields, filedType) => {
		const randomId = Math.floor(Math.random() * 100000000)
		const name = field.label.toLowerCase().replace(/ /g, '_')
		const wrapper = createElm('div', { class: filedType })

		if (filedType === 'rating') {
			wrapper.classList.add(field.rating_type)
		}

		let types = []
		if (filedType === 'feedback') {
			types = ['bug', 'suggest', 'love']
		} else if (field.rating_type === 'star') {
			types = ['5 star', '4 star', '3 star', '2 star', '1 star']
		} else {
			types = ['sad', 'confused', 'happy']
		}

		types.forEach(type => {
			const fieldId = `${name}_${type.replace(/ /g, '_')}_${randomId}`

			const inputElm = createElm('input', { type: 'radio', name: name, value: type, id: fieldId })
			if (field.required) {
				inputElm.setAttribute('required', '')
			}

			const labelElm = createElm('label', { title: type, for: fieldId, class: type })
			if (filedType === 'feedback') {
				labelElm.innerHTML = `${type.charAt(0).toUpperCase() + type.slice(1)}`
				const feedbackIcon = createElm('div', { class: 'feedback-icon' })
				labelElm.prepend(feedbackIcon)
			}

			wrapper.append(inputElm, labelElm)
		})
		dynamicFields.appendChild(wrapper)
	}

	#createTextField = (field, dynamicFields) => {
		let fieldInput = document.createElement('input')
		if (field.field_type === 'textarea') {
			fieldInput = document.createElement('textarea')
		}

		fieldInput.setAttribute(
			'name',
			`${field.label.toLowerCase().replace(/ /g, '_')}${!!field?.allow_multiple ? '[]' : ''}`,
		)
		fieldInput.setAttribute('placeholder', field.label + (field.required ? '' : ' (optional)'))
		if (field.required) {
			fieldInput.setAttribute('required', '')
		}

		if (field.field_type === 'GDPR') {
			this.#gdprField(field, dynamicFields, fieldInput)
			return
		}

		fieldInput.classList.add('formControl')
		fieldInput.setAttribute('type', field.field_type)

		if (field.field_type === 'file') {
			this.#fileField(field, dynamicFields, fieldInput)
			return
		}

		dynamicFields.appendChild(fieldInput)
	}

	#fileField = (field, dynamicFields, fieldInput) => {
		if (!!field?.allow_multiple) {
			fieldInput.setAttribute('multiple', '')
		}

		const inputWrap = createElm('div', { class: 'formControl customFile' })
		inputWrap.innerHTML = `<div class="cfit"><button class="cfit-btn">Attach File</button><div class="cfit-title">No file chosen</div></div>`
		inputWrap.append(fieldInput)
		dynamicFields.appendChild(inputWrap)

		fieldInput.addEventListener('change', e => {
			let fileName = 'No file chosen'
			const fileLength = e.target.files.length
			if (fileLength > 0) {
				fileName = fileLength === 1 ? e.target.files[0].name : `${fileLength} files`
			}
			const cfitTitle = e.target.parentElement.querySelector('.cfit-title')
			cfitTitle.innerHTML = fileName
		})
	}

	#gdprField = (field, dynamicFields, fieldInput) => {
		fieldInput.setAttribute('type', 'checkbox')

		const link = createElm('a', { target: '_blank' })
		link.innerHTML = field.label
		if (field?.url) {
			link.href = field.url
		}

		const gdprContainer = createElm('div', { class: 'gdprContainer' })
		gdprContainer.append(fieldInput, link)
		dynamicFields.appendChild(gdprContainer)
	}

	// Faq
	#renderFaq = widgetChannel => {
		this.#hideChannels()
		this.#renderCard()
		this.#setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		const faqBody = createElm('div', { id: 'faqBody' })
		const listWrapper = createElm('div', { id: 'listWrapper' })
		const lists = createElm('div', { id: 'lists' })
		const listSearch = createElm('input', {
			type: 'text',
			id: 'listSearch',
			class: 'formControl',
			placeholder: 'Search',
		})
		listWrapper.append(lists, listSearch)

		const faqDescription = createElm('div', { id: 'faqDescription' })
		const descriptionTitle = createElm('div', { class: 'descriptionTitle' })
		const closeDescBtn = createElm('button', { class: 'iconBtn closeDescBtn', title: 'Back' })
		const img = createElm('img', { src: leftArrow, alt: 'back' })
		closeDescBtn.appendChild(img)
		const p = document.createElement('p')
		descriptionTitle.append(closeDescBtn, p)

		const content = createElm('div', { class: 'content' })
		faqDescription.append(descriptionTitle, content)
		faqBody.append(listWrapper, faqDescription)

		this.#cardBody.innerHTML = ''
		this.#cardBody.appendChild(faqBody)

		listSearch.addEventListener('input', this.#searchList)
		closeDescBtn.addEventListener('click', this.#faqDescToggle)

		this.#renderFaqItem(cardConfig?.faqs)
	}

	#renderFaqItem = items => {
		this.#itemListAppend(items)
		document.querySelectorAll('.listItemTitleWrapper').forEach(item => {
			item.addEventListener('click', e => this.#faqDescToggle(e, items))
		})
	}

	#faqDescToggle = (e, faqs) => {
		if (faqs) {
			const faq = faqs.find(
				item => Number(item.id) === Number(e.target.closest('.listItemTitleWrapper').dataset.item_id),
			)
			$('.descriptionTitle p').innerHTML = faq?.title || ''
			$('.content').innerHTML = faq?.description || ''
		}

		const faqBody = $('#faqBody')
		const isOpen = faqBody?.classList.toggle('openDesc')
		if (isOpen) {
			const descHeight = $('#faqDescription').scrollHeight
			Object.assign(faqBody.style, {
				height: descHeight > 400 ? '400px' : `${descHeight}px`,
				overflow: descHeight > 400 ? 'auto' : 'initial',
			})
		} else {
			faqBody.removeAttribute('style')
		}

		$('#listWrapper')?.classList.toggle('hide')
	}

	// Knowledge base
	#renderKnowledgeBase = widgetChannel => {
		this.#hideChannels()
		this.#renderCard()
		this.#setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		const knowledgeBaseBody = createElm('div', { id: 'knowledgeBaseBody' })
		const listWrapper = createElm('div', { id: 'listWrapper' })
		const lists = createElm('div', { id: 'lists' })
		const listSearch = createElm('input', {
			type: 'text',
			id: 'listSearch',
			class: 'formControl',
			placeholder: 'Search',
		})
		listWrapper.append(lists, listSearch)

		const overlay = createElm('div', { class: 'overlay' })
		const knowledgeBaseDescription = createElm('div', { id: 'knowledgeBaseDescription' })
		const descriptionTitle = createElm('div', { class: 'descriptionTitle' })
		const p = document.createElement('p')
		const modalActions = createElm('div', { class: 'modalActions' })

		const prevKBBtn = createElm('button', { class: 'iconBtn rounded prevKB', title: 'Prev' })
		const prevKbImg = createElm('img', { src: leftArrow, alt: 'prev' })
		prevKBBtn.appendChild(prevKbImg)

		const nextKBBtn = createElm('button', { class: 'iconBtn rounded nextKB', title: 'Next' })
		const nextKbImg = createElm('img', { src: rightArrow, alt: 'next' })
		nextKBBtn.appendChild(nextKbImg)

		const closeKBBtn = createElm('button', { class: 'iconBtn rounded closeKB', title: 'Close' })
		const closeKbImg = createElm('img', { src: closeIcon, alt: 'close' })
		closeKBBtn.appendChild(closeKbImg)

		modalActions.append(prevKBBtn, nextKBBtn, closeKBBtn)
		descriptionTitle.append(p, modalActions)

		const content = createElm('div', { class: 'content' })
		knowledgeBaseDescription.append(descriptionTitle, content)
		knowledgeBaseBody.append(listWrapper, overlay, knowledgeBaseDescription)

		this.#cardBody.innerHTML = ''
		this.#cardBody.appendChild(knowledgeBaseBody)

		listSearch.addEventListener('input', this.#searchList)
		closeKBBtn.addEventListener('click', this.#knowledgeBaseDescToggle)
		prevKBBtn.addEventListener('click', () => this.#gotoPrevNextKB('previousElementSibling'))
		nextKBBtn.addEventListener('click', () => this.#gotoPrevNextKB('nextElementSibling'))

		this.#renderKnowledgeBaseItem(cardConfig?.knowledge_bases)
	}

	#renderKnowledgeBaseItem = items => {
		this.#itemListAppend(items)
		document.querySelectorAll('.listItemTitleWrapper').forEach(item => {
			item.addEventListener('click', e => this.#knowledgeBaseDescToggle(e, items))
		})
	}

	#gotoPrevNextKB = indicator => {
		const item = $('.listItem.active')[indicator]
		if (item) {
			item.querySelector('.listItemTitleWrapper').click()
		}
	}

	#knowledgeBaseDescToggle = (e, knowledgeBases) => {
		$('.listItem.active')?.classList.remove('active')

		const knowledgeBaseBody = $('#knowledgeBaseBody')
		if (!knowledgeBases) {
			knowledgeBaseBody?.classList.remove('openDesc')
			this.#root.style.setProperty('--card-width', '330px')
			this.#resetClientWidgetSize()
			return
		}

		e.target.closest('.listItem').classList.toggle('active')
		const knowledgeBase = knowledgeBases.find(
			item => Number(item.id) === Number(e.target.closest('.listItemTitleWrapper').dataset.item_id),
		)
		if (!knowledgeBase) {
			return
		}

		knowledgeBaseBody?.classList.add('openDesc')
		$('.descriptionTitle p').innerHTML = knowledgeBase?.title || ''
		$('.content').innerHTML = knowledgeBase?.description || ''

		this.#root.style.setProperty('--modal-title-height', $('.descriptionTitle').offsetHeight + 'px')
		this.#root.style.setProperty('--card-width', '767px')
		this.#resetClientWidgetSize()
	}

	#itemListAppend = items => {
		const itemsObj = []
		items?.forEach(item => {
			const listItem = createElm('div', { class: 'listItem' })
			const listItemTitleWrapper = createElm('button', { class: 'listItemTitleWrapper', 'data-item_id': item.id })

			const title = createElm('p', { class: 'title' })
			title.innerHTML = item?.title || ''

			listItemTitleWrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="currentColor"><path d="M7.397 14.176a7.09 7.09 0 0 0 7.088-7.088A7.09 7.09 0 0 0 7.397 0 7.09 7.09 0 0 0 .31 7.088a7.09 7.09 0 0 0 7.088 7.088z" fill-opacity=".2"/><path d="M6.504 10.122c-.135 0-.269-.05-.376-.156-.099-.1-.154-.235-.154-.376s.055-.276.154-.376l2.126-2.126-2.126-2.126c-.099-.1-.154-.235-.154-.376s.055-.276.154-.376c.206-.206.546-.206.751 0l2.502 2.502c.206.206.206.546 0 .751L6.88 9.966c-.106.106-.241.156-.376.156z"/></svg>`
			listItemTitleWrapper.appendChild(title)

			listItem.appendChild(listItemTitleWrapper)
			itemsObj.push(listItem)
		})
		$('#lists').append(...itemsObj)
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
	#getClientInfo = () => {
		parent.postMessage({ action: 'getClientInfo' }, `${this.#clientDomain}`)
	}

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
				height: (this.#widgetData?.styles?.size || 60) + 20,
				width: (this.#widgetData?.styles?.size || 60) + 20,
				position: this.#widgetData?.styles?.position,
				top: this.#widgetData?.styles?.top || 0,
				bottom: this.#widgetData?.styles?.bottom || 0,
				left: this.#widgetData?.styles?.left || 0,
				right: this.#widgetData?.styles?.right || 0,
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

	#channelClickEventTrigger = (channelType, channelName, channelUrl) => {
		parent.postMessage(
			{ action: 'bitAssistChannelClick', channelInfo: { channelType, channelName, channelUrl } },
			`${this.#clientDomain}`,
		)
	}

	// =====================
	// poseMessage from parent
	// =====================
	#onMessageReceived = e => {
		const { action } = e.data
		if (action === 'windowLoaded') {
			this.#handleWindowLoaded(e.data)
		} else if (action === 'scrollPercent') {
			this.#handleScrollPercent(e.data)
		} else if (action === 'clickOutside') {
			this.#closeWidget()
		}
	}

	#handleWindowLoaded = ({ url, winWidth, winHeight, scrollPercent, apiEndPoint }) => {
		this.#root.style.setProperty('--client-win-width', winWidth + 'px')
		this.#root.style.setProperty('--client-win-height', winHeight + 'px')
		this.#scrollPercent = scrollPercent
		this.#apiEndPoint = apiEndPoint
		this.#isMobileDevice = winWidth < 768
		this.#clientPageUrl = url.slice(this.#clientDomain.length + 1, url.length)

		this.#fetchWidgetData()
	}

	#handleScrollPercent = ({ scrollPercent }) => {
		this.#scrollPercent = scrollPercent
		if (this.#widgetData?.page_scroll > 0 && !this.#delayExist) {
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

			if (typeof this.#widgetData.id === 'undefined') {
				console.error(this.#widgetData)
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
		if (this.#widgetData?.business_hours?.length && !this.#checkBusinessHours()) {
			return
		}

		this.#addCustomStyles()
		this.#renderChannels()
		this.#renderWidgetBubble()
		this.#hideCredit()
		this.#delayExist = true
		await this.#widgetShowDelay()
		this.#delayExist = false
		this.#showCallToAction()
		this.#widgetShowAfterScroll()

		if (this.#widgetData.styles?.position?.indexOf('top') > -1) {
			this.#root.style.setProperty('--widget-minus-sizeY', (this.#widgetData.styles?.top || 0) + 'px')
		}
		if (this.#widgetData.styles?.position?.indexOf('bottom') > -1) {
			this.#root.style.setProperty('--widget-minus-sizeY', (this.#widgetData.styles?.bottom || 0) + 'px')
		}
		if (this.#widgetData.styles?.position?.indexOf('left') > -1) {
			this.#root.style.setProperty('--widget-minus-sizeX', (this.#widgetData.styles?.left || 0) + 'px')
		}
		if (this.#widgetData.styles?.position?.indexOf('right') > -1) {
			this.#root.style.setProperty('--widget-minus-sizeX', (this.#widgetData.styles?.right || 0) + 'px')
		}
	}

	// eslint-disable-next-line no-promise-executor-return
	#delay = n => new Promise(resolve => setTimeout(resolve, n * 1000))

	#hideCredit = () => {
		if (this.#widgetData?.hide_credit) {
			$('#credit')?.remove()
		}
	}

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
		if (this.#widgetData.custom_css?.length > 0) {
			const styleElement = document.createElement('style')
			styleElement.appendChild(document.createTextNode(this.#widgetData.custom_css))
			document.head.appendChild(styleElement)
		}
	}

	#renderChannels = () => {
		this.#channels = createElm('div', { id: 'channels' })
		this.#channels.innerHTML = this.#widgetData?.widget_channels
			?.filter(
				widgetChannel =>
					((this.#isMobileDevice && widgetChannel.config?.channel_show_on.includes('mobile')) ||
						(!this.#isMobileDevice && widgetChannel.config?.channel_show_on.includes('desktop'))) &&
					((!this.#isOfficeHours && !widgetChannel.config?.hide_after_office_hours) || this.#isOfficeHours),
			)
			.map(
				widgetChannel => `
          <button class="channel" data-id="${
						widgetChannel.id
					}" data-channel_name="${widgetChannel.channel_name.toLowerCase()}" data-url="${
					widgetChannel.config?.url || '#'
				}" data-target="${widgetChannel.config.open_window_action}">
            <div class="channel-name">${widgetChannel.config.title}</div>
            <div class="channel-icon">
              <img src="${widgetChannel.channel_icon}" alt="${widgetChannel.config.title}">
            </div>
          </button>`,
			)
			.join('')
		this.#contentWrapper.appendChild(this.#channels)

		document.querySelectorAll('.channel').forEach(channel => {
			channel.addEventListener('click', this.#onChannelClick)
		})
	}

	#renderCard = () => {
		if ($('#card')) {
			this.#card?.classList.add('show')
			return
		}

		this.#card = createElm('div', { id: 'card', class: 'show' })
		const cardHeader = createElm('div', { id: 'cardHeader' })
		const h4 = document.createElement('h4')
		const iconBtn = createElm('button', { class: 'iconBtn closeCardBtn', title: 'Close' })

		iconBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="currentColor"><path d="M6.061 5l2.969-2.969A.75.75 0 0 0 9.03.97.75.75 0 0 0 7.969.969L5 3.938 2.031.969a.75.75 0 0 0-1.062 0 .75.75 0 0 0 0 1.063L3.938 5 .969 7.969a.75.75 0 0 0 0 1.062.75.75 0 0 0 1.063 0L5 6.063l2.969 2.969a.75.75 0 0 0 1.063 0 .75.75 0 0 0 0-1.062L6.061 5z"/></svg>`

		cardHeader.append(h4, iconBtn)
		this.#cardBody = createElm('div', { id: 'cardBody' })
		this.#card.append(cardHeader, this.#cardBody)
		this.#contentWrapper.appendChild(this.#card)

		iconBtn.addEventListener('click', this.#closeWidget)
	}

	#formSubmitted = async e => {
		e.preventDefault()

		const submitBtn = e.target.querySelector('[type="submit"]')
		const oldText = submitBtn.innerHTML
		const formData = new FormData(e.target)

		try {
			submitBtn.innerHTML = 'Sending...'
			submitBtn?.classList.add('disabled')
			const responseData = await fetch(`${this.#apiEndPoint}/responses`, {
				method: 'POST',
				body: formData,
			}).then(res => res.json())

			if (responseData?.status === 'success') {
				await this.#showToast('success', responseData?.data)
			} else {
				await this.#showToast('error', responseData?.data)
			}

			e.target.reset()
			e.target.querySelectorAll('.cfit-title').forEach(title => {
				title.innerHTML = 'No file chosen'
			})
			submitBtn?.classList.remove('disabled')
			submitBtn.innerHTML = oldText
		} catch (err) {
			console.log(err)
			await this.#showToast('error')
			e.target.reset()
			e.target.querySelectorAll('.cfit-title').forEach(title => {
				title.innerHTML = 'No file chosen'
			})
			submitBtn?.classList.remove('disabled')
			submitBtn.innerHTML = oldText
		}
	}

	#showToast = async (type, message) => {
		if (!this.#cardBody.contains(this.#formBody)) {
			return
		}

		const toast = createElm('div', { class: `toast ${type}` })
		const toastContent = createElm('div', { class: 'toast-content' })
		const toastText = createElm('div', { class: 'toast-text' })

		const toastTextTitle = createElm('div', { class: 'toast-text-title' })
		toastTextTitle.innerText = type === 'success' ? 'Success' : 'Error'

		const toastTextBody = createElm('div', { class: 'toast-text-body' })
		toastTextBody.innerText = type === 'success' ? message : 'Something went wrong'

		toastText.append(toastTextTitle, toastTextBody)
		toastContent.appendChild(toastText)
		toast.appendChild(toastContent)

		this.#cardBody.appendChild(toast)
		this.#formBody?.classList.add('hide')

		if (toast.classList.contains('success')) {
			toastTextTitle.style.color = this.#selectedFormBg
		}

		await this.#delay(2)
		if (!this.#formBody?.classList.contains('hide')) return

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

		$('#widget-img').src = this.#widgetData?.styles?.customImage || this.#widgetData?.styles?.iconUrl
		$('#widget-img')?.classList.add(this.#widgetData?.styles?.customImage ? 'image' : 'icon')

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

	#widgetShowAfterScroll = async () => {
		if (this.#widgetData?.page_scroll <= 0 || this.#scrollPercent >= this.#widgetData?.page_scroll) {
			this.#widgetWrapper.classList.remove('hide')
		} else {
			this.#widgetWrapper.classList.add('hide')
		}
		this.#resetClientWidgetSize()
	}

	#showCallToAction = async () => {
		if (!this.#widgetData?.call_to_action?.text) {
			return
		}

		if (this.#widgetData?.call_to_action?.delay > 0) {
			await this.#delay(this.#widgetData.call_to_action.delay)
		}

		this.#callToAction = createElm('div', { id: 'callToActionMsg' })
		this.#callToAction.innerHTML = this.#widgetData.call_to_action.text

		const ctaImage = createElm('img', { src: closeIcon })
		this.#closeCallToAction = createElm('button', { class: 'iconBtn', id: 'closeCallToAction' })
		this.#closeCallToAction.appendChild(ctaImage)
		this.#closeCallToAction.addEventListener('click', this.#callToActionHide)

		$('#widgetBubbleRow').prepend(this.#closeCallToAction, this.#callToAction)

		if (this.#widgetBubble?.classList.contains('open')) {
			this.#callToActionHide()
			return
		}

		this.#resetClientWidgetSize()
	}
}
