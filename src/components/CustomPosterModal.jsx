
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Upload, Download } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const CustomPosterModal = ({ 
  showUploader, 
  setShowUploader, 
  uploadedImage, 
  setUploadedImage,
  posterTitle,
  setPosterTitle,
  onSave
}) => {
  const onDrop = React.useCallback((acceptedFiles) => {
    const file = acceptedFiles[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = () => {
        setUploadedImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }, [setUploadedImage])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  })

  const handleDownload = () => {
    const link = document.createElement('a')
    link.href = uploadedImage
    link.download = `${posterTitle || 'movie-poster'}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <AnimatePresence>
      {showUploader && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        >
          <div className="bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-900/50 via-fuchsia-900/50 to-pink-900/50 backdrop-blur-xl p-8 rounded-3xl border border-white/10 w-full max-w-lg shadow-[0_0_25px_rgba(168,85,247,0.2)]">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-pink-400">
                Create Movie Poster
              </h2>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 border border-white/20 hover:border-white/40"
                onClick={() => {
                  setShowUploader(false)
                  setUploadedImage(null)
                  setPosterTitle('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
                isDragActive 
                  ? 'border-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 bg-gradient-to-r from-violet-500/10 via-fuchsia-500/10 to-pink-500/10' 
                  : 'border-white/10 hover:border-white/30'
              }`}
            >
              <input {...getInputProps()} />
              {uploadedImage ? (
                <div className="relative group">
                  <img
                    src={uploadedImage}
                    alt="Uploaded preview"
                    className="w-full h-64 object-cover rounded-lg shadow-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <Button
                      variant="ghost"
                      className="text-white hover:bg-white/20 backdrop-blur-sm border border-white/20 hover:border-white/40"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDownload()
                      }}
                    >
                      <Download className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-white/70">
                  <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg">Drag & drop an image here, or click to select</p>
                  <p className="text-sm text-white/50 mt-2">Supports JPG, JPEG, PNG</p>
                </div>
              )}
            </div>

            <Input
              type="text"
              placeholder="Enter movie title..."
              value={posterTitle}
              onChange={(e) => setPosterTitle(e.target.value)}
              className="mt-6 bg-white/5 border-white/10 text-white placeholder-white/50 h-12 text-lg focus:border-fuchsia-500/50 focus:ring-fuchsia-500/20"
            />

            <Button
              onClick={onSave}
              className="w-full mt-6 h-12 text-lg font-semibold bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-600 hover:from-violet-700 hover:via-fuchsia-700 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-purple-500/20"
            >
              Create Poster
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default CustomPosterModal
