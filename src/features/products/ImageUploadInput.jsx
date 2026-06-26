import { useState, useRef } from 'react';
import { HiOutlinePhoto, HiOutlineXMark } from 'react-icons/hi2';

export default function ImageUploadInput({ value, onChange, label = 'Product Image' }) {
  const [dragging, setDragging] = useState(false);
  const [preview, setPreview] = useState(value || null);
  const inputRef = useRef(null);

  const handleFile = (file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    onChange?.(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) handleFile(file);
  };

  const clear = () => {
    setPreview(null);
    onChange?.(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>

      {preview ? (
        <div className="relative inline-block">
          <img src={preview} alt="Preview" className="h-40 w-40 rounded-xl object-cover border border-slate-200" />
          <button
            type="button"
            onClick={clear}
            className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600 shadow"
          >
            <HiOutlineXMark className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 transition-all duration-150 ${
            dragging
              ? 'border-indigo-400 bg-indigo-50'
              : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/40'
          }`}
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100">
            <HiOutlinePhoto className="h-6 w-6 text-indigo-600" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-slate-700">
              <span className="text-indigo-600">Click to upload</span> or drag & drop
            </p>
            <p className="mt-0.5 text-xs text-slate-400">PNG, JPG, GIF up to 5MB</p>
          </div>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={e => handleFile(e.target.files[0])}
      />
    </div>
  );
}
