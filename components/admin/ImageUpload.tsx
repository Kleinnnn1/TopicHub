"use client";

import { useState, useRef } from "react";
import { ImageIcon, X, Upload } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (url: string | null) => void;
}

export function ImageUpload({ value, onChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData },
      );

      if (!res.ok) throw new Error("Upload failed.");

      const data = await res.json();
      onChange(data.secure_url);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
      // Reset input so same file can be re-uploaded
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function handleRemove() {
    onChange(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="space-y-2">
      {value ? (
        // Preview
        <div className="relative w-full overflow-hidden rounded-lg border border-neutral-200">
          <img
            src={value}
            alt="Cover preview"
            className="max-h-56 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 rounded-full bg-white p-1 shadow-md transition-colors hover:bg-red-50 hover:text-red-500"
            aria-label="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        // Upload area
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-neutral-200 px-4 py-8 text-sm text-neutral-400 transition-colors hover:border-blue-400 hover:bg-blue-50 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {uploading ? (
            <>
              <Upload size={20} className="animate-bounce" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <ImageIcon size={20} />
              <span>Click to upload cover image</span>
              <span className="text-xs text-neutral-300">
                PNG, JPG, WEBP up to 5MB
              </span>
            </>
          )}
        </button>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
