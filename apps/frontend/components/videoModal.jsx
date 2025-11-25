"use client"

import { useEffect } from "react"

export default function VideoModal({ open, onClose }) {
  // close on ESC
  useEffect(() => {
    const handler = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center mb-24 justify-center z-[9999]"
      onClick={onClose}   // ✅ click backdrop to close
    >
      {/* Modal box */}
      <div
        className="bg-[#0f1419] p-4 rounded-xl border border-gray-700 w-full max-w-3xl relative"
        onClick={(e) => e.stopPropagation()}  // ❗ prevent closing when clicking inside the modal
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white text-xl"
        >
          ✕
        </button>

        {/* Video */}
        <video
          src="/ads.mp4"
          controls
          autoPlay
          className="w-full rounded-lg"
        />
      </div>
    </div>
  )
}
