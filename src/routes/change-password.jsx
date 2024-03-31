import { useState } from "react";
import { TextInput } from "@tremor/react";
import { RiArrowRightLine, RiSearch2Line } from "@remixicon/react";
import { Button } from "@tremor/react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  BrowserRouter,
  Route,
  Link,
} from "react-router-dom";

function ChangePassword() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center w-full">
        <div className="bg-white bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-md">
          <h1 className="text-2xl font-bold text-center mb-4 text-gray-950">
            Change Password
          </h1>
          <form action="#">
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email Address
              </label>
              <TextInput type="email" placeholder="your@email.com" />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                New Password
              </label>
              <TextInput
                type="password"
                placeholder="Enter your new password"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirm Password
              </label>
              <TextInput
                type="password"
                placeholder="Enter your confirm password"
              />
            </div>
            <Button className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Update Password
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export default ChangePassword;
