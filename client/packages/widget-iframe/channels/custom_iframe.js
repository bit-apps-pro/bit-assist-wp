export const custom_frame = {
	renderIframe(url, channelName, config, iframe = false) {
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

		if(config?.iframe_size?.aspect_ratio === 'custom'){
			globalSetProperty(this.root.style, '--iframe-height', config.iframe_size?.width + 'px')
			globalSetProperty(this.root.style, '--iframe-height', config.iframe_size?.height + 'px')
		}else{
			globalSetProperty(this.root.style, '--iframe-aspect-ration', config.iframe_size?.aspect_ratio)
		}

		globalAppend($('#contentWrapper'), this.iFrameWrapper)
		this.resetClientWidgetSize()
	},

	removeIframe() {
		this.iFrameWrapper.remove()
		this.iFrameWrapper = undefined
		this.resetClientWidgetSize()
	},
}