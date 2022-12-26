export const $ = s => document.querySelector(s)

export const createElm = (elm, attributes) => {
	const domElm = document.createElement(elm)

	for (const attribute in attributes) {
		domElm.setAttribute(attribute, attributes[attribute])
	}
	return domElm
}

export const globalAppend = (elm, child) => {
	Array.isArray(child) ? elm.append(...child) : elm.append(child)
}

export const globalEventListener = (selector, type, callback) => {
	selector.addEventListener(type, callback)
}

export const globalSetProperty = (selector, propName, value) => {
	selector.setProperty(propName, value)
}

export const globalPostMessage = (parent, message, clientDomain) => {
	parent.postMessage(message, clientDomain)
}

export const globalQuerySelectorAll = (documentTarget, selectedClass) => {
	return documentTarget.querySelectorAll(selectedClass)
}

export const globalClassListRemove = (selector, action) => {
	return selector?.classList.remove(action)
}

export const globalClassListAdd = (selector, action) => {
	return selector?.classList.add(action)
}

export const globalClassListContains = (selector, action) => {
	return selector?.classList.contains(action)
}

export const globalClassListToggle = (selector, action) => {
	return selector?.classList.toggle(action)
}

export const globalSetAttribute = (domElm, attribute, value) => {
	domElm.setAttribute(attribute, value)
}
