

export const NavBar = () => {

	return (
		<nav className="flex flex-row space-x-16 justify-center items-center text-sky-700 font-bold text-xl mt-4">
			<div className="backdrop-blur-md bg-white/30 flex flex-row p-2 rounded-xl">
			<h1>
				Rasaboun
			</h1>
			<div className="flex flex-row space-x-8 ">
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