
import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Land from "./pages/land";
import Test from "./pages/test";
import Test2 from "./pages/test2";
import TenantManagement from "./pages/tenantmanagement";
import TenantBootstrap from "./pages/tenantbootstrap";

const router = createBrowserRouter([
  { path: "/", element: <Land /> },
  { path: "/test", element: <Test /> },
  { path: "/test2", element: <Test2 /> },
  { path: "/TenantManagement", element: <TenantManagement /> },
  { path: "/TenantBootstrap", element: <TenantBootstrap /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
