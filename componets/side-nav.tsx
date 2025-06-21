import Link from 'next/link';

const SideNav = () => {
  return (
    <>
      {/* Entire sidebar hidden on small screens, sticky on larger */}
      <div className="hidden sm:block relative my-5 w-full max-w-[20rem] flex-shrink-0 sticky top-0 rounded-xl bg-gray-900 p-4 text-white shadow-xl shadow-black/20">
        {/* Brand */}
        <div className="flex items-center gap-4 p-4 mb-2">
          <img
            src="https://docs.material-tailwind.com/img/logo-ct-dark.png"
            alt="brand"
            className="w-8 h-8"
          />
          <h5 className="text-2xl font-semibold">Sidebar</h5>
        </div>

        <nav className="flex flex-col gap-2 p-2 text-lg">
          <hr className="my-2 border-gray-700" />

          <Link href="/devices" passHref>
            <div
              role="button"
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition"
            >
              <div className="mr-4 grid place-items-center">
                {/* Monitor Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4h18v12H3V4zm0 12l3 3h12l3-3M8 19v1m8-1v1"
                  />
                </svg>
              </div>
              <span className="flex-1">Devices</span>
            </div>
          </Link>

          <Link href="/login" passHref>
            <div
              role="button"
              className="flex items-center w-full p-3 rounded-lg hover:bg-gray-800 cursor-pointer transition"
            >
              <div className="mr-4 grid place-items-center">
                {/* Logout Icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2.25a.75.75 0 01.75.75v9a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM6.166 5.106a.75.75 0 010 1.06 8.25 8.25 0 1011.668 0 .75.75 0 111.06-1.06c3.808 3.807 3.808 9.98 0 13.788-3.807 3.808-9.98 3.808-13.788 0-3.808-3.807-3.808-9.98 0-13.788a.75.75 0 011.06 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="flex-1">Log Out</span>
            </div>
          </Link>
        </nav>
      </div>

    </>
  );
};

export default SideNav;
