
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, LogOut, Upload, Image, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import CustomPosterModal from '@/components/CustomPosterModal'
import MovieCard from '@/components/MovieCard'

const Movies = ({ setIsAuthenticated }) => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [search, setSearch] = React.useState('')
  const [movies, setMovies] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const [showUploader, setShowUploader] = React.useState(false)
  const [uploadedImage, setUploadedImage] = React.useState(null)
  const [posterTitle, setPosterTitle] = React.useState('')
  const [watchedMovies, setWatchedMovies] = React.useState(
    JSON.parse(localStorage.getItem('watchedMovies') || '[]')
  )

  React.useEffect(() => {
    const fetchTrendingMovies = async () => {
      try {
        const response = await fetch(
          'https://api.themoviedb.org/3/trending/movie/day?api_key=3e52e2f5350ae60de5e2fc58e818d2a0'
        )
        const data = await response.json()
        
        const customPosters = JSON.parse(localStorage.getItem('customPosters') || '[]')
        setMovies([...customPosters, ...data.results])
      } catch (error) {
        toast({
          title: 'Error!',
          description: 'Failed to fetch trending movies.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchTrendingMovies()
  }, [toast])

  const searchMovies = async () => {
    if (!search.trim()) return
    setLoading(true)
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=3e52e2f5350ae60de5e2fc58e818d2a0&query=${encodeURIComponent(
          search
        )}`
      )
      const data = await response.json()
      
      const customPosters = JSON.parse(localStorage.getItem('customPosters') || '[]')
      const filteredCustomPosters = customPosters.filter(poster => 
        poster.title.toLowerCase().includes(search.toLowerCase())
      )
      
      setMovies([...filteredCustomPosters, ...data.results])
    } catch (error) {
      toast({
        title: 'Error!',
        description: 'Failed to fetch movies.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setIsAuthenticated(false)
    navigate('/login')
    toast({
      title: 'Success!',
      description: 'You have been logged out.',
    })
  }

  const handleDownload = (movie) => {
    const link = document.createElement('a')
    link.href = movie.poster_path
    link.download = `${movie.title}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    toast({
      title: 'Success!',
      description: 'Poster downloaded successfully.',
    })
  }

  const handleToggleWatched = (movie) => {
    const isCurrentlyWatched = watchedMovies.includes(movie.id)
    let updatedWatchedMovies
    
    if (isCurrentlyWatched) {
      updatedWatchedMovies = watchedMovies.filter(id => id !== movie.id)
      toast({
        title: 'Movie Unwatched',
        description: `${movie.title} has been removed from your watched list.`,
      })
    } else {
      updatedWatchedMovies = [...watchedMovies, movie.id]
      toast({
        title: 'Movie Marked as Watched',
        description: `${movie.title} has been added to your watched list.`,
      })
    }
    
    setWatchedMovies(updatedWatchedMovies)
    localStorage.setItem('watchedMovies', JSON.stringify(updatedWatchedMovies))
  }

  const addCustomPoster = () => {
    if (!uploadedImage || !posterTitle.trim()) {
      toast({
        title: 'Error!',
        description: 'Please provide both image and title.',
        variant: 'destructive',
      })
      return
    }

    const customMovie = {
      id: `custom-${Date.now()}`,
      title: posterTitle,
      poster_path: uploadedImage,
      release_date: new Date().getFullYear().toString(),
      vote_average: 0,
      isCustom: true
    }

    const customPosters = JSON.parse(localStorage.getItem('customPosters') || '[]')
    const updatedPosters = [customMovie, ...customPosters]
    localStorage.setItem('customPosters', JSON.stringify(updatedPosters))

    setMovies(prev => [customMovie, ...prev])
    setShowUploader(false)
    setUploadedImage(null)
    setPosterTitle('')
    toast({
      title: 'Success!',
      description: 'Custom poster added successfully.',
    })
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-900 via-purple-900 to-black">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Movie Finder
          </h1>
          <div className="flex gap-4">
            <Button 
              onClick={() => navigate('/custom-posters')}
              variant="outline" 
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <Image className="mr-2 h-4 w-4" /> My Posters
            </Button>
            <Button 
              onClick={() => setShowUploader(true)} 
              variant="outline" 
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <Upload className="mr-2 h-4 w-4" /> Create Poster
            </Button>
            <Button 
              onClick={handleLogout} 
              variant="ghost" 
              className="text-white hover:bg-white/10 transition-all duration-300"
            >
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          </div>
        </motion.div>

        <CustomPosterModal
          showUploader={showUploader}
          setShowUploader={setShowUploader}
          uploadedImage={uploadedImage}
          setUploadedImage={setUploadedImage}
          posterTitle={posterTitle}
          setPosterTitle={setPosterTitle}
          onSave={addCustomPoster}
        />

        <div className="search-container">
          <div className="flex gap-4">
            <Input
              type="text"
              placeholder="Search for movies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchMovies()}
              className="search-input"
            />
            <Button 
              onClick={searchMovies} 
              disabled={loading}
              className="px-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading-spinner" />
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">
                {search ? 'Search Results' : 'Trending Movies'}
              </h2>
              <div className="flex items-center gap-2 text-white/70">
                <Check className="h-4 w-4 text-green-400" />
                <span>{watchedMovies.length} movies watched</span>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fadeIn"
            >
              {movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => !movie.isCustom && navigate(`/movie/${movie.id}`)}
                  onDownload={handleDownload}
                  onToggleWatched={handleToggleWatched}
                  isWatched={watchedMovies.includes(movie.id)}
                />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </div>
  )
}

export default Movies
