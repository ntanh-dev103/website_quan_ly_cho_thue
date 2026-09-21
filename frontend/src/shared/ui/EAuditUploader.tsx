import React, { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';

interface EAuditUploaderProps {
  onUpload: (file: File) => void;
  maxSizeMB?: number;
}

export const EAuditUploader: React.FC<EAuditUploaderProps> = ({ onUpload, maxSizeMB = 0.5 }) => {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsCompressing(true);
      setError(null);
      setProgress(0);
      
      // V2.0 Rule 6: Run compression inside a Web Worker (useWebWorker: true).
      // browser-image-compression natively supports this — the main thread stays unblocked.
      const options = {
        maxSizeMB: maxSizeMB,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        onProgress: (p: number) => setProgress(p),
      };

      const compressedFile = await imageCompression(file, options);
      
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);
      setProgress(100);

      onUpload(compressedFile);
    } catch (err) {
      console.error('Lỗi khi tối ưu hóa ảnh:', err);
      setError('Không thể tối ưu hóa ảnh. Vui lòng thử lại.');
    } finally {
      setIsCompressing(false);
    }
  }, [onUpload, maxSizeMB]);

  return (
    <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
      {preview ? (
        <div className="relative w-full max-w-sm">
          <img src={preview} alt="Ảnh kiểm tra" className="w-full h-auto rounded-lg shadow-sm" />
          <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full shadow">
            <CheckCircle size={20} />
          </div>
          <p className="text-center mt-3 text-sm font-medium text-gray-700">Chụp ảnh kiểm tra thành công!</p>
          <button 
            onClick={() => { setPreview(null); setProgress(0); }}
            className="mt-4 w-full py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Chụp ảnh khác
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full cursor-pointer">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {isCompressing ? (
              <>
                <div className="relative w-16 h-16 mb-3">
                  <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                    <circle
                      cx="32" cy="32" r="28" fill="none" stroke="#2563eb" strokeWidth="4"
                      strokeDasharray={`${2 * Math.PI * 28}`}
                      strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                      strokeLinecap="round"
                      className="transition-all duration-300"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-blue-600">
                    {Math.round(progress)}%
                  </span>
                </div>
                <p className="mb-1 text-sm font-semibold text-blue-600">
                  Đang tối ưu hóa...
                </p>
                <p className="text-xs text-gray-400">Đang nén ảnh trong Web Worker</p>
              </>
            ) : (
              <>
                <Camera className="w-10 h-10 mb-3 text-gray-400" />
                <p className="mb-2 text-sm text-gray-500">
                  <span className="font-semibold">Nhấn để chụp ảnh kiểm tra</span>
                </p>
                <p className="text-xs text-gray-400">Ảnh sẽ được tối ưu hóa tự động (&lt;500KB)</p>
              </>
            )}
            {error && (
              <div className="flex items-center gap-1 mt-2 text-xs text-red-500">
                <AlertCircle size={14} />
                <span>{error}</span>
              </div>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            capture="environment"
            onChange={handleFileChange}
            disabled={isCompressing}
          />
        </label>
      )}
    </div>
  );
};
