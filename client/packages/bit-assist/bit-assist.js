const apiEndPoint = window?.bit_assist_?.api?.base || 'http://bit-assist-wp.test/wp-json/bit-assist/v1'
const iframeHost = window?.bit_assist_?.api?.base ? `${bit_assist_.api.base}/iframe` : 'http://localhost:5000'
const iframeDomain = new URL(iframeHost).origin
const separator = window?.bit_assist_?.api?.separator || '?'

const domain = window.location.origin
const url = window.location.href
const winWidth = document.documentElement.offsetWidth
const winHeight = window.innerHeight
let defaultHeight = '100px'
let defaultWidth = '100px'
let currentScrollPercent = 0

const css = `
#bit-assist-widget-container{--ba-top:auto;--ba-left:auto;--ba-bottom:10;--ba-right:10;position:fixed;z-index:9999999;bottom:0;right:0;width:${defaultWidth};height:${defaultHeight};max-width:100%}
#bit-assist-widget-container.bottom-right{left:var(--ba-left);right:var(--ba-right);top:var(--ba-top);bottom:var(--ba-bottom)}
#bit-assist-widget-container.bottom-left{left:var(--ba-left);right:var(--ba-right);top:var(--ba-top);bottom:var(--ba-bottom)}
#bit-assist-widget-container.top-right{left:var(--ba-left);right:var(--ba-right);top:var(--ba-top);bottom:var(--ba-bottom)}
#bit-assist-widget-container.top-left{left:var(--ba-left);right:var(--ba-right);top:var(--ba-top);bottom:var(--ba-bottom)}
#bit-assist-widget-iframe{width:100%;height:100%;border:none;position:absolute}
.bit-assist-hide{visibility:hidden;pointer-events:none}
`

const styleElement = document.createElement('style')
styleElement.appendChild(document.createTextNode(css))

const widgetContainer = document.createElement('div')
widgetContainer.id = 'bit-assist-widget-container'
widgetContainer.classList.add('bit-assist-hide')

const iframeElement = document.createElement('iframe')
iframeElement.src = `${iframeHost}${separator}clientDomain=${domain}`
iframeElement.id = 'bit-assist-widget-iframe'
iframeElement.setAttribute('allowfullscreen', '')
iframeElement.setAttribute('scrolling', 'no')
widgetContainer.appendChild(iframeElement)

document.body.append(styleElement, widgetContainer)

// Pass scroll percent to iframe
function windowScrollPercentage(e, pageScroll = false) {
	const scrollTop = window.scrollY
	const docHeight = document.body.offsetHeight
	const winHeight = window.innerHeight
	const scrollPercent = Math.round((scrollTop / (docHeight - winHeight)) * 100)
	if (!pageScroll) {
		return scrollPercent
	}

	if (!currentScrollPercent && scrollPercent >= pageScroll) {
		currentScrollPercent = 1
		sendScrollPercent(scrollPercent)
	} else if (currentScrollPercent && scrollPercent < pageScroll) {
		currentScrollPercent = 0
		sendScrollPercent(scrollPercent)
	}
}

function sendScrollPercent(scrollPercent) {
	iframeElement.contentWindow.postMessage({ action: 'scrollPercent', scrollPercent }, iframeDomain)
}

document.addEventListener('click', e => {
	if (widgetContainer.classList.contains('bit-assist-open') && !e.target.closest('#bit-assist-widget-container')) {
		iframeElement.contentWindow.postMessage({ action: 'clickOutside' }, iframeDomain)
	}
})

// Listen for messages from iframe
window.addEventListener('message', e => {
	if (e.origin !== iframeDomain) return

	const { action } = e.data
	if (action === 'getClientInfo') {
		const scrollPercent = windowScrollPercentage()
		iframeElement.contentWindow.postMessage(
			{ action: 'windowLoaded', url, winWidth, winHeight, scrollPercent, apiEndPoint },
			iframeDomain,
		)
	} else if (action === 'widgetLoaded') {
		const { height, width, position, top, bottom, left, right, pageScroll } = e.data

		widgetPosition(position, top, bottom, left, right)
		widgetContainer.classList.remove('bit-assist-hide')
		widgetContainer.classList.add(position)
		resetWidgetSize(width, height)
		if (pageScroll > 0) {
			window.addEventListener('scroll', e => windowScrollPercentage(e, pageScroll))
		}
	} else if (action === 'widgetOpen') {
		const { isWidgetOpen } = e.data
		widgetContainer.classList.toggle('bit-assist-open', isWidgetOpen)
	} else if (action === 'removeWidget') {
		widgetContainer.remove()
		styleElement.remove()
	} else if (action === 'resetWidgetSize') {
		const { height, width } = e.data
		resetWidgetSize(width, height)
	} else if (action === 'chatWidgetClick') {
		const { chatWidgetName } = e.data
		openChatWidget(chatWidgetName)
	}
})

function widgetPosition(position, top, bottom, left, right) {
	if (position.indexOf('top') > -1) {
		widgetContainer.style.setProperty('--ba-top', top + 'px')
	}
	if (position.indexOf('bottom') > -1) {
		widgetContainer.style.setProperty('--ba-bottom', bottom + 'px')
	}
	if (position.indexOf('left') > -1) {
		widgetContainer.style.setProperty('--ba-left', left + 'px')
	}
	if (position.indexOf('right') > -1) {
		widgetContainer.style.setProperty('--ba-right', right + 'px')
	}
}

function resetWidgetSize(width, height) {
	defaultWidth = width + 'px'
	defaultHeight = height + 'px'
	Object.assign(widgetContainer.style, {
		width: defaultWidth,
		height: defaultHeight,
	})
}

function openChatWidget(chatWidgetName) {
	if (chatWidgetName === 'tawk') {
		openTawkTo()
	}
}

function isLoadedTawkTo() {
	return typeof Tawk_API !== 'undefined'
}

function openTawkTo() {
	if (!isLoadedTawkTo()) return alert('Sorry, Tawk not loaded yet.'), null
	try {
		Tawk_API = Tawk_API || {}
		Tawk_API.showWidget()
		Tawk_API.toggle()
		widgetContainer.classList.add('bit-assist-hide')
	} catch (e) {
		alert('Sorry, Tawk not loaded yet.')
		widgetContainer.classList.remove('bit-assist-hide')
	}
}

window.addEventListener('load', () => {
	hideTawkTo()
})

function hideTawkTo() {
	if (!isLoadedTawkTo()) return false
	Tawk_API = Tawk_API || {}
	Tawk_API.onLoad = function () {
		Tawk_API.hideWidget()
	}
	Tawk_API.onChatStarted = function () {
		Tawk_API.showWidget()
		widgetContainer.classList.add('bit-assist-hide')
	}
	Tawk_API.onChatMessageAgent = function () {
		Tawk_API.showWidget()
		widgetContainer.classList.add('bit-assist-hide')
	}
	Tawk_API.onChatMessageSystem = function () {
		Tawk_API.showWidget()
		widgetContainer.classList.add('bit-assist-hide')
	}
	Tawk_API.onChatEnded = function () {
		Tawk_API.hideWidget()
		widgetContainer.classList.remove('bit-assist-hide')
	}
	Tawk_API.onChatMinimized = function () {
		Tawk_API.hideWidget()
		widgetContainer.classList.remove('bit-assist-hide')
	}
	Tawk_API.onStatusChange = function () {
		Tawk_API.hideWidget()
	}
}
