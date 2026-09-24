import { useEffect, useState, useMemo } from 'react';

interface AuthEyesMascotProps {
  focusedField: 'email' | 'password' | null;
  emailLength: number;
  showPassword: boolean;
  className?: string;
}

export function AuthEyesMascot({
  focusedField,
  emailLength,
  showPassword,
  className = '',
}: AuthEyesMascotProps) {
  const [naturalBlink, setNaturalBlink] = useState(false);

  // Natural idle blink effect
  useEffect(() => {
    if (focusedField !== null) return;
    const interval = setInterval(() => {
      setNaturalBlink(true);
      setTimeout(() => setNaturalBlink(false), 160);
    }, 4200);
    return () => clearInterval(interval);
  }, [focusedField]);

  // Compute pupil position based on input state
  const { pupilX, pupilY, squint, shocked } = useMemo(() => {
    if (focusedField === 'email') {
      // Track input from left to right (-14px to +14px)
      const mappedX = Math.min(Math.max((emailLength - 10) * 1.1, -14), 14);
      return { pupilX: mappedX, pupilY: 7, squint: false, shocked: false };
    }

    if (focusedField === 'password') {
      if (showPassword) {
        // Shocked state: eyes wide open, pupils shiver slightly
        return { pupilX: 0, pupilY: 1, squint: false, shocked: true };
      } else {
        // Peeking / squinting mischievously ("nhìn lỏm")
        return { pupilX: 10, pupilY: 5, squint: true, shocked: false };
      }
    }

    // Idle
    return { pupilX: 0, pupilY: 0, squint: false, shocked: false };
  }, [focusedField, emailLength, showPassword]);

  // Speech bubble prompt text
  const speechText = useMemo(() => {
    if (focusedField === 'email') {
      if (emailLength === 0) return 'Đang chờ bạn nhập email...';
      return 'Dõi theo từng ký tự email nè 👀';
    }
    if (focusedField === 'password') {
      if (showPassword) return 'Ối! Bạn đang để lộ mật khẩu kìa! 😱';
      return 'Suỵt... tui đang nhìn lỏm mật khẩu đó nha 🤫';
    }
    return 'Xin chào! Trợ lý an toàn RentalShop bảo vệ bạn 🔐';
  }, [focusedField, emailLength, showPassword]);

  return (
    <div className={`flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble badge */}
      <div 
        className={`mb-2.5 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 shadow-sm border ${
          shocked 
            ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse' 
            : squint 
            ? 'bg-purple-500/15 text-purple-300 border-purple-500/30' 
            : 'bg-slate-800/80 text-slate-300 border-slate-700/60'
        }`}
      >
        <span>{speechText}</span>
      </div>

      {/* 3D Mascot Robotic Head Frame */}
      <div className="relative flex items-center justify-center p-3 rounded-2xl bg-gradient-to-b from-slate-800 via-slate-850 to-slate-900 border border-slate-700/70 shadow-lg shadow-black/30">
        {/* Subtle top bevel highlight */}
        <div className="absolute top-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent" />

        {/* Ambient eye glow */}
        <div className={`absolute -inset-1 rounded-2xl blur-md transition-all duration-500 -z-10 ${
          shocked ? 'bg-amber-500/25' : squint ? 'bg-purple-500/25' : 'bg-cyan-500/15'
        }`} />

        {/* Eye Pair Container */}
        <div className="flex items-center gap-3 px-2 py-0.5">
          {/* Left Eye */}
          <div className="relative w-12 h-12 rounded-full bg-slate-100 shadow-[inset_0_3px_6px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center">
            {/* Sclera inner depth */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-200/80 to-transparent pointer-events-none" />

            {/* Pupil */}
            <div
              className={`relative rounded-full bg-slate-950 flex items-center justify-center transition-transform duration-150 ${
                shocked 
                  ? 'w-5 h-5 scale-90' 
                  : squint 
                  ? 'w-6 h-6' 
                  : 'w-6 h-6'
              }`}
              style={{
                transform: `translate(${pupilX}px, ${pupilY}px)`,
              }}
            >
              {/* Iris cyan neon ring */}
              <div className="absolute inset-0 rounded-full ring-2 ring-cyan-400/50" />

              {/* Main catchlight */}
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white shadow-sm" />
              {/* Secondary catchlight */}
              <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-white/70" />
            </div>

            {/* Upper Eyelid */}
            <div
              className={`absolute top-0 left-0 right-0 bg-slate-850 rounded-b-2xl transition-all duration-200 z-10 ${
                squint
                  ? 'h-[60%] border-b-2 border-slate-950'
                  : naturalBlink
                  ? 'h-full'
                  : shocked
                  ? 'h-0'
                  : 'h-0'
              }`}
              style={
                shocked
                  ? { animation: 'mascotShockBlink 0.32s ease-in-out infinite' }
                  : undefined
              }
            />

            {/* Lower Eyelid */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-slate-850 rounded-t-2xl transition-all duration-200 z-10 ${
                squint
                  ? 'h-[25%] border-t border-slate-950'
                  : naturalBlink
                  ? 'h-full'
                  : 'h-0'
              }`}
            />
          </div>

          {/* Right Eye */}
          <div className="relative w-12 h-12 rounded-full bg-slate-100 shadow-[inset_0_3px_6px_rgba(0,0,0,0.25)] overflow-hidden flex items-center justify-center">
            {/* Sclera inner depth */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-slate-200/80 to-transparent pointer-events-none" />

            {/* Pupil */}
            <div
              className={`relative rounded-full bg-slate-950 flex items-center justify-center transition-transform duration-150 ${
                shocked 
                  ? 'w-5 h-5 scale-90' 
                  : squint 
                  ? 'w-6 h-6' 
                  : 'w-6 h-6'
              }`}
              style={{
                transform: `translate(${pupilX}px, ${pupilY}px)`,
              }}
            >
              {/* Iris cyan neon ring */}
              <div className="absolute inset-0 rounded-full ring-2 ring-cyan-400/50" />

              {/* Main catchlight */}
              <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white shadow-sm" />
              {/* Secondary catchlight */}
              <div className="absolute bottom-1 left-1 w-1 h-1 rounded-full bg-white/70" />
            </div>

            {/* Upper Eyelid */}
            <div
              className={`absolute top-0 left-0 right-0 bg-slate-850 rounded-b-2xl transition-all duration-200 z-10 ${
                squint
                  ? 'h-[60%] border-b-2 border-slate-950'
                  : naturalBlink
                  ? 'h-full'
                  : shocked
                  ? 'h-0'
                  : 'h-0'
              }`}
              style={
                shocked
                  ? { animation: 'mascotShockBlink 0.32s ease-in-out infinite' }
                  : undefined
              }
            />

            {/* Lower Eyelid */}
            <div
              className={`absolute bottom-0 left-0 right-0 bg-slate-850 rounded-t-2xl transition-all duration-200 z-10 ${
                squint
                  ? 'h-[25%] border-t border-slate-950'
                  : naturalBlink
                  ? 'h-full'
                  : 'h-0'
              }`}
            />
          </div>
        </div>
      </div>

      <style>{`
        @keyframes mascotShockBlink {
          0%, 100% { height: 0%; }
          35% { height: 85%; }
          55% { height: 0%; }
          75% { height: 80%; }
        }
      `}</style>
    </div>
  );
}
