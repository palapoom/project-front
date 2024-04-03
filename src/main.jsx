import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
// import Root from "./routes/root";
import ErrorPage from './error-page'
import Register from './routes/register'
import ChangePassword from './routes/change-password'
import Home from './routes/home'
import JoinATeam from './routes/join-a-team'
import CreateATeam from './routes/create-a-team'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    // children: [
    //   {
    //     path: "contacts/:contactId",
    //     element: <Contact />,
    //   },
    // ],
  },
  // {
  //   path: "contacts/:contactId",
  //   element: <Contact />,
  // },
  {
    path: 'register',
    element: <Register />,
  },
  {
    path: 'change-password',
    element: <ChangePassword />,
  },
  {
    path: 'home',
    element: <Home />,
  },
  {
    path: 'join-a-team',
    element: <JoinATeam />,
  },
  {
    path: 'create-a-team',
    element: <CreateATeam />,
  },
])

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
