"use client";

import { useState, useEffect, useRef } from "react";
import { Camera, X, Plus, Loader2 } from "lucide-react";
import Image from "next/image";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface Photo {
  id: string;
  url: string;
  caption: string;
  uploaded_by: string;
  created_at: string;
  isLocal?: boolean;
}

const LOCAL_PHOTOS: Photo[] = [
  { id: "local-1", url: "/photos/Screenshot_1.png", caption: "", uploaded_by: "nós", created_at: "2024-10-06", isLocal: true },
  { id: "local-2", url: "/photos/Screenshot_2.png", caption: "", uploaded_by: "nós", created_at: "2024-10-06", isLocal: true },
  { id: "local-3", url: "/photos/Screenshot_3.png", caption: "", uploaded_by: "nós", created_at: "2024-10-06", isLocal: true },
  { id: "local-4", url: "/photos/Screenshot_4.png", caption: "", uploaded_by: "nós", created_at: "2024-10-06", isLocal: true },
  { id: "local-5", url: "/photos/Screenshot_5.png", caption: "", uploaded_by: "nós", created_at: "2024-10-06", isLocal: true },
  { id: "local-6", url: "/photos/Screenshot_6.png", caption: "", uploaded_by: "nós", created_at: "2024-10-06", isLocal: true },
];

export default function PhotoGallery() {
  const [photos, setPhotos] = useState<Photo[]>(LOCAL_PHOTOS);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState("");
  const [uploadedBy, setUploadedBy] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    if (!isSupabaseConfigured) return;
    const { data } = await supabase
      .from("photos")
      .select("*")
      .order("created_at", { ascending: true });

    if (data) {
      setPhotos([...LOCAL_PHOTOS, ...data]);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function handleUpload() {
    if (!selectedFile || !uploadedBy.trim() || !isSupabaseConfigured) return;
    setUploading(true);

    const fileExt = selectedFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from("photos")
      .upload(fileName, selectedFile);

    if (uploadError) {
      alert("Erro ao enviar foto: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage
      .from("photos")
      .getPublicUrl(fileName);

    const { error: insertError } = await supabase.from("photos").insert({
      url: urlData.publicUrl,
      caption: caption.trim(),
      uploaded_by: uploadedBy.trim(),
    });

    if (insertError) {
      alert("Erro ao salvar foto: " + insertError.message);
      setUploading(false);
      return;
    }

    setShowUpload(false);
    setCaption("");
    setUploadedBy("");
    setPreview(null);
    setSelectedFile(null);
    setUploading(false);
    fetchPhotos();
  }

  return (
    <section id="fotos" className="py-12 md:py-16">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-serif text-rose-600">
            📸 Nossas Fotos
          </h2>
          <p className="text-rose-400/60 text-sm mt-1">
            Momentos que guardamos pra sempre
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-4 py-2.5 rounded-full transition-all shadow-lg shadow-rose-200 hover:shadow-rose-300 text-sm font-medium"
        >
          <Plus size={18} />
          <span className="hidden sm:inline">Adicionar</span>
        </button>
      </div>

      {/* Grid de fotos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="photo-card relative aspect-square rounded-2xl overflow-hidden cursor-pointer shadow-md bg-white"
            style={{ animationDelay: `${i * 0.05}s` }}
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.url}
              alt={photo.caption || `Foto ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
              unoptimized={photo.isLocal ? false : true}
            />
            {photo.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-3">
                <p className="text-white text-xs font-medium truncate">
                  {photo.caption}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal de foto expandida */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-3xl max-h-[85vh] w-full animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-3 -right-3 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-rose-50 transition-colors"
            >
              <X size={20} className="text-rose-500" />
            </button>
            <div className="relative w-full h-[70vh] rounded-2xl overflow-hidden bg-white shadow-2xl">
              <Image
                src={selectedPhoto.url}
                alt={selectedPhoto.caption || "Foto"}
                fill
                className="object-contain"
                unoptimized={selectedPhoto.isLocal ? false : true}
              />
            </div>
            {(selectedPhoto.caption || selectedPhoto.uploaded_by) && (
              <div className="bg-white rounded-b-2xl px-4 py-3 -mt-4 relative z-10 shadow-lg">
                {selectedPhoto.caption && (
                  <p className="text-gray-700 font-medium">{selectedPhoto.caption}</p>
                )}
                <p className="text-rose-400 text-sm">
                  por {selectedPhoto.uploaded_by}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal de upload */}
      {showUpload && (
        <div
          className="fixed inset-0 modal-backdrop z-50 flex items-center justify-center p-4"
          onClick={() => !uploading && setShowUpload(false)}
        >
          <div
            className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full animate-slide-up shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif text-rose-600">Nova Foto</h3>
              <button
                onClick={() => !uploading && setShowUpload(false)}
                className="text-rose-300 hover:text-rose-500 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {preview ? (
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-rose-50">
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  onClick={() => {
                    setPreview(null);
                    setSelectedFile(null);
                  }}
                  className="absolute top-2 right-2 bg-white/80 rounded-full p-1.5"
                >
                  <X size={16} className="text-rose-500" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full aspect-video rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 bg-rose-50/50 flex flex-col items-center justify-center gap-3 transition-colors mb-4"
              >
                <Camera size={32} className="text-rose-300" />
                <span className="text-rose-400 text-sm">
                  Clique para escolher uma foto
                </span>
              </button>
            )}

            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
            />

            <input
              type="text"
              placeholder="Seu nome ❤️"
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-gray-700 placeholder:text-rose-300 mb-3"
              maxLength={50}
            />

            <input
              type="text"
              placeholder="Legenda (opcional)"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-rose-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-100 outline-none text-gray-700 placeholder:text-rose-300 mb-4"
              maxLength={200}
            />

            <button
              onClick={handleUpload}
              disabled={!selectedFile || !uploadedBy.trim() || uploading}
              className="w-full bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Camera size={18} />
                  Adicionar Foto
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
