import closeIcon from '../icons/close-icon.js'

export const call_to_action = {
	async showCallToAction() {
		if (!this.widgetData?.call_to_action?.text) {
			return
		}

		if (this.widgetData?.call_to_action?.delay > 0) {
			await this.delay(this.widgetData.call_to_action.delay)
		}

		this.callToAction = createElm('div', { id: 'callToActionMsg' })
		globalInnerHTML(this.callToAction, this.widgetData.call_to_action.text)

		this.closeCallToAction = createElm('button', { class: 'iconBtn', id: 'closeCallToAction' })
		globalInnerHTML(this.closeCallToAction, closeIcon)
		globalEventListener(this.closeCallToAction, 'click', this.callToActionHide)

		$('#widgetBubbleRow').prepend(this.closeCallToAction, this.callToAction)

		if (globalClassListContains(this.widgetBubble, 'open') || this.widgetData.widget_behavior === 3) {
			this.callToActionHide()
			return
		}

		this.resetClientWidgetSize()
	},
}
