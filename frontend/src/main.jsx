
import React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Dashboard from "./pages/dashboard";
import Test from "./pages/test";
import Test2 from "./pages/test2";
import TenantManagement from "./pages/tenantmanagement";
import TenantDetail from "./pages/tenantdetail";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/test", element: <Test /> },
  { path: "/test2", element: <Test2 /> },
  { path: "/TenantManagement", element: <TenantManagement /> },
  { path: "/TenantDetail", element: <TenantDetail /> },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);
