import './css/style.scss'
import leftArrow from './public/images/left-circle-arrow.svg'
import rightArrow from './public/images/right-circle-arrow.svg'
import closeIcon from './public/images/close-icon.svg'
import { mixinCommon } from './channels/common.js'
import { mixinIframe } from './channels/render-iframe.js'
import { mixinFaq } from './channels/render-faq.js'
import {
	$,
	createElm,
	globalAppend,
	globalClassListAdd,
	globalClassListContains,
	globalClassListRemove,
	globalClassListToggle,
	globalEventListener,
	globalInnerHTML,
	globalInnerText,
	globalPostMessage,
	globalQuerySelectorAll,
	globalSetAttribute,
	globalSetProperty,
} from './utils/Helpers.js'

export default class Widget {
	#apiEndPoint
	#root
	widgetData
	#clientDomain
	#widgetBubble
	contentWrapper
	#widgetWrapper
	channels
	#isMobileDevice
	#clientPageUrl
	#scrollPercent
	#callToAction
	#closeCallToAction
	#isOfficeHours
	#card
	#selectedFormBg
	cardBody
	#formBody
	#delayExist
	iFrameWrapper

	constructor(config) {
		this.#delayExist = true
		this.#isOfficeHours = true
		this.#isMobileDevice = false
		this.#root = document.documentElement
		this.#clientDomain = config.clientDomain
		this.contentWrapper = $('#contentWrapper')
		this.#widgetWrapper = $('#widgetWrapper')
		this.#widgetBubble = $(config.widgetBubble)
		this.addEvents()
		this.getClientInfo()

		if (typeof mixinCommon !== 'undefined') {
			Object.assign(Widget.prototype, mixinCommon)
		}

		if (typeof mixinIframe !== 'undefined') {
			Object.assign(Widget.prototype, mixinIframe)
		}

		if (typeof mixinIframe !== 'undefined') {
			Object.assign(Widget.prototype, mixinFaq)
		}
	}

	delay = n => new Promise(resolve => setTimeout(resolve, n * 1000))

	debounce = (callback, delay) => {
		let debounceTimer
		return function () {
			const context = this
			const args = arguments
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => callback.apply(context, args), delay)
		}
	}

	// ====================
	// Events
	// ====================
	addEvents = () => {
		globalEventListener(window, 'message', this.onMessageReceived)
		globalEventListener(this.#widgetBubble, 'click', this.onBubbleClick)
	}

	closeWidget = () => {
		this.hideCard()
		this.hideChannels()
		if (typeof this.iFrameWrapper !== 'undefined') {
			this.removeIframe()
		}
		globalClassListRemove(this.#widgetBubble, 'open')
		globalClassListAdd(this.contentWrapper, 'hide')
		this.widgetOpenActions(false)
		globalSetProperty(this.#root.style, '--card-width', '330px')
	}

	hideCard = () => {
		if (globalClassListContains(this.#card, 'show')) {
			globalClassListRemove(this.#card, 'show')
		}
	}

	onBubbleClick = (e, toggleIfNotExist = false) => {
		if (toggleIfNotExist && globalClassListContains(this.channels, 'show')) {
			return
		}

		globalClassListToggle(this.channels, 'show')

		if (globalClassListContains(this.#card, 'show')) {
			globalSetProperty(this.#root.style, '--card-width', '330px')
			this.hideCard()
			this.resetClientWidgetSize()
		} else if (typeof this.iFrameWrapper !== 'undefined') {
			this.removeIframe()
		} else {
			globalClassListToggle(this.contentWrapper, 'hide')
			const isWidgetOpen = globalClassListToggle(this.#widgetBubble, 'open')
			this.widgetOpenActions(isWidgetOpen)
		}
	}

	removeIframe = () => {
		this.iFrameWrapper.remove()
		this.iFrameWrapper = undefined
		this.resetClientWidgetSize()
	}

	widgetOpenActions = isWidgetOpen => {
		this.openClientWidget(isWidgetOpen)
		if (isWidgetOpen && !globalClassListContains(this.#callToAction, 'hide')) {
			this.callToActionHide()
			return
		}

		this.resetClientWidgetSize()
	}

	callToActionHide = () => {
		globalClassListAdd(this.#callToAction, 'hide')
		globalClassListAdd(this.#closeCallToAction, 'hide')

		this.resetClientWidgetSize()
	}

	onChannelClick = e => {
		e.preventDefault()
		const channel = e.target.closest('.channel')
		const { id, url, channel_name, target } = channel.dataset || {}

		const widgetChannel = this.widgetData?.widget_channels.find(item => item.id === id)
		const { title, unique_id } = widgetChannel?.config || {}
		const { isChatWidget } = widgetChannel?.config?.card_config || {}

		if (channel_name === 'faq') {
			this.renderFaq(widgetChannel)
		} else if (channel_name === 'custom-form') {
			this.renderForm(widgetChannel)
		} else if (channel_name === 'knowledge-base') {
			this.renderKnowledgeBase(widgetChannel)
		} else if (channel_name === 'wp-search') {
			this.renderWPSearch(widgetChannel?.config)
		} else if (channel_name === 'google-map') {
			this.renderIframe(url, channel_name, unique_id)
		} else if (channel_name === 'youtube' || channel_name === 'custom-iframe') {
			this.renderIframe(url, channel_name, false)
		} else if (isChatWidget) {
			this.chatWidgetClick(channel_name)
		} else if (target === 'new_window' && url !== '#') {
			window.open(url, '_blank', 'popup')
		} else if (url !== '#') {
			window.open(url, target)
		}

		this.resetClientWidgetSize()
		this.channelClickEventTrigger(channel_name, title, url)
	}

	renderWPSearch = config => {
		this.hideChannels()
		this.renderCard()
		this.setCardStyle(config)

		const wpSearchBody = createElm('div', { id: 'wpSearchBody' })
		const listWrapper = createElm('div', { id: 'listWrapper' })
		const lists = createElm('div', { id: 'lists', 'data-link_open_action': config.open_window_action })
		const listSearch = createElm('input', {
			type: 'text',
			id: 'listSearch',
			class: 'formControl',
			placeholder: 'Search',
		})
		globalAppend(listWrapper, [lists, listSearch])
		globalAppend(wpSearchBody, listWrapper)

		globalInnerHTML(this.cardBody, '')
		globalAppend(this.cardBody, wpSearchBody)

		this.searchPostPage('')
		globalEventListener(
			listSearch,
			'input',
			this.debounce(e => this.searchPostPage(e.target.value), 600),
		)
	}

	searchPostPage = async (value, page = 1) => {
		const { data, pagination } = await this.fetchWPSearchData(value, page)

		this.renderWPSearchItem(data)
		if (pagination?.has_next || pagination?.has_previous) {
			this.renderWPSearchPagination(pagination)
		}

		this.resetClientWidgetSize()
	}

	fetchWPSearchData = async (value, page) => {
		const { data } = await fetch(`${this.#apiEndPoint}/wpSearch`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ search: value, page }),
		}).then(res => res.json())

		return data
	}

	renderWPSearchItem = items => {
		const lists = $('#lists')
		globalInnerHTML(lists, '')
		const itemsObj = []

		items?.forEach(item => {
			const listItem = createElm('div', { class: 'listItem' })
			const listItemTitleWrapper = createElm('button', { class: 'listItemTitleWrapper', title: item.guid })
			const title = createElm('p', { class: 'title' })
			const type = createElm('p', { class: 'type' })

			globalAppend(listItem, listItemTitleWrapper)
			globalAppend(listItemTitleWrapper, [title, type])
			globalInnerText(title, item?.post_title || '(no title)')
			globalInnerText(type, item?.post_type || '')
			itemsObj.push(listItem)

			globalEventListener(listItemTitleWrapper, 'click', () => {
				const { link_open_action } = lists.dataset
				if (link_open_action === 'new_window') {
					window.open(item.guid, '_blank', 'popup')
				} else {
					window.open(item.guid, link_open_action)
				}
			})
		})

		globalAppend(lists, itemsObj)
	}

	renderWPSearchPagination = pagination => {
		const paginationWrap = createElm('div', { class: 'pagination' })

		const pageNumber = createElm('span', { class: 'pageNumber' })
		globalInnerText(pageNumber, `${pagination?.current} / ${pagination?.total} page`)

		const nextPage = createElm('button', { class: 'nextPage' })
		globalInnerText(nextPage, 'Next')
		if (!pagination?.has_next) {
			globalSetAttribute(nextPage, 'disabled', '')
		}
		const prevPage = createElm('button', { class: 'prevPage' })
		globalInnerText(prevPage, 'Prev')
		if (!pagination?.has_previous) {
			globalSetAttribute(prevPage, 'disabled', '')
		}

		const searchValue = $('#listSearch')?.value || ''
		globalEventListener(nextPage, 'click', () => this.searchPostPage(searchValue, pagination?.next))
		globalEventListener(prevPage, 'click', () => this.searchPostPage(searchValue, pagination?.previous))

		globalAppend(paginationWrap, [prevPage, nextPage, pageNumber])
		globalAppend($('#lists'), paginationWrap)
	}

	setCardStyle = config => {
		this.#selectedFormBg = config?.card_config?.card_bg_color?.str

		globalInnerHTML($('#cardHeader>h4'), config?.title)

		globalSetProperty(this.#root.style, '--card-theme-color', this.#selectedFormBg)
		globalSetProperty(this.#root.style, '--card-text-color', config?.card_config?.card_text_color?.str)
	}

	renderForm = widgetChannel => {
		this.hideChannels()
		this.renderCard()
		this.setCardStyle(widgetChannel.config)
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
		globalInnerText(submitButton, cardConfig?.submit_button_text)

		globalAppend(this.#formBody, [dynamicFieldsDiv, hiddenInput, submitButton])

		globalInnerHTML(this.cardBody, '')
		globalAppend(this.cardBody, this.#formBody)

		globalEventListener(this.#formBody, 'submit', this.formSubmitted)
		this.createAllFields(cardConfig?.form_fields)
	}

	createAllFields = fields => {
		const dynamicFields = $('#dynamicFields')

		let flag = false
		fields?.forEach(field => {
			if (field.field_type === 'file' && !flag) {
				globalSetAttribute($('#formBody'), 'enctype', 'multipart/form-data')
				flag = true
			}

			if (field.field_type === 'rating') {
				this.createRatingField(field, dynamicFields, 'rating')
			} else if (field.field_type === 'feedback') {
				this.createRatingField(field, dynamicFields, 'feedback')
			} else {
				this.createTextField(field, dynamicFields)
			}
		})
	}

	createRatingField = (field, dynamicFields, filedType) => {
		const randomId = Math.floor(Math.random() * 100000000)
		const name = field.label.toLowerCase().replace(/ /g, '_')
		const wrapper = createElm('div', { class: filedType })

		if (filedType === 'rating') {
			globalClassListAdd(wrapper, field.rating_type)
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
				globalSetAttribute(inputElm, 'required', '')
			}

			const labelElm = createElm('label', { title: type, for: fieldId, class: type })
			if (filedType === 'feedback') {
				globalInnerHTML(labelElm, `${type.charAt(0).toUpperCase() + type.slice(1)}`)
				const feedbackIcon = createElm('div', { class: 'feedback-icon' })
				labelElm.prepend(feedbackIcon)
			}

			globalAppend(wrapper, [inputElm, labelElm])
		})
		globalAppend(dynamicFields, wrapper)
	}

	createTextField = (field, dynamicFields) => {
		const fieldInput = createElm(field.field_type === 'textarea' ? 'textarea' : 'input')

		globalSetAttribute(
			fieldInput,
			'name',
			`${field.label.toLowerCase().replace(/ /g, '_')}${!!field?.allow_multiple ? '[]' : ''}`,
		)
		globalSetAttribute(fieldInput, 'placeholder', field.label + (field.required ? '' : ' (optional)'))
		if (field.required) {
			globalSetAttribute(fieldInput, 'required', '')
		}

		if (field.field_type === 'GDPR') {
			this.gdprField(field, dynamicFields, fieldInput)
			return
		}

		globalClassListAdd(fieldInput, 'formControl')
		globalSetAttribute(fieldInput, 'type', field.field_type)

		if (field.field_type === 'file') {
			this.fileField(field, dynamicFields, fieldInput)
			return
		}
		globalAppend(dynamicFields, fieldInput)
	}

	fileField = (field, dynamicFields, fieldInput) => {
		if (!!field?.allow_multiple) {
			globalSetAttribute(fieldInput, 'multiple', '')
		}

		const inputWrap = createElm('div', { class: 'formControl customFile' })

		const customFileInput = createElm('div', { class: 'cfit' })
		const customFileInputBtn = createElm('button', { class: 'cfit-btn', type: 'button' })
		globalInnerText(customFileInputBtn, 'Attach File')
		const customFileInputTitle = createElm('div', { class: 'cfit-title' })
		globalInnerText(customFileInputTitle, 'No file chosen')

		globalAppend(customFileInput, [customFileInputBtn, customFileInputTitle])
		globalAppend(inputWrap, [customFileInput, fieldInput])
		globalAppend(dynamicFields, inputWrap)

		globalEventListener(customFileInputBtn, 'click', () => fieldInput.click())
		globalEventListener(fieldInput, 'change', function (e) {
			let fileName = 'No file chosen'
			const fileLength = e.target.files.length
			if (fileLength > 0) {
				fileName = fileLength === 1 ? e.target.files[0].name : `${fileLength} files`
			}
			globalInnerText(customFileInputTitle, fileName)
		})
	}

	gdprField = (field, dynamicFields, fieldInput) => {
		globalSetAttribute(fieldInput, 'type', 'checkbox')

		const link = createElm('a', { target: '_blank' })
		globalInnerHTML(link, field.label)
		if (field?.url) {
			link.href = field.url
		}

		const gdprContainer = createElm('div', { class: 'gdprContainer' })
		globalAppend(gdprContainer, [fieldInput, link])
		globalAppend(dynamicFields, gdprContainer)
	}

	// Faq

	// Knowledge base
	renderKnowledgeBase = widgetChannel => {
		this.hideChannels()
		this.renderCard()
		this.setCardStyle(widgetChannel.config)
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
		globalAppend(listWrapper, [lists, listSearch])

		const overlay = createElm('div', { class: 'overlay' })
		const knowledgeBaseDescription = createElm('div', { id: 'knowledgeBaseDescription' })
		const descriptionTitle = createElm('div', { class: 'descriptionTitle' })
		const p = createElm('p')
		const modalActions = createElm('div', { class: 'modalActions' })

		const prevKBBtn = createElm('button', { class: 'iconBtn rounded prevKB', title: 'Prev' })
		const prevKbImg = createElm('img', { src: leftArrow, alt: 'prev' })
		globalAppend(prevKBBtn, prevKbImg)

		const nextKBBtn = createElm('button', { class: 'iconBtn rounded nextKB', title: 'Next' })
		const nextKbImg = createElm('img', { src: rightArrow, alt: 'next' })
		globalAppend(nextKBBtn, nextKbImg)

		const closeKBBtn = createElm('button', { class: 'iconBtn rounded closeKB', title: 'Close' })
		const closeKbImg = createElm('img', { src: closeIcon, alt: 'close' })
		globalAppend(closeKBBtn, closeKbImg)

		globalAppend(modalActions, [prevKBBtn, nextKBBtn, closeKBBtn])
		globalAppend(descriptionTitle, [p, modalActions])

		const content = createElm('div', { class: 'content' })
		globalAppend(knowledgeBaseDescription, [descriptionTitle, content])
		globalAppend(knowledgeBaseBody, [listWrapper, overlay, knowledgeBaseDescription])

		globalInnerHTML(this.cardBody, '')
		globalAppend(this.cardBody, knowledgeBaseBody)

		globalEventListener(listSearch, 'input', this.searchList)
		globalEventListener(closeKBBtn, 'click', this.knowledgeBaseDescToggle)
		globalEventListener(prevKBBtn, 'click', () => this.gotoPrevNextKB('previousElementSibling'))
		globalEventListener(nextKBBtn, 'click', () => this.gotoPrevNextKB('nextElementSibling'))

		this.renderKnowledgeBaseItem(cardConfig?.knowledge_bases)
	}

	renderKnowledgeBaseItem = items => {
		this.itemListAppend(items)
		globalQuerySelectorAll(document, '.listItemTitleWrapper').forEach(item => {
			globalEventListener(item, 'click', e => this.knowledgeBaseDescToggle(e, items))
		})
	}

	gotoPrevNextKB = indicator => {
		const item = $('.listItem.active')[indicator]
		if (item) {
			item.querySelector('.listItemTitleWrapper').click()
		}
	}

	knowledgeBaseDescToggle = (e, knowledgeBases) => {
		globalClassListRemove($('.listItem.active'), 'active')

		const knowledgeBaseBody = $('#knowledgeBaseBody')
		if (!knowledgeBases) {
			globalClassListRemove(knowledgeBaseBody, 'openDesc')
			globalSetProperty(this.#root.style, '--card-width', '330px')
			this.resetClientWidgetSize()
			return
		}

		globalClassListToggle(e.target.closest('.listItem'), 'active')
		const knowledgeBase = knowledgeBases.find(
			item => Number(item.id) === Number(e.target.closest('.listItemTitleWrapper').dataset.item_id),
		)
		if (!knowledgeBase) {
			return
		}

		globalClassListAdd(knowledgeBaseBody, 'openDesc')
		globalInnerHTML($('.descriptionTitle p'), knowledgeBase?.title || '')
		globalInnerHTML($('.content'), knowledgeBase?.description || '')

		globalSetProperty(this.#root.style, '--modal-title-height', $('.descriptionTitle').offsetHeight + 'px')
		globalSetProperty(this.#root.style, '--card-width', '767px')
		this.resetClientWidgetSize()
	}

	itemListAppend = items => {
		const itemsObj = []
		items?.forEach(item => {
			const listItem = createElm('div', { class: 'listItem' })
			const listItemTitleWrapper = createElm('button', { class: 'listItemTitleWrapper', 'data-item_id': item.id })

			const title = createElm('p', { class: 'title' })
			globalInnerHTML(title, item?.title || '')

			globalInnerHTML(
				listItemTitleWrapper,
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="currentColor"><path d="M7.397 14.176a7.09 7.09 0 0 0 7.088-7.088A7.09 7.09 0 0 0 7.397 0 7.09 7.09 0 0 0 .31 7.088a7.09 7.09 0 0 0 7.088 7.088z" fill-opacity=".2"/><path d="M6.504 10.122c-.135 0-.269-.05-.376-.156-.099-.1-.154-.235-.154-.376s.055-.276.154-.376l2.126-2.126-2.126-2.126c-.099-.1-.154-.235-.154-.376s.055-.276.154-.376c.206-.206.546-.206.751 0l2.502 2.502c.206.206.206.546 0 .751L6.88 9.966c-.106.106-.241.156-.376.156z"/></svg>`,
			)
			globalAppend(listItemTitleWrapper, title)

			globalAppend(listItem, listItemTitleWrapper)
			itemsObj.push(listItem)
		})
		globalAppend($('#lists'), itemsObj)
	}

	searchList = e => {
		const search = e.target.value.toLowerCase()
		globalQuerySelectorAll(document, '.listItem').forEach(item => {
			if (item.querySelector('.title').innerText.toLowerCase().includes(search)) {
				globalClassListRemove(item, 'hide')
			} else {
				globalClassListAdd(item, 'hide')
			}
		})
	}

	// =====================
	// poseMessage to parent
	// =====================
	getClientInfo = () => {
		globalPostMessage(parent, { action: 'getClientInfo' }, `${this.#clientDomain}`)
	}

	openClientWidget = isWidgetOpen => {
		globalPostMessage(parent, { action: 'widgetOpen', isWidgetOpen }, `${this.#clientDomain}`)
	}

	removeClientWidget = () => {
		globalPostMessage(parent, { action: 'removeWidget' }, `${this.#clientDomain}`)
	}

	renderWidgetConf = () => {
		globalPostMessage(
			parent,
			{
				action: 'widgetLoaded',
				height: (this.widgetData?.styles?.size || 60) + 20,
				width: (this.widgetData?.styles?.size || 60) + 20,
				position: this.widgetData?.styles?.position,
				top: this.widgetData?.styles?.top || 0,
				bottom: this.widgetData?.styles?.bottom || 0,
				left: this.widgetData?.styles?.left || 0,
				right: this.widgetData?.styles?.right || 0,
				pageScroll: this.widgetData?.page_scroll,
			},
			`${this.#clientDomain}`,
		)
	}

	resetClientWidgetSize = () => {
		globalPostMessage(
			parent,
			{ action: 'resetWidgetSize', height: this.#widgetWrapper.offsetHeight, width: this.#widgetWrapper.offsetWidth },
			`${this.#clientDomain}`,
		)
	}

	chatWidgetClick = chatWidgetName => {
		globalPostMessage(parent, { action: 'chatWidgetClick', chatWidgetName }, `${this.#clientDomain}`)
	}

	channelClickEventTrigger = (channelType, channelName, channelUrl) => {
		globalPostMessage(
			parent,
			{ action: 'bitAssistChannelClick', channelInfo: { channelType, channelName, channelUrl } },
			`${this.#clientDomain}`,
		)
	}

	// =====================
	// poseMessage from parent
	// =====================
	onMessageReceived = e => {
		const { action } = e.data
		if (action === 'windowLoaded') {
			this.handleWindowLoaded(e.data)
		} else if (action === 'scrollPercent') {
			this.handleScrollPercent(e.data)
		} else if (action === 'clickOutside') {
			this.closeWidget()
		}
	}

	handleWindowLoaded = ({ url, winWidth, winHeight, scrollPercent, apiEndPoint }) => {
		globalSetProperty(this.#root.style, '--client-win-width', winWidth + 'px')
		globalSetProperty(this.#root.style, '--client-win-height', winHeight + 'px')
		this.#scrollPercent = scrollPercent
		this.#apiEndPoint = apiEndPoint
		this.#isMobileDevice = winWidth < 768
		this.#clientPageUrl = url.slice(this.#clientDomain.length + 1, url.length)

		this.fetchWidgetData()
	}

	handleScrollPercent = ({ scrollPercent }) => {
		this.#scrollPercent = scrollPercent
		if (this.widgetData?.page_scroll > 0 && !this.#delayExist) {
			this.widgetShowAfterScroll()
		}
	}

	// =====================
	// Widget setup
	// =====================
	fetchWidgetData = async () => {
		try {
			const { data } = await fetch(`${this.#apiEndPoint}/bitAssistWidget`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ domain: this.#clientDomain }),
			}).then(res => res.json())

			this.widgetData = data

			if (typeof this.widgetData.id === 'undefined') {
				console.error(this.widgetData)
				this.removeClientWidget()
				return
			}

			this.widgetSetup()
		} catch (err) {
			console.log(err)
			this.removeClientWidget()
		}
	}

	widgetSetup = async () => {
		if (!this.setWidgetVisibleOrNot()) {
			return
		}

		this.renderWidgetConf()
		if (this.widgetData?.business_hours?.length && !this.checkBusinessHours()) {
			return
		}

		this.addCustomStyles()
		this.renderChannels()
		this.renderWidgetBubble()
		this.hideCredit()
		this.#delayExist = true
		await this.widgetShowDelay()
		this.delayExist = false
		this.showCallToAction()
		this.widgetShowAfterScroll()

		if (this.widgetData.styles?.position?.indexOf('top') > -1) {
			globalSetProperty(this.#root.style, '--widget-minus-sizeY', (this.widgetData.styles?.top || 0) + 'px')
		}
		if (this.widgetData.styles?.position?.indexOf('bottom') > -1) {
			globalSetProperty(this.#root.style, '--widget-minus-sizeY', (this.widgetData.styles?.bottom || 0) + 'px')
		}
		if (this.widgetData.styles?.position?.indexOf('left') > -1) {
			globalSetProperty(this.#root.style, '--widget-minus-sizeX', (this.widgetData.styles?.left || 0) + 'px')
		}
		if (this.widgetData.styles?.position?.indexOf('right') > -1) {
			globalSetProperty(this.#root.style, '--widget-minus-sizeX', (this.widgetData.styles?.right || 0) + 'px')
		}
	}

	hideCredit = () => {
		if (this.widgetData?.hide_credit) {
			$('#credit')?.remove()
		}
	}

	setWidgetVisibleOrNot = () => {
		if (this.widgetData?.exclude_pages?.length > 0) {
			let isExistAnyShowOn = false
			let isThisPageVisible = false

			const isPageExcluded = this.widgetData?.exclude_pages.some(page => {
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
				this.removeClientWidget()
				return false
			}
		}

		return true
	}

	checkBusinessHours = () => {
		const date = new Date()
		const toDay = this.widgetData?.business_hours[date.getDay()]

		if (!toDay || !toDay?.start || !toDay?.end) {
			this.removeClientWidget()
			return false
		}

		const [startHour, startMinute] = toDay?.start.split(':').map(Number) || [0, 0]
		const [endHour, endMinute] = toDay?.end.split(':').map(Number) || [0, 0]

		// eslint-disable-next-line new-cap
		const timezone = this.widgetData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
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

	addCustomStyles = () => {
		if (this.widgetData.custom_css?.length > 0) {
			const styleElm = createElm('style')
			globalAppend(styleElm, document.createTextNode(this.widgetData.custom_css))
			globalAppend(document.head, styleElm)
		}
	}

	renderChannels = () => {
		this.channels = createElm('div', { id: 'channels' })
		const allChannels = this.widgetData?.widget_channels
			?.filter(
				widgetChannel =>
					((this.#isMobileDevice && widgetChannel.config?.channel_show_on.includes('mobile')) ||
						(!this.#isMobileDevice && widgetChannel.config?.channel_show_on.includes('desktop'))) &&
					((!this.#isOfficeHours && !widgetChannel.config?.hide_after_office_hours) || this.#isOfficeHours),
			)
			.map(widgetChannel => {
				const channelBtn = createElm('button', {
					class: 'channel',
					'data-id': widgetChannel.id,
					'data-channel_name': widgetChannel.channel_name.toLowerCase(),
					'data-url': widgetChannel.config?.url || '#',
					'data-target': widgetChannel.config.open_window_action,
				})
				const channelName = createElm('div', { class: 'channel-name' })
				globalInnerText(channelName, widgetChannel.config.title)

				const channelIcon = createElm('div', { class: 'channel-icon' })
				const channelImg = createElm('img', { src: widgetChannel.channel_icon, alt: widgetChannel.config.title })

				globalAppend(channelIcon, channelImg)
				globalAppend(channelBtn, [channelName, channelIcon])
				return channelBtn
			})

		globalAppend(this.channels, allChannels)
		globalAppend(this.contentWrapper, this.channels)

		globalQuerySelectorAll(document, '.channel').forEach(channel => {
			globalEventListener(channel, 'click', this.onChannelClick)
		})
	}

	renderCard = () => {
		if ($('#card')) {
			globalClassListAdd(this.#card, 'show')
			return
		}

		this.#card = createElm('div', { id: 'card', class: 'show' })
		const cardHeader = createElm('div', { id: 'cardHeader' })
		const h4Elm = createElm('h4')
		const iconBtn = createElm('button', { class: 'iconBtn closeCardBtn', title: 'Close' })

		globalInnerHTML(
			iconBtn,
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="currentColor"><path d="M6.061 5l2.969-2.969A.75.75 0 0 0 9.03.97.75.75 0 0 0 7.969.969L5 3.938 2.031.969a.75.75 0 0 0-1.062 0 .75.75 0 0 0 0 1.063L3.938 5 .969 7.969a.75.75 0 0 0 0 1.062.75.75 0 0 0 1.063 0L5 6.063l2.969 2.969a.75.75 0 0 0 1.063 0 .75.75 0 0 0 0-1.062L6.061 5z"/></svg>`,
		)

		globalAppend(cardHeader, [h4Elm, iconBtn])
		this.cardBody = createElm('div', { id: 'cardBody' })
		globalAppend(this.#card, [cardHeader, this.cardBody])
		globalAppend(this.contentWrapper, this.#card)

		globalEventListener(iconBtn, 'click', this.closeWidget)
	}

	formSubmitted = async e => {
		e.preventDefault()

		const submitBtn = e.target.querySelector('[type="submit"]')
		const oldText = submitBtn.innerText
		const formData = new FormData(e.target)

		try {
			globalInnerText(submitBtn, 'Sending...')
			globalClassListAdd(submitBtn, 'disabled')
			const responseData = await fetch(`${this.#apiEndPoint}/responses`, {
				method: 'POST',
				body: formData,
			}).then(res => res.json())

			if (responseData?.status === 'success') {
				await this.showToast('success', responseData?.data)
			} else {
				await this.showToast('error', responseData?.data)
			}

			e.target.reset()
			globalQuerySelectorAll(e.target, '.cfit-title').forEach(title => {
				globalInnerText(title, 'No file chosen')
			})
			globalClassListRemove(submitBtn, 'disabled')
			globalInnerText(submitBtn, oldText)
		} catch (err) {
			console.log(err)
			await this.showToast('error')
			e.target.reset()
			globalQuerySelectorAll(e.target, '.cfit-title').forEach(title => {
				globalInnerText(title, 'No file chosen')
			})
			globalClassListRemove(submitBtn, 'disabled')
			globalInnerText(submitBtn, oldText)
		}
	}

	showToast = async (type, message) => {
		if (!this.cardBody.contains(this.#formBody)) {
			return
		}

		const toast = createElm('div', { class: `toast ${type}` })
		const toastContent = createElm('div', { class: 'toast-content' })
		const toastText = createElm('div', { class: 'toast-text' })

		const toastTextTitle = createElm('div', { class: 'toast-text-title' })
		toastTextTitle.innerText = type === 'success' ? 'Success' : 'Error'

		const toastTextBody = createElm('div', { class: 'toast-text-body' })
		toastTextBody.innerText = type === 'success' ? message : 'Something went wrong'

		globalAppend(toastText, [toastTextTitle, toastTextBody])
		globalAppend(toastContent, toastText)
		globalAppend(toast, toastContent)

		globalAppend(this.cardBody, toast)
		globalClassListAdd(this.#formBody, 'hide')

		if (globalClassListContains(toast, 'success')) {
			toastTextTitle.style.color = this.#selectedFormBg
		}

		await this.delay(2)
		if (!globalClassListContains(this.#formBody, 'hide')) return

		this.cardBody.removeChild(toast)
		globalClassListRemove(this.#formBody, 'hide')
	}

	renderWidgetBubble = () => {
		globalSetProperty(this.#root.style, '--widget-size', (this.widgetData?.styles?.size || 60) + 'px')
		globalSetProperty(this.#root.style, '--widget-color', this.widgetData?.styles?.color?.str)

		if (this.widgetData?.widget_behavior === 2) {
			this.#widgetBubble.removeEventListener('click', this.onBubbleClick)
			globalEventListener(this.#widgetBubble, 'mouseenter', e => this.onBubbleClick(e, true))
			globalEventListener(this.#widgetWrapper, 'mouseleave', this.onBubbleClick)
		} else if (this.widgetData?.widget_behavior === 3) {
			this.onBubbleClick()
		}

		globalClassListAdd(this.#widgetBubble, this.widgetData?.styles?.shape)
		globalClassListAdd(this.#widgetWrapper, this.widgetData?.styles?.position)

		$('#widget-img').src = this.widgetData?.styles?.customImage || this.widgetData?.styles?.iconUrl
		globalClassListAdd($('#widget-img'), this.widgetData?.styles?.customImage ? 'image' : 'icon')

		// Change image color depend on background
		const brightness = Math.round(
			(parseInt(this.widgetData?.styles?.color?.r, 10) * 299 +
				parseInt(this.widgetData?.styles?.color?.g, 10) * 587 +
				parseInt(this.widgetData?.styles?.color?.b, 10) * 114) /
				1000,
		)
		globalSetProperty(this.#root.style, '--widget-bubble-icon-color', brightness > 125 ? 'invert(0)' : 'invert(1)')
	}

	widgetShowDelay = async () => {
		if (this.widgetData?.initial_delay > 0) {
			await this.delay(this.widgetData.initial_delay)
		}
	}

	widgetShowAfterScroll = async () => {
		if (this.widgetData?.page_scroll <= 0 || this.#scrollPercent >= this.widgetData?.page_scroll) {
			globalClassListRemove(this.#widgetWrapper, 'hide')
		} else {
			globalClassListAdd(this.#widgetWrapper, 'hide')
		}
		this.resetClientWidgetSize()
	}

	showCallToAction = async () => {
		if (!this.widgetData?.call_to_action?.text) {
			return
		}

		if (this.widgetData?.call_to_action?.delay > 0) {
			await this.delay(this.widgetData.call_to_action.delay)
		}

		this.#callToAction = createElm('div', { id: 'callToActionMsg' })
		globalInnerHTML(this.#callToAction, this.widgetData.call_to_action.text)

		const ctaImage = createElm('img', { src: closeIcon })
		this.#closeCallToAction = createElm('button', { class: 'iconBtn', id: 'closeCallToAction' })
		globalAppend(this.#closeCallToAction, ctaImage)
		globalEventListener(this.#closeCallToAction, 'click', this.callToActionHide)

		$('#widgetBubbleRow').prepend(this.#closeCallToAction, this.#callToAction)

		if (globalClassListContains(this.#widgetBubble, 'open')) {
			this.callToActionHide()
			return
		}

		this.resetClientWidgetSize()
	}
}
