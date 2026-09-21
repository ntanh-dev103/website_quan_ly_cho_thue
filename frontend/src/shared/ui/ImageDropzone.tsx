import { useState } from 'react';
import { UploadCloud, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn, sleep } from '@/shared/lib/utils';

interface ImageDropzoneProps {
  maxFiles?: number;
  value?: string[];
  onChange?: (urls: string[]) => void;
  className?: string;
}

interface UploadingFile {
  id: string;
  file: File;
  preview: string;
  progress: number;
  status: 'compressing' | 'uploading' | 'done' | 'error';
  errorMsg?: string;
  finalSize?: string;
}

export function ImageDropzone({ maxFiles = 5, value = [], onChange, className }: ImageDropzoneProps) {
  const [uploads, setUploads] = useState<UploadingFile[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const processFiles = async (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    
    // Check Max Files limits
    if (value.length + uploads.length + newFiles.length > maxFiles) {
      alert(`Chỉ được tải lên tối đa ${maxFiles} ảnh.`);
      return;
    }

    const newUploads: UploadingFile[] = newFiles.map(file => ({
      id: Math.random().toString(36).substring(7),
      file,
      preview: URL.createObjectURL(file),
      progress: 0,
      status: file.size > 10 * 1024 * 1024 ? 'error' : 'compressing',
      errorMsg: file.size > 10 * 1024 * 1024 ? 'Ảnh vượt quá 10MB' : undefined,
    }));

    setUploads(prev => [...prev, ...newUploads]);

    // Simulate Processing for valid files
    for (const item of newUploads) {
      if (item.status === 'error') continue;

      // Mock Compression
      await sleep(1000);
      setUploads(prev => prev.map(u => 
        u.id === item.id 
          ? { ...u, status: 'done', finalSize: `${Math.round(item.file.size / 1024 / 2)}KB` } 
          : u
      ));

      // Mock passing URL to parent
      if (onChange) {
        onChange([...value, item.preview]); // In reality, wait for all uploads and pass real URLs
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeImage = (idToRemove: string, isUploaded: boolean) => {
    if (isUploaded) {
      if (onChange) onChange(value.filter(url => url !== idToRemove));
    } else {
      setUploads(prev => prev.filter(u => u.id !== idToRemove));
    }
  };

  const currentTotal = value.length + uploads.length;

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-colors cursor-pointer",
          isDragActive ? "border-primary-500 bg-primary-50" : "border-gray-300 hover:border-gray-400 bg-gray-50",
          currentTotal >= maxFiles && "opacity-50 pointer-events-none"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="p-4 bg-white rounded-full shadow-sm border border-gray-100 mb-4">
          <UploadCloud className="h-8 w-8 text-primary-500" />
        </div>
        <h4 className="text-sm font-semibold text-gray-900 mb-1">
          Kéo thả ảnh vào đây, hoặc click để chọn ảnh
        </h4>
        <p className="text-xs text-gray-500 mb-2">Hỗ trợ JPG, PNG (Tối đa 10MB)</p>
        <p className="text-xs font-medium text-gray-400">
          Đã tải lên {currentTotal}/{maxFiles} ảnh
        </p>
        <input 
          id="file-upload" 
          type="file" 
          multiple 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileInput}
          disabled={currentTotal >= maxFiles}
        />
      </div>

      {/* Upload Previews */}
      {(value.length > 0 || uploads.length > 0) && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          
          {/* Existing Value URLs */}
          {value.map((url, idx) => (
            <div key={`val-${idx}`} className="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={url} alt="Uploaded" className="w-full h-full object-cover" />
              <button 
                type="button"
                onClick={() => removeImage(url, true)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}

          {/* New Uploading Files */}
          {uploads.map(item => (
            <div key={item.id} className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
              <img src={item.preview} alt="Preview" className={cn("w-full h-full object-cover", item.status !== 'done' && 'opacity-50 grayscale')} />
              
              {/* Overlay states */}
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] p-2 text-center">
                {item.status === 'compressing' && (
                  <>
                    <div className="h-5 w-5 border-2 border-gray-300 border-t-primary-600 rounded-full animate-spin mb-1" />
                    <span className="text-[10px] font-semibold text-gray-700">Đang nén...</span>
                  </>
                )}
                {item.status === 'done' && (
                  <>
                    <CheckCircle2 className="h-5 w-5 text-green-600 mb-1" />
                    <span className="text-[10px] font-bold text-green-700 bg-white/80 px-1.5 py-0.5 rounded">{item.finalSize}</span>
                  </>
                )}
                {item.status === 'error' && (
                  <>
                    <AlertCircle className="h-5 w-5 text-red-500 mb-1" />
                    <span className="text-[10px] font-semibold text-red-600 leading-tight">{item.errorMsg}</span>
                  </>
                )}
              </div>

              {/* Remove button */}
              <button 
                type="button"
                onClick={() => removeImage(item.id, false)}
                className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
