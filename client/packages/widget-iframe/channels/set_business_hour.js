export const set_business_hour = {
	checkBusinessHours() {
		const date = new Date()
		const toDay = this.widgetData?.business_hours[date.getDay()]

		if (!toDay || !toDay?.start || !toDay?.end) {
			this.removeClientWidget()
			return false
		}

		const [startHour, startMinute] = toDay?.start.split(':').map(Number) || [0, 0]
		const [endHour, endMinute] = toDay?.end.split(':').map(Number) || [0, 0]

		// eslint-disable-next-line new-cap
		const timezone = this.widgetData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
		const currentTime = date.toLocaleTimeString('en-US', { timeZone: timezone, hour12: false })
		const [currentHour, currentMinute] = currentTime.split(':').map(Number)

		if (
			currentHour < startHour ||
			(currentHour === startHour && currentMinute < startMinute) ||
			currentHour > endHour ||
			(currentHour === endHour && currentMinute > endMinute)
		) {
			this.#isOfficeHours = false
		}

		return true
	},
}
