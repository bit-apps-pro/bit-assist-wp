import {
	$,
	createElm,
	globalAppend,
	globalInnerHTML,
	globalEventListener,
	globalClassListAdd,
	globalClassListContains,
	globalClassListRemove,
	globalSetProperty,
	globalPostMessage,
	globalQuerySelectorAll,
} from '../utils/Helpers.js'

const mixinCommon = {
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

export default mixinCommon
