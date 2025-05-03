
import React from 'react'
import { motion } from 'framer-motion'
import { Download, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

const MovieCard = ({ movie, onClick, onDownload, onToggleWatched, isWatched }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="movie-card relative group"
    >
      <Card
        className="cursor-pointer h-full bg-transparent overflow-hidden"
        onClick={onClick}
      >
        <CardContent className="p-0">
          <img
            className="w-full h-[400px] object-cover"
            alt={`${movie.title} poster`}
            src={movie.isCustom ? movie.poster_path : `https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1485846234645-a62644f84728'
            }}
          />
          <div className="movie-info">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-xl">{movie.title}</h3>
              {!movie.isCustom && (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`ml-2 ${isWatched ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/70'} hover:bg-white/20`}
                  onClick={(e) => {
                    e.stopPropagation()
                    onToggleWatched(movie)
                  }}
                >
                  <Check className={`h-4 w-4 ${isWatched ? 'text-green-400' : 'text-white/70'}`} />
                  <span className="ml-1 text-sm">{isWatched ? 'Watched' : 'Mark as Watched'}</span>
                </Button>
              )}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">
                {movie.release_date?.split('-')[0]}
              </p>
              <div className="flex items-center">
                <span className="text-yellow-400 mr-1">★</span>
                <span>{movie.vote_average?.toFixed(1)}</span>
              </div>
            </div>
          </div>
          {movie.isCustom && (
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload(movie)
                }}
              >
                <Download className="h-6 w-6" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default MovieCard
