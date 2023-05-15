import {
	$,
	createElm,
	globalAppend,
	globalEventListener,
	globalSetProperty,
	globalPostMessage,
	globalInnerHTML,
	globalInnerText,
	globalSetAttribute,
	globalClassListAdd,
	globalClassListRemove,
	globalQuerySelectorAll,
	globalClassListContains,
	globalClassListToggle,
} from '../utils/Helpers.js'

export const common = {
	hideChannels() {
		if (globalClassListContains(this.channels, 'show')) {
			globalClassListRemove(this.channels, 'show')
		}
	},

	debounce(callback, delay) {
		let debounceTimer
		return function () {
			const context = this
			const args = arguments
			clearTimeout(debounceTimer)
			debounceTimer = setTimeout(() => callback.apply(context, args), delay)
		}
	},

	renderCard() {
		if ($('#card')) {
			globalClassListAdd(this.card, 'show')
			return
		}

		this.card = createElm('div', { id: 'card', class: 'show' })
		const cardHeader = createElm('div', { id: 'cardHeader' })
		const h4Elm = createElm('h4')
		const iconBtn = createElm('button', { class: 'iconBtn closeCardBtn', title: 'Close' })

		globalInnerHTML(
			iconBtn,
			`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" fill="currentColor"><path d="M6.061 5l2.969-2.969A.75.75 0 0 0 9.03.97.75.75 0 0 0 7.969.969L5 3.938 2.031.969a.75.75 0 0 0-1.062 0 .75.75 0 0 0 0 1.063L3.938 5 .969 7.969a.75.75 0 0 0 0 1.062.75.75 0 0 0 1.063 0L5 6.063l2.969 2.969a.75.75 0 0 0 1.063 0 .75.75 0 0 0 0-1.062L6.061 5z"/></svg>`,
		)

		globalAppend(cardHeader, [h4Elm, iconBtn])
		this.cardBody = createElm('div', { id: 'cardBody' })
		globalAppend(this.card, [cardHeader, this.cardBody])
		globalAppend(this.contentWrapper, this.card)

		globalEventListener(iconBtn, 'click', this.closeWidget)
	},

	setCardStyle(config) {
		this.selectedFormBg = config?.card_config?.card_bg_color?.str

		globalInnerHTML($('#cardHeader>h4'), config?.title)

		globalSetProperty(this.root.style, '--card-theme-color', this.selectedFormBg)
		globalSetProperty(this.root.style, '--card-text-color', config?.card_config?.card_text_color?.str)
	},

	hideCard() {
		if (globalClassListContains(this.card, 'show')) {
			globalClassListRemove(this.card, 'show')
		}
	},

	itemListAppend(items) {
		const itemsObj = []
		items?.forEach(item => {
			const listItem = createElm('div', { class: 'listItem' })
			const listItemTitleWrapper = createElm('button', {
				class: 'listItemTitleWrapper',
				'data-item_id': item.id ? item.id : item.order_id,
			})

			const title = createElm('p', { class: 'title' })
			globalInnerHTML(
				title,
				item.title
					? item.title
					: (item.order_id ? 'Order Id: ' + item.order_id + ` (${item.shipping_status})` : '') || '',
			)

			globalInnerHTML(
				listItemTitleWrapper,
				`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 15 15" fill="currentColor"><path d="M7.397 14.176a7.09 7.09 0 0 0 7.088-7.088A7.09 7.09 0 0 0 7.397 0 7.09 7.09 0 0 0 .31 7.088a7.09 7.09 0 0 0 7.088 7.088z" fill-opacity=".2"/><path d="M6.504 10.122c-.135 0-.269-.05-.376-.156-.099-.1-.154-.235-.154-.376s.055-.276.154-.376l2.126-2.126-2.126-2.126c-.099-.1-.154-.235-.154-.376s.055-.276.154-.376c.206-.206.546-.206.751 0l2.502 2.502c.206.206.206.546 0 .751L6.88 9.966c-.106.106-.241.156-.376.156z"/></svg>`,
			)
			globalAppend(listItemTitleWrapper, title)

			globalAppend(listItem, listItemTitleWrapper)
			itemsObj.push(listItem)
		})
		globalAppend($('#lists'), itemsObj)
	},

	searchList(e) {
		const search = e.target.value.toLowerCase()
		globalQuerySelectorAll(document, '.listItem').forEach(item => {
			if (item.querySelector('.title').innerText.toLowerCase().includes(search)) {
				globalClassListRemove(item, 'hide')
			} else {
				globalClassListAdd(item, 'hide')
			}
		})
	},

	resetClientWidgetSize() {
		globalPostMessage(
			parent,
			{ action: 'resetWidgetSize', height: this.widgetWrapper.offsetHeight, width: this.widgetWrapper.offsetWidth },
			`${this.clientDomain}`,
		)
	},
}

export {
	$,
	createElm,
	globalAppend,
	globalEventListener,
	globalSetProperty,
	globalPostMessage,
	globalInnerHTML,
	globalInnerText,
	globalSetAttribute,
	globalClassListAdd,
	globalClassListRemove,
	globalQuerySelectorAll,
	globalClassListContains,
	globalClassListToggle,
}
export const wp_search = {
	renderWPSearch(config) {
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
	},

	async searchPostPage(value, page = 1) {
		const { data, pagination } = await this.fetchWPSearchData(value, page)

		this.renderWPSearchItem(data)
		if (pagination?.has_next || pagination?.has_previous) {
			this.renderWPSearchPagination(pagination)
		}

		this.resetClientWidgetSize()
	},

	async fetchWPSearchData(value, page) {
		const { data } = await fetch(`${this.apiEndPoint}/wpSearch`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ search: value, page }),
		}).then(res => res.json())

		return data
	},

	renderWPSearchItem(items) {
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
	},

	renderWPSearchPagination(pagination) {
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
	},
}
import leftArrow from '../icons/left-circle-arrow.js'

export const woocommerce = {
	renderWooCommerce(widgetChannel) {
		const widgetThis = this

		widgetThis.hideChannels()
		widgetThis.renderCard()
		widgetThis.setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		widgetThis.formBody = createElm('form', { id: 'formBody', method: 'POST' })
		const dynamicFieldsDiv = createElm('div', { id: 'dynamicFields' })
		const hiddenInput = createElm('input', {
			type: 'hidden',
			name: 'widget_channel_id',
			value: widgetChannel.id,
		})
		const submitButton = createElm('button', { type: 'submit' })
		globalInnerText(submitButton, cardConfig?.submit_button_text)

		globalAppend(widgetThis.formBody, [dynamicFieldsDiv, hiddenInput, submitButton])

		globalInnerHTML(widgetThis.cardBody, '')
		globalAppend(widgetThis.cardBody, widgetThis.formBody)

		globalEventListener(widgetThis.formBody, 'submit', e => woocommerce.formSubmitted(widgetThis, e, widgetChannel))
		widgetThis.createAllFields(cardConfig?.form_fields)
	},

	createAllFields(fields) {
		const dynamicFields = $('#dynamicFields')

		let flag = false
		fields?.forEach(field => {
			woocommerce.createTextField(field, dynamicFields)
		})
	},

	createTextField(field, dynamicFields) {
		const fieldInput = createElm('input')
		const fieldType = field.field_type
		const newFieldType = fieldType.includes('_') ? fieldType.split('_')[1] : fieldType

		globalSetAttribute(fieldInput, 'name', `${newFieldType}`)

		globalSetAttribute(fieldInput, 'placeholder', field.label + (field.required ? '' : ' (optional)'))
		if (field.required) {
			globalSetAttribute(fieldInput, 'required', '')
		}

		globalClassListAdd(fieldInput, 'formControl')
		globalSetAttribute(fieldInput, 'type', fieldType)
		globalAppend(dynamicFields, fieldInput)
	},

	async formSubmitted(widgetThis, e, widgetChannel) {
		e.preventDefault()

		const submitBtn = e.target.querySelector('[type="submit"]')
		const oldText = submitBtn.innerText
		const formData = new FormData(e.target)

		try {
			globalInnerText(submitBtn, 'Sending...')
			globalClassListAdd(submitBtn, 'disabled')

			const responseData = await fetch(`${widgetThis.apiEndPoint}/responses`, {
				method: 'POST',
				body: formData,
			}).then(res => res.json())

			if (responseData?.status === 'success') {
				this.formSubmittedData(widgetThis, formData, widgetChannel)
			} else {
				await woocommerce.showToast(widgetThis, 'error', responseData?.data, widgetChannel)
			}

			e.target.reset()
			globalQuerySelectorAll(e.target, '.cfit-title').forEach(title => {
				globalInnerText(title, 'No file chosen')
			})
			globalClassListRemove(submitBtn, 'disabled')
			globalInnerText(submitBtn, oldText)
		} catch (err) {
			console.log(err)
			await woocommerce.showToast(widgetThis, 'error')

			globalClassListRemove(submitBtn, 'disabled')
			globalInnerText(submitBtn, oldText)
		}
	},

	async formSubmittedData(widgetThis, formData, widgetChannel, page = 1) {
		formData.set('page', page)
		const orderDetails = await fetch(`${widgetThis.apiEndPoint}/orderDetails`, {
			method: 'POST',
			body: formData,
		}).then(res => res.json())

		if (orderDetails.status === 'success') {
			await woocommerce.showToast(widgetThis, 'success', orderDetails?.data, widgetChannel, formData)
		}
	},

	async showToast(widgetThis, type, data, widgetChannel, formData) {
		if (data?.status_code === 200) {
			this.orderDetailsItems(widgetThis, data, widgetChannel)

			if (data?.pagination?.has_next || data?.pagination?.has_previous) {
				this.renderOrderDetailsPagination(widgetThis, data?.pagination, formData, widgetChannel)
			}
			return
		}

		const toast = createElm('div', { class: `toast ${type}` })
		const toastContent = createElm('div', { class: 'toast-content' })
		const toastText = createElm('div', { class: 'toast-text' })

		const toastTextTitle = createElm('div', { class: 'toast-text-title' })
		toastTextTitle.innerText = type === 'success' ? '404' : 'Error'

		const toastTextBody = createElm('div', { class: 'toast-text-body' })
		toastTextBody.innerText = type === 'success' ? data?.message : 'Something went wrong'

		globalAppend(toastText, [toastTextTitle, toastTextBody])
		globalAppend(toastContent, toastText)
		globalAppend(toast, toastContent)

		globalAppend(widgetThis.cardBody, toast)
		globalClassListAdd(widgetThis.formBody, 'hide')

		if (globalClassListContains(toast, 'success')) {
			toastTextTitle.style.color = widgetThis.selectedFormBg
		}

		await widgetThis.delay(2)
		if (!globalClassListContains(widgetThis.formBody, 'hide')) return

		widgetThis.cardBody.removeChild(toast)
		globalClassListRemove(widgetThis.formBody, 'hide')
	},

	orderDetailsItems(widgetThis, data, widgetChannel) {
		const orderDetailsBody = createElm('div', { id: 'orderDetailsBody' })
		const listWrapper = createElm('div', { id: 'listWrapper' })
		const lists = createElm('div', { id: 'lists' })

		globalAppend(listWrapper, lists)

		const orderDetailsDescription = createElm('div', { id: 'orderDetailsDescription' })
		const descriptionTitle = createElm('div', { class: 'descriptionTitle' })
		const closeDescBtn = createElm('button', { class: 'iconBtn closeDescBtn', title: 'Back' })
		globalInnerHTML(closeDescBtn, leftArrow)
		const pElm = createElm('p')
		globalAppend(descriptionTitle, [closeDescBtn, pElm])

		const content = createElm('div', { class: 'content' })
		globalAppend(orderDetailsDescription, [descriptionTitle, content])
		globalAppend(orderDetailsBody, [listWrapper, orderDetailsDescription])

		globalInnerHTML(widgetThis.cardBody, '')
		globalAppend(widgetThis.cardBody, orderDetailsBody)

		const orderDetails = widgetChannel?.config?.order_details
		if (data.items.length === 1) {
			woocommerce.singleItemContentShow(widgetThis, orderDetails, data)
			return
		}

		globalEventListener(closeDescBtn, 'click', e => woocommerce.orderDetailsDescToggle(widgetThis, e))
		woocommerce.renderWooCommerceItem(widgetThis, data, orderDetails)
	},

	singleItemContentShow(widgetThis, orderDetails, data) {
		const item = data.items[0]

		const orderDetailsBody = $('#orderDetailsBody')
		orderDetailsBody.removeChild($('#listWrapper'))
		orderDetailsBody.removeChild($('#orderDetailsDescription'))

		const singleItemContent = createElm('div', { id: 'singleItemContent' })

		const itemTitle = createElm('p', { class: 'descriptionTitle title' })
		globalInnerHTML(itemTitle, item.order_id ? 'Order Id: ' + item.order_id + ` (${item.shipping_status})` : '')
		const itemContent = createElm('div', { class: 'content' })
		globalAppend(singleItemContent, [itemTitle, itemContent])
		globalAppend(orderDetailsBody, singleItemContent)

		woocommerce.showContent(orderDetails, item)
		widgetThis.resetClientWidgetSize()
	},

	renderWooCommerceItem(widgetThis, data, orderDetails) {
		widgetThis.itemListAppend(data.items)
		globalQuerySelectorAll(document, '.listItemTitleWrapper').forEach(item => {
			globalEventListener(item, 'click', e => {
				woocommerce.orderDetailsDescToggle(widgetThis, e, data, orderDetails)
			})
		})
		widgetThis.resetClientWidgetSize()
	},

	orderDetailsDescToggle(widgetThis, e, data, orderDetails) {
		if (data) {
			const item = data.items.find(
				item => Number(item.order_id) === Number(e.target.closest('.listItemTitleWrapper').dataset.item_id),
			)
			globalInnerHTML($('.descriptionTitle p'), 'Order Id: ' + item?.order_id || '')
			woocommerce.showContent(orderDetails, item)
		}

		const orderDetailsBody = $('#orderDetailsBody')
		const isOpen = globalClassListToggle($('#orderDetailsBody'), 'openDesc')
		if (isOpen) {
			const descHeight = $('#orderDetailsDescription').scrollHeight
			Object.assign(orderDetailsBody.style, {
				height: descHeight > 400 ? '400px' : `${descHeight}px`,
				overflow: descHeight > 400 ? 'auto' : 'initial',
			})
		} else {
			orderDetailsBody.removeAttribute('style')
		}

		globalClassListToggle($('#listWrapper'), 'hide')
		widgetThis.resetClientWidgetSize()
	},

	showContent(orderDetails, item) {
		let content = ''

		orderDetails?.filter(Boolean).forEach(key => {
			const formattedKey = key
				.split('_')
				.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
				.join(' ')

			let formattedValue = item[key]
			if (typeof formattedValue === 'string') {
				formattedValue = formattedValue
					.split('-')
					.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
					.join(' ')
			}

			content += `${formattedKey}: ${formattedValue}<br>`
		})

		globalInnerHTML($('.content'), content)

		$('.content').style.fontSize = '1rem'
		$('.content').style.lineHeight = '2'
	},

	renderOrderDetailsPagination(widgetThis, pagination, formData, widgetChannel) {
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

		globalEventListener(nextPage, 'click', () =>
			this.formSubmittedData(widgetThis, formData, widgetChannel, pagination?.next),
		)
		globalEventListener(prevPage, 'click', () =>
			this.formSubmittedData(widgetThis, formData, widgetChannel, pagination?.previous),
		)

		globalAppend(paginationWrap, [prevPage, nextPage, pageNumber])
		globalAppend($('#lists'), paginationWrap)

		widgetThis.resetClientWidgetSize()
	},
}
