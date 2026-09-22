import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Items from "./pages/Items";
import ItemDetails from "./pages/ItemDetails";
import CreateItem from "./pages/CreateItem";
import { Login, Register } from "./pages/Auth";
import { Clubs, Events, Discussions } from "./pages/Community";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import './index.css'
import EditItem from "./pages/EditItem";
const P = ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>;
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="items" element={<Items />} />
        <Route path="items/:id" element={<ItemDetails />} />
        <Route
          path="create-item"
          element={
            <P>
              <CreateItem />
            </P>
          }
        />
        <Route
          path="/items/:id/edit"
          element={<EditItem />}
        />
        {/* <Route path="clubs" element={<Clubs />} /> */}
        {/* <Route path="events" element={<Events />} /> */}
        <Route path="discussions" element={<Discussions />} />
        <Route
          path="chat"
          element={
            <P>
              <Chat />
            </P>
          }
        />
        <Route path="profile/:id" element={<Profile />} />
        <Route
          path="notifications"
          element={
            <P>
              <Notifications />
            </P>
          }
        />
        <Route
          path="settings"
          element={
            <P>
              <Settings />
            </P>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
