import React from 'react'
import { Route, Routes } from 'react-router-dom'
import LandingPage from './component/LandingPage'
import ErrorPage from './component/ErrorPage'
import { ToastContainer } from 'react-toastify'
import Navbar from './component/Navbar'
import Login from './component/Login'
import Register from './component/Register'
import OpenMovie from './component/OpenMovie'
import People from './component/People'
import Playlist from './component/Playlist'

function App() {
  return (
    <div>
      <Navbar/>
      <AppRoutes/>
    </div>
  )
}
function AppRoutes() {
  return (<>
    <Routes>
      <Route path="/" element={<LandingPage/>} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/people" element={<People/>} />
      <Route path="/open" element={<OpenMovie/>} />
      <Route path="/playlist" element={<Playlist/>} />
      <Route path="*" element={<ErrorPage/>} />
    </Routes>

    <ToastContainer />
  </>
  )
}

export default App
