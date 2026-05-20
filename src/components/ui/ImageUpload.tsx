import { useState, useRef, DragEvent } from 'react'
import { Upload, Trash2, Loader2 } from 'lucide-react'
import { storageQueries } from '@/lib/queries'

interface ImageUploadProps {
  label: string
  value: string
  onChange: (url: string) => void
  bucket?: string
  onError?: (msg: string) => void
}

export function ImageUpload({
  label,
  value,
  onChange,
  bucket = 'gallery',
  onError
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onError?.('Por favor, selecione apenas arquivos de imagem.')
      return
    }

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const uniqueFileName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`
      const path = uniqueFileName

      const { error } = await storageQueries.uploadFile(bucket, path, file)

      if (error) {
        throw error
      }

      const publicUrl = storageQueries.getPublicUrl(bucket, path)
      onChange(publicUrl)
    } catch (err: any) {
      console.error(err)
      onError?.(err.message || 'Erro ao fazer upload da imagem.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleUpload(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleUpload(e.target.files[0])
    }
  }

  const handleRemove = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-[10px] tracking-[0.12em] uppercase text-gold font-semibold mb-1 font-sans">
        {label}
      </label>

      {value ? (
        <div className="relative group rounded-2xl overflow-hidden border border-white/70 bg-white/40 backdrop-blur-md aspect-video flex items-center justify-center shadow-sm">
          <img
            src={value}
            alt="Upload Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-dark/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-3 bg-red-500/80 hover:bg-red-600 text-white rounded-full transition-all duration-300 shadow-md hover:scale-105 active:scale-95"
              title="Remover Imagem"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl aspect-video flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 select-none ${
            dragActive
              ? 'border-teal-clinic bg-teal-clinic/5 text-teal-clinic'
              : 'border-teal-clinic/20 bg-white/40 hover:bg-white/60 hover:border-teal-clinic/50 text-stone-muted hover:text-dark'
          } backdrop-blur-md`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            disabled={uploading}
          />

          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 text-teal-clinic animate-spin" />
              <span className="text-xs tracking-wider font-sans font-semibold text-teal-clinic animate-pulse">
                Carregando imagem...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-teal-clinic/5 flex items-center justify-center border border-teal-clinic/10 text-teal-clinic shadow-sm transition-transform duration-300">
                <Upload size={18} />
              </div>
              <div>
                <p className="text-xs font-semibold font-sans tracking-wide">
                  Arraste e solte a imagem aqui
                </p>
                <p className="text-[10px] text-stone-muted mt-1 font-sans">
                  ou clique para selecionar do seu dispositivo
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
