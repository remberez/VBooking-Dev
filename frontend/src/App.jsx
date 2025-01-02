import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import MainPage from './pages/MainPage'
import Store from './store/store'
import { createContext, useState } from 'react'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'
import ProfilePage from './pages/profile/ProfilePage'
import Profile from './pages/profile/outlets/profile/Profile'
import Favorites from './pages/profile/outlets/favorites/Favorites'

const store = new Store();

export const Context = createContext({
  store: store,
  logoComponent: null,
  setLogoComponent: () => {},
});

function App() {
  const [logoComponent, setLogoComponent] = useState(null);

  return (
    <Context.Provider value={{store, logoComponent, setLogoComponent}}>
      <Routes>
        <Route path="/" element={<Layout/>}>
          <Route index element={<MainPage/>} />
          <Route path="search" element={<SearchPage/>} />
          <Route path="/lc" element={<ProfilePage />}>
            <Route path="profile" element={<Profile/>} />
            <Route path="bookings" element={<h1>Бронирования</h1>} />
            <Route path="reviews" element={<h1>Отзывы</h1>} />
            <Route path="favorites" element={<Favorites/>} />
=         </Route>
          <Route path="admin" element={<h1>Админка</h1>}/>
          <Route path="object/:objectId" element={<h1>Объект</h1>}/>
          <Route path="*" element={<NotFoundPage/>} />
        </Route>
      </Routes>
    </Context.Provider>
  )
}

export default App
