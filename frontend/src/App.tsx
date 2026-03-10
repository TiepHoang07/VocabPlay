import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import Dictionary from './pages/Dictionary'
import Home from './pages/Home'
import Practice from './pages/Practice'
import Games from './pages/Games'

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="dictionary" element={<Dictionary />} />
          <Route path="practice" element={<Practice />} />
          <Route path="games" element={<Games />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App