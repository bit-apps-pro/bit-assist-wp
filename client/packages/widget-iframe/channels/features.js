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
	wp_post_types: undefined,
	renderWPSearch(config) {
		this.hideChannels()
		this.renderCard()
		this.setCardStyle(config)

		wp_search.wp_post_types = config?.wp_post_types

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
			body: JSON.stringify({ search: value, page, postTypes: wp_search.wp_post_types }),
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

export const custom_form = {
	renderForm(widgetChannel) {
		const widgetThis = this

		widgetThis.hideChannels()
		widgetThis.renderCard()
		widgetThis.setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		// Render form
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

		globalEventListener(widgetThis.formBody, 'submit', e => custom_form.formSubmitted(widgetThis, e))
		custom_form.createAllFields(cardConfig?.form_fields)
	},

	createAllFields(fields) {
		const dynamicFields = $('#dynamicFields')

		let flag = false
		fields?.forEach(field => {
			if (field.field_type === 'file' && !flag) {
				globalSetAttribute($('#formBody'), 'enctype', 'multipart/form-data')
				flag = true
			}

			if (field.field_type === 'rating') {
				custom_form.createRatingField(field, dynamicFields, 'rating')
			} else if (field.field_type === 'feedback') {
				custom_form.createRatingField(field, dynamicFields, 'feedback')
			} else {
				custom_form.createTextField(field, dynamicFields)
			}
		})
	},

	createRatingField(field, dynamicFields, filedType) {
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
	},

	createTextField(field, dynamicFields) {
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
			custom_form.gdprField(field, dynamicFields, fieldInput)
			return
		}

		globalClassListAdd(fieldInput, 'formControl')
		globalSetAttribute(fieldInput, 'type', field.field_type)

		if (field.field_type === 'file') {
			custom_form.fileField(field, dynamicFields, fieldInput)
			return
		}
		globalAppend(dynamicFields, fieldInput)
	},

	fileField(field, dynamicFields, fieldInput) {
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
	},

	gdprField(field, dynamicFields, fieldInput) {
		globalSetAttribute(fieldInput, 'type', 'checkbox')

		const link = createElm('a', { target: '_blank' })
		globalInnerHTML(link, field.label)
		if (field?.url) {
			link.href = field.url
		}

		const gdprContainer = createElm('div', { class: 'gdprContainer' })
		globalAppend(gdprContainer, [fieldInput, link])
		globalAppend(dynamicFields, gdprContainer)
	},

	async formSubmitted(widgetThis, e) {
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
				await custom_form.showToast(widgetThis, 'success', responseData?.data)
			} else {
				await custom_form.showToast(widgetThis, 'error', responseData?.data)
			}

			e.target.reset()
			globalQuerySelectorAll(e.target, '.cfit-title').forEach(title => {
				globalInnerText(title, 'No file chosen')
			})
			globalClassListRemove(submitBtn, 'disabled')
			globalInnerText(submitBtn, oldText)
		} catch (err) {
			console.log(err)
			await custom_form.showToast(widgetThis, 'error')
			e.target.reset()
			globalQuerySelectorAll(e.target, '.cfit-title').forEach(title => {
				globalInnerText(title, 'No file chosen')
			})
			globalClassListRemove(submitBtn, 'disabled')
			globalInnerText(submitBtn, oldText)
		}
	},

	async showToast(widgetThis, type, message) {
		if (!widgetThis.cardBody.contains(widgetThis.formBody)) {
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
}
