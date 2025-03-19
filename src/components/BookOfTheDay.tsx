import { getDate, getWord, setBookIndex, setDate, setWord } from '@/utils/localStorage'
import axios from 'axios'
import { Book, BookOpen, Calendar, ExternalLink } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { words } from '../lib/words'

const googleUrl = (word: string) => `https://www.googleapis.com/books/v1/volumes
?q=intitle:${word}
&filter=full
&maxResults=40
&orderBy=relevance
&printType=books
&projection=full`

const today = new Date().toLocaleDateString()

const randomWord = () => {
	const randomWord = words[Math.ceil(Math.random() * (words.length - 1))]
	return randomWord
}

export const BookOfTheDay: React.FC = (): React.ReactNode => {
	const [book, setBook] = useState<Book | null>(null)
	const [books, setBooks] = useState<any[] | null>(null)
	const [isLoading, setIsLoading] = useState<boolean>(true)
	const [bookToGet, setBookToGet] = useState<number>(0)

	const getBooks = useCallback(async (word: string, attempt = 0) => {
		const books = await axios.get(googleUrl(word))
		setWord(word)
		if (books.data.totalItems === 0) {
			if (attempt < 4) {
				const anotherWord = randomWord()
				getBooks(anotherWord, attempt + 1)
			}
			return
		}
		setBookToGet(books.data.items.length - 1)
		setBooks(books.data.items)
	}, [])

	const getBook = useCallback(() => {
		const book = books![bookToGet]
		setBook(book.volumeInfo)
		setBookIndex(bookToGet.toString())
		setIsLoading(false)
	}, [books, bookToGet])

	useEffect(() => {
		let word = ''
		if (getDate() !== today) setDate(today)
		if (getWord() && getDate() === today) {
			word = getWord()
		} else {
			word = randomWord()
		}
		getBooks(word)
	}, [getBooks])

	useEffect(() => {
		if (books) {
			getBook()
		}
	}, [books, getBook])

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='animate-pulse flex flex-col items-center gap-4'>
					<div className='h-48 w-32 bg-white/50 rounded' />
					<div className='h-4 w-48 bg-white/50 rounded' />
				</div>
			</div>
		)
	}

	if (!book) return null

	return (
		<div className='max-w-4xl w-full mx-auto relative z-10'>
			<div className='backdrop-blur-xl bg-white/20 border border-white/40 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden transition-shadow duration-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)]'>
				<div className='p-6 md:p-10'>
					<div className='flex flex-col md:flex-row gap-8'>
						<div className='relative w-[150px] h-[225px] mx-auto md:mx-0 group'>
							<div className='absolute inset-0 bg-gradient-to-br from-violet-500/20 to-indigo-500/20 rounded-lg transform rotate-[-3deg] scale-[0.97] transition-all duration-300 group-hover:rotate-[-5deg] group-hover:scale-[0.95]' />
							<div className='absolute inset-0 bg-white rounded-lg shadow-lg transform rotate-[3deg] scale-[0.97] transition-all duration-300 group-hover:rotate-[5deg] group-hover:scale-[0.95]' />
							<div className='relative w-[150px] h-[225px] scale-95 rounded-lg overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition-all duration-300 group-hover:shadow-[0_15px_30px_rgba(0,0,0,0.2)]'>
								<div
									title={`Cover of ${book.title}`}
									className='w-full h-full'
									style={{
										backgroundImage: `url('${book.imageLinks?.thumbnail || '/placeholder.svg'}')`,
										backgroundSize: 'cover',
										backgroundPosition: 'center',
									}}
								/>
							</div>
						</div>
						<div className='flex-1 flex flex-col'>
							<h2
								title={book.title}
								className='text-2xl md:text-3xl font-light tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-2 break-words'
							>
								{book.title}
							</h2>
							{book.authors && (
								<div className='mt-2 text-sm text-gray-600 font-light'>
									by{' '}
									<span className='italic'>
										{Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
									</span>
								</div>
							)}
							<div className='flex flex-wrap gap-2 mt-4'>
								{book.categories &&
									book.categories.map((category) => (
										<div
											key={category}
											className='bg-white/30 hover:bg-white/50 backdrop-blur-md text-gray-700 rounded-full px-3 py-0.5 text-xs font-light transition-all duration-300'
										>
											{category}
										</div>
									))}
							</div>
							<div className='mt-6 grid grid-cols-2 gap-x-8 gap-y-3 text-xs text-gray-600'>
								<div className='flex items-center gap-2'>
									<Book className='h-3.5 w-3.5 text-indigo-400' />
									<span className='font-light'>{book.pageCount} pages</span>
								</div>
								<div className='flex items-center gap-2'>
									<Calendar className='h-3.5 w-3.5 text-indigo-400' />
									<span className='font-light'>{book.publishedDate}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span className='font-light'>Publisher: {book.publisher}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span className='font-light'>Language: {book.language.toUpperCase()}</span>
								</div>
								<div className='flex items-center gap-2'>
									<span className='font-light'>
										Maturity: {book.maturityRating.replace('_', ' ')}
									</span>
								</div>
								<div className='flex items-center gap-2'>
									{book.industryIdentifiers &&
										book.industryIdentifiers.map((id) => (
											<div key={id.identifier} className='font-light'>
												<span>
													{id.type.replace('_', '-')}: {id.identifier}
												</span>
											</div>
										))}
								</div>
							</div>
							{book.canonicalVolumeLink && (
								<a
									href={book.canonicalVolumeLink}
									target='_blank'
									rel='noopener noreferrer'
									className='mt-2 text-xs text-indigo-500 font-medium no-underline'
								>
									<span>Canonical volume:</span> Book
								</a>
							)}
						</div>
					</div>
					{book.description && <div className='h-1 my-5 rounded-4xl bg-white/50' />}
					<div className='text-sm text-gray-700 leading-relaxed font-light'>
						<p className='overflow-hidden text-ellipsis whitespace-pre-wrap line-clamp-16 break-words'>
							{book.description}
						</p>
					</div>
					<div className='mt-8 flex justify-end'>
						<a
							href={book.previewLink}
							target='_blank'
							rel='noopener noreferrer'
							className='flex border-1 border-solid border-gray-800/20 justify-between items-center py-2 no-underline backdrop-blur-sm bg-white/30 hover:bg-white/50 text-gray-800 rounded-full px-6 transition-all duration-300 hover:shadow-md group'
						>
							<BookOpen className='h-4 w-4 mr-2 transition-transform duration-300 group-hover:scale-110' />
							Preview
							<ExternalLink className='h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1' />
						</a>
					</div>
				</div>
			</div>
			<div className='text-center mt-6 text-xs text-gray-500 font-light tracking-wide'>
				<div className='inline-block px-4 py-1 backdrop-blur-md bg-white/20 rounded-full border-1 border-gray-800/20 border-solid'>
					Book of the Day •{' '}
					{new Date().toLocaleDateString('en-US', {
						month: 'long',
						day: 'numeric',
						year: 'numeric',
					})}
				</div>
			</div>
		</div>
	)
}
