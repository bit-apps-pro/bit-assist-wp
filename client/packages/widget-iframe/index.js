import Widget from './widget'

const urlObj = new URL(window.location.href)
const clientDomain = urlObj.searchParams.get('clientDomain')

// eslint-disable-next-line no-new
new Widget({
	widgetBubble: '#widgetBubble',
	clientDomain,
})
