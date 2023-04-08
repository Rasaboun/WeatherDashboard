

export const NavBar = () => {

	return (
		<nav className="flex justify-center items-center text-sky-700 font-bold text-xl my-4">
			<div className="backdrop-blur-md bg-white/50 flex flex-row p-2 rounded-xl drop-shadow-xl w-fit">
			<a href="rasaboun.me">
				Rasaboun
			</a>
			<div className="ml-6 flex flex-row space-x-3 md:space-x-8 ">
			<span>
				PortFolio
			</span>
			<span>
				Blog
			</span>
			<span>
				GitHub
			</span>
			</div>
			</div>
		</nav>
	)
}