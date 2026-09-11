import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Examine from './pages/Examine'
import Result from './pages/Result'
import Atlas from './pages/Atlas'
import Guide from './pages/Guide'
import History from './pages/History'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/examine" element={<Examine />} />
          <Route path="/reading/:id" element={<Result />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/guide" element={<Guide />} />
          <Route path="/history" element={<History />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
