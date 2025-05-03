
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import MovieCard from '@/components/MovieCard'

const CustomPosters = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [customPosters, setCustomPosters] = React.useState([])

  React.useEffect(() => {
    const posters = JSON.parse(localStorage.getItem('customPosters') || '[]')
    setCustomPosters(posters)
  }, [])

  const handleDelete = (movieId) => {
    const updatedPosters = customPosters.filter(poster => poster.id !== movieId)
    localStorage.setItem('customPosters', JSON.stringify(updatedPosters))
    setCustomPosters(updatedPosters)
    toast({
      title: 'Success!',
      description: 'Poster deleted successfully.',
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

  return (
    <div className="min-h-screen p-6 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900 via-indigo-900 to-pink-900">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-center mb-12"
        >
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10 backdrop-blur-lg border border-white/20 hover:border-white/40 transition-all duration-300"
              onClick={() => navigate('/movies')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400 animate-text">
              My Custom Posters
            </h1>
          </div>
        </motion.div>

        {customPosters.length === 0 ? (
          <div className="text-center mt-20 p-8 rounded-3xl bg-gradient-to-br from-white/5 via-purple-500/5 to-pink-500/5 backdrop-blur-xl border border-white/10 shadow-[0_0_15px_rgba(168,85,247,0.15)]">
            <p className="text-xl text-white/90 mb-4">No custom posters created yet.</p>
            <Button
              className="mt-4 bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
              onClick={() => navigate('/movies')}
            >
              Create Your First Poster
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fadeIn"
          >
            {customPosters.map((poster) => (
              <div key={poster.id} className="relative group">
                <MovieCard
                  movie={poster}
                  onDownload={handleDownload}
                />
                <Button
                  variant="destructive"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 shadow-lg shadow-rose-500/20"
                  onClick={() => handleDelete(poster.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default CustomPosters
