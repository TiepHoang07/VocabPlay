import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import Dictionary from './pages/Dictionary'
import Home from './pages/Home'
import Games from './pages/Games'
import Leaderboard from './pages/Leaderboard'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'

import WordChain from './pages/WordChain'
import MemoryMatch from './pages/MemoryMatch'
import FlipCards from './pages/FlipCards'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="flipcards" element={<FlipCards />} />
          <Route path="games" element={<Games />} />
          <Route path="games/word-chain" element={<WordChain />} />
          <Route path="games/memory" element={<MemoryMatch />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App