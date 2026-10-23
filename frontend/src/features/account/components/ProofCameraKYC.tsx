import { useState, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import { Camera, CheckCircle2, AlertCircle, ShieldCheck, ArrowUpRight, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAuthStore } from '@/entities/user/useAuthStore';
import { toast } from 'sonner';

interface CCCDProofState {
  file: File | null;
  preview: string | null;
  isCompressing: boolean;
  progress: number;
  error: string | null;
}

const initialSlotState: CCCDProofState = {
  file: null,
  preview: null,
  isCompressing: false,
  progress: 0,
  error: null,
};

export function ProofCameraKYC() {
  const { updateTier } = useAuthStore();
  const [frontSlot, setFrontSlot] = useState<CCCDProofState>(initialSlotState);
  const [backSlot, setBackSlot] = useState<CCCDProofState>(initialSlotState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compress using Web Worker
  const handleCompress = useCallback(
    async (
      file: File,
      setSlot: React.Dispatch<React.SetStateAction<CCCDProofState>>
    ) => {
      try {
        setSlot((prev) => ({
          ...prev,
          isCompressing: true,
          progress: 0,
          error: null,
        }));

        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          onProgress: (p: number) => {
            setSlot((prev) => ({ ...prev, progress: p }));
          },
        };

        const compressed = await imageCompression(file, options);
        const previewUrl = URL.createObjectURL(compressed);

        setSlot({
          file: compressed,
          preview: previewUrl,
          isCompressing: false,
          progress: 100,
          error: null,
        });
      } catch (err) {
        console.error('Lỗi nén ảnh:', err);
        setSlot((prev) => ({
          ...prev,
          isCompressing: false,
          error: 'Không thể xử lý ảnh. Vui lòng thử lại.',
        }));
      }
    },
    []
  );

  const handleSubmit = async () => {
    if (!frontSlot.file || !backSlot.file) {
      toast.error('Vui lòng chụp đủ cả CCCD Mặt trước và Mặt sau');
      return;
    }

    setIsSubmitting(true);
    // Simulate 2 seconds AI e-KYC checking
    setTimeout(() => {
      setIsSubmitting(false);
      updateTier('C2');
      toast.success('Đang chờ Admin duyệt', {
        description: 'Hệ thống AI e-KYC tự động xác thực danh tính thành công! Tài khoản của bạn đã nâng cấp lên C2 Verified.',
        duration: 5000,
      });
    }, 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-primary-200/80 shadow-sm p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary-100 text-primary-600 text-xs font-bold">
              AI
            </span>
            <h3 className="text-base font-bold text-gray-900">
              Xác minh danh tính (C2 Verified) bằng ProofCamera
            </h3>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Chụp 2 mặt Căn cước công dân gắn chip để mở khóa giới hạn cọc và tăng hạn mức hợp đồng
          </p>
        </div>

        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0">
          <ShieldCheck className="h-4 w-4" />
          <span>Bảo mật chuẩn ISO/IEC 27001</span>
        </div>
      </div>

      {/* Two Upload Cards: Front & Back */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Front */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between">
            <span>1. CCCD Mặt trước</span>
            {frontSlot.file && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Đã tối ưu hóa
              </span>
            )}
          </label>

          <div className="relative min-h-[160px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-400 bg-gray-50/70 p-4 flex flex-col items-center justify-center transition-all">
            {frontSlot.preview ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img
                  src={frontSlot.preview}
                  alt="CCCD Mặt trước"
                  className="w-full h-36 object-cover rounded-lg shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setFrontSlot(initialSlotState)}
                  className="mt-2 text-xs text-primary-600 hover:underline font-semibold"
                >
                  Chụp lại ảnh khác
                </button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                {frontSlot.isCompressing ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 mb-2">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - frontSlot.progress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-600">
                        {Math.round(frontSlot.progress)}%
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 animate-pulse">
                      Đang tối ưu hóa...
                    </span>
                    <span className="text-[10px] text-gray-400">Web Worker Image Compression</span>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-gray-200 mb-2">
                      <Camera className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      Chụp hoặc tải ảnh CCCD Mặt trước
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Rõ số, không lóa sáng, ảnh &lt;500KB
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  disabled={frontSlot.isCompressing}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCompress(f, setFrontSlot);
                  }}
                />
              </label>
            )}
            {frontSlot.error && (
              <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {frontSlot.error}
              </p>
            )}
          </div>
        </div>

        {/* Back */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wide flex items-center justify-between">
            <span>2. CCCD Mặt sau</span>
            {backSlot.file && (
              <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> Đã tối ưu hóa
              </span>
            )}
          </label>

          <div className="relative min-h-[160px] rounded-xl border-2 border-dashed border-gray-200 hover:border-primary-400 bg-gray-50/70 p-4 flex flex-col items-center justify-center transition-all">
            {backSlot.preview ? (
              <div className="relative w-full h-full flex flex-col items-center">
                <img
                  src={backSlot.preview}
                  alt="CCCD Mặt sau"
                  className="w-full h-36 object-cover rounded-lg shadow-xs"
                />
                <button
                  type="button"
                  onClick={() => setBackSlot(initialSlotState)}
                  className="mt-2 text-xs text-primary-600 hover:underline font-semibold"
                >
                  Chụp lại ảnh khác
                </button>
              </div>
            ) : (
              <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer py-4">
                {backSlot.isCompressing ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-12 h-12 mb-2">
                      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 48 48">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          fill="none"
                          stroke="#4F46E5"
                          strokeWidth="4"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - backSlot.progress / 100)}`}
                          strokeLinecap="round"
                          className="transition-all duration-300"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-primary-600">
                        {Math.round(backSlot.progress)}%
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-primary-600 animate-pulse">
                      Đang tối ưu hóa...
                    </span>
                    <span className="text-[10px] text-gray-400">Web Worker Image Compression</span>
                  </div>
                ) : (
                  <>
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-gray-200 mb-2">
                      <Camera className="h-6 w-6 text-primary-600" />
                    </div>
                    <span className="text-xs font-bold text-gray-800">
                      Chụp hoặc tải ảnh CCCD Mặt sau
                    </span>
                    <span className="text-[11px] text-gray-400 mt-0.5">
                      Rõ chip, mã vạch MRZ và dấu vân tay
                    </span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  disabled={backSlot.isCompressing}
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleCompress(f, setBackSlot);
                  }}
                />
              </label>
            )}
            {backSlot.error && (
              <p className="text-[11px] text-red-500 mt-2 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" /> {backSlot.error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Perks pill */}
      <div className="p-3 rounded-lg bg-indigo-50/70 border border-indigo-100 flex items-center justify-between text-xs text-indigo-900">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary-600 shrink-0" />
          <span>Lợi ích sau khi xác minh C2: <strong>Giảm ngay 10% tiền cọc</strong> (từ 40% xuống 30%) và nâng hạn mức thuê lên 5 hợp đồng cùng lúc.</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          onClick={handleSubmit}
          loading={isSubmitting}
          disabled={!frontSlot.file || !backSlot.file || isSubmitting}
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6"
        >
          <ArrowUpRight className="h-4 w-4 mr-1.5" />
          Gửi xác minh
        </Button>
      </div>
    </div>
  );
}
