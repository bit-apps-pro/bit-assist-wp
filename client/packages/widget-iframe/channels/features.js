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
import rightArrow from '../icons/right-circle-arrow.js'
import closeIcon from '../icons/close-icon.js'

export const knowledge_base = {
	renderKnowledgeBase(widgetChannel) {
		const widgetThis = this

		widgetThis.hideChannels()
		widgetThis.renderCard()
		widgetThis.setCardStyle(widgetChannel.config)
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
		// const prevKbImg = createElm('img', { src: leftArrow, alt: 'prev' })
		globalInnerHTML(prevKBBtn, leftArrow)

		const nextKBBtn = createElm('button', { class: 'iconBtn rounded nextKB', title: 'Next' })
		// const nextKbImg = createElm('img', { src: rightArrow, alt: 'next' })
		globalInnerHTML(nextKBBtn, rightArrow)

		const closeKBBtn = createElm('button', { class: 'iconBtn rounded closeKB', title: 'Close' })
		// const closeKbImg = createElm('img', { src: closeIcon, alt: 'close' })
		globalInnerHTML(closeKBBtn, closeIcon)

		globalAppend(modalActions, [prevKBBtn, nextKBBtn, closeKBBtn])
		globalAppend(descriptionTitle, [p, modalActions])

		const content = createElm('div', { class: 'content' })
		globalAppend(knowledgeBaseDescription, [descriptionTitle, content])
		globalAppend(knowledgeBaseBody, [listWrapper, overlay, knowledgeBaseDescription])

		globalInnerHTML(widgetThis.cardBody, '')
		globalAppend(widgetThis.cardBody, knowledgeBaseBody)

		globalEventListener(listSearch, 'input', widgetThis.searchList)
		globalEventListener(closeKBBtn, 'click', () => knowledge_base.knowledgeBaseDescToggle(widgetThis))
		globalEventListener(prevKBBtn, 'click', () => widgetThis.gotoPrevNextKB('previousElementSibling'))
		globalEventListener(nextKBBtn, 'click', () => widgetThis.gotoPrevNextKB('nextElementSibling'))

		widgetThis.renderKnowledgeBaseItem(widgetThis, cardConfig?.knowledge_bases)
	},

	renderKnowledgeBaseItem(widgetThis, items) {
		widgetThis.itemListAppend(items)
		globalQuerySelectorAll(document, '.listItemTitleWrapper').forEach(item => {
			globalEventListener(item, 'click', e => knowledge_base.knowledgeBaseDescToggle(widgetThis, e, items))
		})
	},

	gotoPrevNextKB(indicator) {
		const item = $('.listItem.active')[indicator]
		if (item) {
			item.querySelector('.listItemTitleWrapper').click()
		}
	},

	knowledgeBaseDescToggle(widgetThis, e, knowledgeBases) {
		globalClassListRemove($('.listItem.active'), 'active')

		const knowledgeBaseBody = $('#knowledgeBaseBody')
		if (!knowledgeBases) {
			globalClassListRemove(knowledgeBaseBody, 'openDesc')
			globalSetProperty(widgetThis.root.style, '--card-width', '330px')
			widgetThis.resetClientWidgetSize()
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

		globalSetProperty(widgetThis.root.style, '--modal-title-height', $('.descriptionTitle').offsetHeight + 'px')
		globalSetProperty(widgetThis.root.style, '--card-width', '767px')
		widgetThis.resetClientWidgetSize()
	},
}
