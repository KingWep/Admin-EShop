import { Link } from 'react-router-dom';
import { HiOutlinePlus } from 'react-icons/hi2';

const NO_IMAGE = 'https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg';

export default function ProductGallery({ images, activeImage, setActiveImage, productId }) {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-6">
      <h2 className="text-sm font-bold text-slate-900 mb-4">Product Images</h2>
      <div className="grid grid-cols-4 gap-3">
        {images.slice(0, 3).map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveImage(i)}
            className={`aspect-square rounded-xl overflow-hidden transition-all ${
              activeImage === i ? 'ring-2 ring-indigo-600 ring-offset-2' : 'ring-1 ring-slate-200 hover:ring-indigo-300'
            }`}
          >
            <img
              src={img}
              alt=""
              className="w-full h-full object-cover"
              onError={e => { e.currentTarget.src = NO_IMAGE; }}
            />
          </button>
        ))}
        <Link
          to={`/dashboard/products/edit/${productId}`}
          className="aspect-square rounded-xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 transition-colors"
        >
          <HiOutlinePlus className="h-5 w-5" />
          <span className="text-[10px] font-semibold mt-0.5">Add</span>
        </Link>
      </div>
    </div>
  );
}

export { NO_IMAGE };