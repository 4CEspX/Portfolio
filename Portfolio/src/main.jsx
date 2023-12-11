import React from "react";
import ReactDOM from "react-dom/client";
import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import App from "./App.jsx";
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
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
