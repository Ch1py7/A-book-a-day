import { BookOfTheDay } from './components/BookOfTheDay'

export const App: React.FC = (): React.ReactNode => {
	return (
		<div className='min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-violet-50 via-indigo-50 to-purple-50 relative overflow-hidden'>
			<div className='absolute inset-0 w-full h-full overflow-hidden z-0'>
				<div className='absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.3)_0%,rgba(255,255,255,0)_60%)]' />
				<div className='absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_80%,rgba(147,197,253,0.3)_0%,rgba(255,255,255,0)_60%)]' />
			</div>
			<BookOfTheDay />
		</div>
	)
}
