import React from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Profile from './pages/Profile'
import MyPosts from './pages/MyPosts'
import DetailsPost from './pages/DetailsPost'
import Marketplace from './pages/Marketplace'
import ItemDetails from './components/marketplace/ItemDetails'
import AboutUs from './pages/AboutUs'
import Setting from './pages/Setting'

export default function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-posts" element={<MyPosts />} />
        <Route path="/details/:id" element={<DetailsPost />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/settings" element={<Setting />} />
      </Routes>
      <Footer />
    </div>
  )
}