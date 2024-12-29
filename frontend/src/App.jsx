import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './layout/Layout'
import MainPage from './pages/MainPage'
import Store from './store/store'
import { createContext, useState } from 'react'
import SearchPage from './pages/SearchPage'
import NotFoundPage from './pages/NotFoundPage'

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
          <Route path='search' element={<SearchPage/>} />
          <Route path="*" element={<NotFoundPage/>} />
        </Route>
      </Routes>
    </Context.Provider>
  )
}

export default App
