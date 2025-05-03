
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from '@/components/ui/toaster'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Movies from '@/pages/Movies'
import MovieDetails from '@/pages/MovieDetails'
import CustomPosters from '@/pages/CustomPosters'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(
    !!localStorage.getItem('user')
  )

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          <Route
            path="/login"
            element={
              !isAuthenticated ? (
                <Login setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/movies" />
              )
            }
          />
          <Route
            path="/register"
            element={
              !isAuthenticated ? (
                <Register setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/movies" />
              )
            }
          />
          <Route
            path="/movies"
            element={
              isAuthenticated ? (
                <Movies setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/custom-posters"
            element={
              isAuthenticated ? (
                <CustomPosters />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/movie/:id"
            element={
              isAuthenticated ? (
                <MovieDetails setIsAuthenticated={setIsAuthenticated} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/movies" />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  )
}

export default App
