
import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Star, Clock, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'

const MovieDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [movie, setMovie] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=3e52e2f5350ae60de5e2fc58e818d2a0`
        )
        const data = await response.json()
        setMovie(data)
      } catch (error) {
        toast({
          title: 'Error!',
          description: 'Failed to fetch movie details.',
          variant: 'destructive',
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMovieDetails()
  }, [id, toast])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-b from-blue-900 via-purple-900 to-black">
      <div className="max-w-7xl mx-auto">
        <Button
          onClick={() => navigate('/movies')}
          variant="ghost"
          className="text-white mb-8 hover:bg-white/10"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Movies
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="movie-details"
        >
          <div className="md:flex">
            <div className="md:w-1/3">
              <img
                className="w-full h-[600px] object-cover"
                alt={`${movie.title} poster`}
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728'
                }}
              />
            </div>
            <div className="md:w-2/3 p-8">
              <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                {movie.title}
              </h1>
              
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 mr-2" />
                  <span className="text-xl text-white">
                    {movie.vote_average?.toFixed(1)} / 10
                  </span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-purple-400 mr-2" />
                  <span className="text-white">{movie.runtime} min</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-pink-400 mr-2" />
                  <span className="text-white">{movie.release_date}</span>
                </div>
              </div>

              <p className="text-lg text-white/80 mb-8 leading-relaxed">
                {movie.overview}
              </p>

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">Genres</h3>
                  <div className="flex flex-wrap gap-3">
                    {movie.genres?.map((genre) => (
                      <span
                        key={genre.id}
                        className="genre-tag"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {movie.production_companies?.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Production Companies
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {movie.production_companies.map((company) => (
                        <span
                          key={company.id}
                          className="genre-tag"
                        >
                          {company.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MovieDetails
