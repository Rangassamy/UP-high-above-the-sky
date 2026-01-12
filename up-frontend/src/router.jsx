import { createBrowserRouter } from "react-router-dom";
import AppLayout from "./ui/AppLayout";

import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CategoryPage from "./pages/CategoryPage";
import ProductPage from "./pages/ProductPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import AccountPage from "./pages/AccountPage";
import ContactPage from "./pages/ContactPage";

import AdminPage from "./pages/admin/AdminPage";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminPromos from "./pages/admin/AdminPromos";

import CGVPage from "./pages/legal/CGVPage";
import PrivacyPage from "./pages/legal/PrivacyPage";
import MentionsPage from "./pages/legal/MentionsPage";

import NotFoundPage from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <HomePage /> },

      { path: "catalog", element: <CatalogPage /> },
      { path: "category/:category", element: <CategoryPage /> },
      { path: "product/:slug", element: <ProductPage /> },

      { path: "cart", element: <CartPage /> },
      { path: "checkout", element: <CheckoutPage /> },

      { path: "login", element: <LoginPage /> },
      { path: "account", element: <AccountPage /> },

      { path: "contact", element: <ContactPage /> },

      {
        path: "admin",
        element: <AdminPage />,
        children: [
          { index: true, element: <AdminProducts /> },
          { path: "products", element: <AdminProducts /> },
          { path: "orders", element: <AdminOrders /> },
          { path: "promos", element: <AdminPromos /> },
        ],
      },

      { path: "legal/cgv", element: <CGVPage /> },
      { path: "legal/privacy", element: <PrivacyPage /> },
      { path: "legal/mentions", element: <MentionsPage /> },

      { path: "*", element: <NotFoundPage /> },
    ],
  },
]);
