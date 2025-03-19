export const getWord = () => {
	return localStorage.getItem('wordOfTheDay') || ''
}

export const getDate = () => {
	return localStorage.getItem('wordDate') || ''
}

export const getBookToGet = () => {
	return localStorage.getItem('bookToGet')
}

export const setWord = (word: string) => {
	localStorage.setItem('wordOfTheDay', word)
}

export const setDate = (date: string) => {
	localStorage.setItem('wordDate', date)
}

export const setBookIndex = (index: string) => {
	localStorage.setItem('bookToGet', index)
}
