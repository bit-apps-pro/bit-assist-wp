import { $, createElm, globalAppend, globalEventListener, globalInnerHTML, globalInnerText, globalSetAttribute } from '../utils/Helpers.js'
import { __, sprintf } from '../utils/i18n.js'

export const wp_search = {
  wp_post_types: undefined,
  renderWPSearch(config) {
    this.hideChannels()
    this.renderCard()
    this.setCardStyle(config)

    wp_search.wp_post_types = config?.wp_post_types

    const wpSearchBody = createElm('div', { id: 'wpSearchBody' })
    const listWrapper = createElm('div', { id: 'listWrapper' })
    const lists = createElm('div', { 'id': 'lists', 'data-link_open_action': config.open_window_action })
    const listSearch = createElm('input', {
      type: 'text',
      id: 'listSearch',
      class: 'formControl',
      placeholder: __('Search'),
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

  showLoading(showText = true) {
    const lists = $('#lists')
    if (lists) {
      const loadingDiv = createElm('div', { class: 'loading-container' })
      const loadingIcon = createElm('div', { class: 'loading-spinner' })

      if (showText) {
        const loadingText = createElm('p', { class: 'loading-text' })
        globalInnerText(loadingText, __('Searching...'))
        globalAppend(loadingDiv, [loadingIcon, loadingText])
      }
      else {
        globalAppend(loadingDiv, loadingIcon)
      }

      globalInnerHTML(lists, '')
      globalAppend(lists, loadingDiv)
    }
  },

  hideLoading() {
    const loadingContainer = $('.loading-container')
    if (loadingContainer) {
      loadingContainer.remove()
    }
  },

  async searchPostPage(value, page = 1, isPaginating = false) {
    this.showLoading(!isPaginating)
    this.resetClientWidgetSize()

    try {
      const { data, pagination } = await this.fetchWPSearchData(value, page)

      this.renderWPSearchItem(data)
      if (pagination?.has_next || pagination?.has_previous) {
        this.renderWPSearchPagination(pagination)
      }
    }
    catch (error) {
      console.error('Search error:', error)
      const lists = $('#lists')
      if (lists) {
        globalInnerHTML(lists, `<div class="error-message">${__('Failed to load search results. Please try again.')}</div>`)
      }
    }
    finally {
      this.hideLoading()
      this.resetClientWidgetSize()
    }
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

    if (!items || items.length === 0) {
      const noResults = createElm('div', { class: 'no-results' })
      globalInnerText(noResults, __('No results found'))
      globalAppend(lists, noResults)
      return
    }

    items?.forEach((item) => {
      const listItem = createElm('div', { class: 'listItem' })
      const listItemTitleWrapper = createElm('button', { class: 'listItemTitleWrapper', title: item.post_link })
      const title = createElm('p', { class: 'title' })
      const type = createElm('p', { class: 'type' })

      globalAppend(listItem, listItemTitleWrapper)
      globalAppend(listItemTitleWrapper, [title, type])
      globalInnerText(title, item?.post_title || __('(no title)'))
      globalInnerText(type, item?.post_type || '')
      itemsObj.push(listItem)

      globalEventListener(listItemTitleWrapper, 'click', () => {
        const { link_open_action } = lists.dataset
        if (link_open_action === 'new_window') {
          window.open(item.post_link, '_blank', 'popup')
        }
        else {
          window.open(item.post_link, link_open_action)
        }
      })
    })

    globalAppend(lists, itemsObj)
  },

  renderWPSearchPagination(pagination) {
    const paginationWrap = createElm('div', { class: 'pagination' })

    const pageNumber = createElm('span', { class: 'pageNumber' })
    globalInnerText(
      pageNumber,
      sprintf(
        // translators: 1: Current page number, 2: Total pages
        __('%1$s / %2$s page'),
        pagination?.current ?? '',
        pagination?.total ?? '',
      ),
    )

    const nextPage = createElm('button', { class: 'nextPage' })
    globalInnerText(nextPage, __('Next'))
    if (!pagination?.has_next) {
      globalSetAttribute(nextPage, 'disabled', '')
    }
    const prevPage = createElm('button', { class: 'prevPage' })
    globalInnerText(prevPage, __('Prev'))
    if (!pagination?.has_previous) {
      globalSetAttribute(prevPage, 'disabled', '')
    }

    const searchValue = $('#listSearch')?.value || ''
    globalEventListener(nextPage, 'click', () => this.searchPostPage(searchValue, pagination?.next, true))
    globalEventListener(prevPage, 'click', () => this.searchPostPage(searchValue, pagination?.previous, true))

    globalAppend(paginationWrap, [prevPage, nextPage, pageNumber])
    globalAppend($('#lists'), paginationWrap)
  },
}
