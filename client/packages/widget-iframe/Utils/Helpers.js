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

export const globalEventListener = (elm, type, fn) => {
	elm.addEventListener(type, fn)
}
