export const woocommerce = {
	renderWooCommerce(widgetChannel) {
		const widgetThis = this

		widgetThis.hideChannels()
		widgetThis.renderCard()
		widgetThis.setCardStyle(widgetChannel.config)
		const cardConfig = widgetChannel.config?.card_config

		// Render form
		widgetThis.formBody = createElm('form', { id: 'formBody', method: 'POST' })
		const hiddenInput = createElm('input', {
			type: 'hidden',
			name: 'widget_channel_id',
			value: widgetChannel.id,
		})
		const submitButton = createElm('button', { type: 'submit' })
		globalInnerText(submitButton, cardConfig?.submit_button_text)

		globalAppend(widgetThis.formBody, [hiddenInput, submitButton])

		globalInnerHTML(widgetThis.cardBody, '')
		globalAppend(widgetThis.cardBody, widgetThis.formBody)

		globalEventListener(widgetThis.formBody, 'submit', e => woocommerce.formSubmitted(widgetThis, e))
		widgetThis.createAllFields(cardConfig?.form_fields)
	},

	createAllFields(fields) {
		const dynamicFields = $('#dynamicFields')

		let flag = false
		fields?.forEach(field => {
			custom_form.createTextField(field, dynamicFields)
		})
	},

	createTextField(field) {
		const fieldInput = createElm('input')

		globalSetAttribute(
			fieldInput,
			'name',
			`${field.label.toLowerCase().replace(/ /g, '_')}${!!field?.allow_multiple ? '[]' : ''}`,
		)
		globalSetAttribute(fieldInput, 'placeholder', field.label + (field.required ? '' : ' (optional)'))
		if (field.required) {
			globalSetAttribute(fieldInput, 'required', '')
		}

		globalClassListAdd(fieldInput, 'formControl')
		globalSetAttribute(fieldInput, 'type', field.field_type)
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
				await woocommerce.showToast(widgetThis, 'success', responseData?.data)
			} else {
				await woocommerce.showToast(widgetThis, 'error', responseData?.data)
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
