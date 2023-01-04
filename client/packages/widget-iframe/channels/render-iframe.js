import { $, createElm, globalAppend, globalInnerHTML } from '../utils/Helpers.js'

export const mixinIframe = {
	renderIframe(url, channelName, iframe = false) {
		this.hideChannels()
		this.iFrameWrapper = createElm('div', { id: 'iframe-wrapper', class: channelName.toLowerCase() })

		if (iframe) {
			globalInnerHTML(this.iFrameWrapper, iframe)
		} else {
			const iframeElm = createElm('iframe', {
				scrolling: 'no',
				src: url,
				allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
				allowfullscreen: '',
			})
			globalAppend(this.iFrameWrapper, iframeElm)
		}

		globalAppend($('#contentWrapper'), this.iFrameWrapper)
		this.resetClientWidgetSize()
	},
}
