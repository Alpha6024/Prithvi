import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import './index.css'
import Start from "./components/start"
import Acc from "./components/acc"
import Campaign from "./components/campaign";
import Home from "./components/home"
import Leaderboard from "./components/leaderboard";
import Post from "./components/post";
import Profile from "./components/profile";
import Newacc from "./components/newacc"
import CreateAcc from "./components/createacc";
import Bot from "./components/bot";
import Fund from "./components/fund";
import Feedback from "./components/feedback";
import Admin from "./components/admin";
import AuthCallback from "./components/authcallback";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  { path: "/", element: <Start /> },
  { path: "/acc", element: <Acc /> },
  { path: "/createacc", element: <CreateAcc /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  {
    path: "/newacc",
    element: <ProtectedRoute><Newacc /></ProtectedRoute>
  },
  {
    path: "/acc/home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/acc/home/post",
    element: <ProtectedRoute><Post /></ProtectedRoute>
  },
  {
    path: "/acc/home/campaign",
    element: <ProtectedRoute><Campaign /></ProtectedRoute>
  },
  {
    path: "/acc/home/leaderboard",
    element: <ProtectedRoute><Leaderboard /></ProtectedRoute>
  },
  {
    path: "/acc/home/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  {
    path: "/acc/bot",
    element: <ProtectedRoute><Bot /></ProtectedRoute>
  },
  {
    path: "/acc/home/fund",
    element: <ProtectedRoute><Fund /></ProtectedRoute>
  },
  {
    path: "/acc/campaign/feedback/:campaignId",
    element: <ProtectedRoute><Feedback /></ProtectedRoute>
  },
  { path: "/admin", element: <Admin /> }
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
