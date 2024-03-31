import { useState, useEffect } from "react";
import {
  TextInput,
  Select,
  SelectItem,
  Dialog,
  DialogPanel,
  Button,
  Tab,
  TabGroup,
  TabList,
  Icon,
} from "@tremor/react";
import { RiShapesFill } from "@remixicon/react";
import { Link, useNavigate } from "react-router-dom";

const Header = (props) => {
  const navigate = useNavigate();
  // props
  const handleSignOut = async () => {
    localStorage.removeItem("email");
    localStorage.removeItem("game_id");
    localStorage.removeItem("game_name");
    localStorage.removeItem("nickname");
    localStorage.removeItem("phone_number");
    localStorage.removeItem("role");
    localStorage.removeItem("team_id");
    localStorage.removeItem("team_name");
    localStorage.removeItem("user_name");
    console.log("Logout successful");
    navigate("/");
  };
  return (
    // <div className="max-w-2xl mx-auto">
    //   <nav className="border-gray-200 ">
    //     <div className="container mx-auto flex flex-wrap items-center justify-between">
    //       <Link to="/home" className="flex">
    //         <svg
    //           className="h-10 mr-3"
    //           width="51"
    //           height="70"
    //           viewBox="0 0 51 70"
    //           fill="none"
    //           xmlns="http://www.w3.org/2000/svg"
    //         >
    //           <g clip-path="url(#clip0)">
    //             <path
    //               d="M1 53H27.9022C40.6587 53 51 42.7025 51 30H24.0978C11.3412 30 1 40.2975 1 53Z"
    //               fill="#76A9FA"
    //             ></path>
    //             <path
    //               d="M-0.876544 32.1644L-0.876544 66.411C11.9849 66.411 22.4111 55.9847 22.4111 43.1233L22.4111 8.87674C10.1196 8.98051 0.518714 19.5571 -0.876544 32.1644Z"
    //               fill="#A4CAFE"
    //             ></path>
    //             <path
    //               d="M50 5H23.0978C10.3413 5 0 15.2975 0 28H26.9022C39.6588 28 50 17.7025 50 5Z"
    //               fill="#1C64F2"
    //             ></path>
    //           </g>
    //           <defs>
    //             <clipPath id="clip0">
    //               <rect width="51" height="70" fill="white"></rect>
    //             </clipPath>
    //           </defs>
    //         </svg>
    //         <span className="self-center text-lg font-semibold whitespace-nowrap">
    //           Scrim
    //         </span>
    //       </Link>
    //       <Button variant="light">Team</Button>
    //       <Button variant="light">Search</Button>
    //       <Button variant="light">Search</Button>
    //       <Icon
    //         onClick={() => setIsOpenProfile(!isOpenProfile)}
    //         icon={RiShapesFill}
    //         variant="solid"
    //         tooltip="Profile"
    //         size="md"
    //       />
    //       <div
    //         className={`origin-top-right absolute right-10 mt-24 w-40 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 ${
    //           isOpenProfile ? "block" : "hidden"
    //         }`}
    //         role="menu"
    //         aria-orientation="vertical"
    //         aria-labelledby="options-menu"
    //       >
    //         <div className="py-1" role="none">
    //           <Link
    //             to="/home"
    //             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //             role="menuitem"
    //           >
    //             Your Profile
    //           </Link>
    //           <Link
    //             to="/home"
    //             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //             role="menuitem"
    //           >
    //             Settings
    //           </Link>
    //           <Link
    //             to="/home"
    //             className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
    //             role="menuitem"
    //           >
    //             Sign out
    //           </Link>
    //         </div>
    //       </div>
    //     </div>
    //   </nav>
    // </div>
    <div className="flex h-screen bg-gray-100">
      <div className="hidden md:flex flex-col w-64 bg-gray-800">
        <div className="flex items-center justify-center h-16 bg-gray-900">
          <span className="text-white font-bold uppercase">Scrim</span>
        </div>
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-2 py-4 bg-gray-800">
            <p className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
              {props.nickname}
            </p>
            <Link
              to="/home"
              className="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              Team
            </Link>
            <Link
              to="/home"
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              Settings
            </Link>
            <a
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700 cursor-pointer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Sign Out
            </a>
          </nav>
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex items-center justify-between h-16 bg-white border-b border-gray-200">
          <div className="flex items-center px-4">
            <button className="text-gray-500 focus:outline-none focus:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
          <div className="flex items-center pr-4">
            <button className="flex items-center text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l-7-7 7-7m5 14l7-7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>
        <div className="p-4">
          <h1 className="text-2xl font-bold">Welcome to my dashboard!</h1>
          <p className="mt-2 text-gray-600">
            This is an example dashboard using Tailwind CSS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
