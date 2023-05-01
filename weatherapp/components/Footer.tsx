export const Footer = () => {
  return (
    <footer className="flex flex-col justify-center items-center bg-transparent border-t-0 border-sky-50 mx-4 mb-2">
      <div className="flex flex-col space-y-8 lg:py-8">
        <div className="md:flex md:justify-between">
          <div className="grid gap-y-10 gap-x-12 sm:gap-x-24 grid-cols-3 ">
            <div>
              <h2 className="mb-6 text-sm font-semibold text-sky-50 uppercase">
                SiteMap
              </h2>
              <ul className="text-sky-100 font-medium flex flex-col space-y-4">
                <li className="">
                  <a className="hover:underline" href="https://www.rasaboun.me">
                    Rasaboun
                  </a>
                </li>
                <li>
                  <a className="hover:underline" href="www.rasaboun.me/Blog">Blog</a>
                </li>
                <li>
                  <a className="hover:underline" href="https://www.rasaboun.me/Portfolio">Portfolio</a>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-sky-50 uppercase">
                Follow Me
              </h2>
              <ul className="text-sky-100 font-medium flex flex-col space-y-4">
                <li className="">
                  <a
                    href="https://github.com/Rasaboun"
                    className="hover:underline "
                  >
                    Github
                  </a>
                </li>
                <li>
                  <span className="hover:underline">Twitter</span>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-6 text-sm font-semibold text-sky-50 uppercase">
                Legal
              </h2>
              <ul className="text-sky-100 font-medium flex flex-col space-y-4">
                <li className="">
                  <a href="#" className="hover:underline">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:underline">
                    Terms &amp; Conditions
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="sm:flex sm:items-center sm:justify-between">
          <span className="text-base text-sky-50 sm:text-center ">
            © 2023 Rasaboun . All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
};
