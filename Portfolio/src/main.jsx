import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
import Project1 from "./Project1";
import Project2 from "./Project2";
import Project3 from "./Project3";
import Project4 from "./Project4";
import "./index.css";

const Wrapper = () => (
  <>
    <Outlet />
  </>
);

const router = createBrowserRouter([
  {
    element: <Wrapper />,
    children: [
      {
        path: "/",
        element: <App />,
      },
      {
        path: "/project1",
        element: <Project1 />,
      },
      {
        path: "/project2",
        element: <Project2 />,
      },
      {
        path: "/project3",
        element: <Project3 />,
      },
      {
        path: "/project4",
        element: <Project4 />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
