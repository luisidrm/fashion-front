import { ImagePlus, X } from "lucide-react"
import { useRef } from "react"


const fileToProductImage = (file: File, index: number, totalExisting: number): Promise<ProductImages> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      resolve({
        url: '',
        altText: file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' '),
        displayOrder: totalExisting + index,
        isPrimary: totalExisting === 0 && index === 0,
        base64: reader.result as string,
      })
    }
    reader.onerror = () => reject(new Error(`Failed to read: ${file.name}`))
    reader.readAsDataURL(file)
  })
}

export interface ProductImages {
  altText: string
  displayOrder: number
  isPrimary: boolean
  base64?: string
  url?: string
}

type MultiImagePickerProps = {
  images: ProductImages[]
  onChange: (images: ProductImages[]) => void
}

export default function MultiImagePicker({ images, onChange }: MultiImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: File[]) => {
    if (!files.length) return
    const deduped = files.filter(
      (f) => !images.some(
        (img) => img.altText === f.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
      )
    )
    if (!deduped.length) return
    const converted = await Promise.all(
      deduped.map((file, i) => fileToProductImage(file, i, images.length))
    )
    onChange([...images, ...converted] as ProductImages[])
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(Array.from(e.target.files ?? []))
    e.target.value = ''
  }

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    await processFiles(
      Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith('image/'))
    )
  }

  const handleRemove = (index: number) => {
    const updated = images
      .filter((_, i) => i !== index)
      .map((img, i) => ({ ...img, displayOrder: i, isPrimary: i === 0 }))
    onChange(updated)
  }

  return (
    <div className="flex overflow-x-auto gap-2 mb-4">
      {images.map((img, i) => (
        <div key={`${img.altText}-${img.displayOrder}`} className="group relative h-40 w-40 shrink-0">
          <img
            src={img.base64 ??`${process.env.NEXT_PUBLIC_IMAGE_URL}${img.base64 || img.url}`}
            alt={img.altText}
            className="h-full w-full rounded-lg object-cover border border-[var(--retro-gold)]/20"
          />
          {i === 0 && (
            <span className="absolute top-1 left-1 rounded bg-[#56422D] px-1 py-0.5 font-[family-name:var(--font-dm-sans)] text-[9px] uppercase tracking-wider text-[var(--retro-gold)]">
              Principal
            </span>
          )}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); handleRemove(i) }}
            className="absolute right-1 top-1 rounded-full bg-[var(--retro-black)]/70 p-0.5 text-[var(--retro-paper)]/70 opacity-0 transition group-hover:opacity-100 hover:text-[var(--retro-rust)]"
            aria-label="Eliminar imagen"
          >
            <X size={12} />
          </button>
        </div>
      ))}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="h-40 w-40 shrink-0 cursor-pointer rounded-lg border border-dashed border-[var(--retro-gold)]/30 bg-[var(--retro-deep)] flex flex-col items-center justify-center gap-1 transition hover:border-[var(--retro-gold)]/60 hover:bg-[var(--retro-gold)]/5"
      >
        <ImagePlus size={20} className="text-[var(--retro-paper)]/40" />
        <p className="font-[family-name:var(--font-dm-sans)] text-[9px] uppercase tracking-wider text-[var(--retro-paper)]/40 text-center leading-tight px-1">
          Añadir
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
      </div>
    </div>
  )
}