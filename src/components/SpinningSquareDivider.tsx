export function SpinningSquareDivider({ reverse = false }: { reverse?: boolean; }) {
  return (
    <div className="h-32 flex items-center justify-center bg-black relative">
      <div className="w-[60%] h-px bg-white absolute top-1/2"></div>
      <div className="w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-white" style={{ animation: reverse ? 'spin-reverse 10s linear infinite' : 'spin 10s linear infinite' }}></div>
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes spin-reverse {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
