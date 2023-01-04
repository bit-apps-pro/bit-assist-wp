import { globalClassListContains, globalClassListRemove } from '../utils/Helpers.js'

export const mixinCommon = {
	hideChannels() {
		if (globalClassListContains(this.channels, 'show')) {
			globalClassListRemove(this.channels, 'show')
		}
	},
}
