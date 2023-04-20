

export const NavBar = () => {

	return (
		<nav className="fixed inset-x-0 top-0 flex justify-center items-center text-sky-700 font-bold text-xl my-4">
			<div className="backdrop-blur-md bg-white/50 flex flex-row p-2 rounded-3xl shadow-2xl shadow-sky-950/60 text-lg font-semibold w-fit">
			<a href="https://www.rasaboun.me" className="font-semibold">
				Rasaboun
			</a>
			<div className="ml-6 flex flex-row space-x-3 md:space-x-8 ">
			<a href="https://www.rasaboun.me/Portfolio">
				PortFolio
			</a>
			<a href="https://www.rasaboun.me/Blog">
				Blog
			</a>
			<a href="https://github.com/Rasaboun">
				GitHub
			</a>
			</div>
			</div>
		</nav>
	)
}