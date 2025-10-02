export function SpinningSquareDivider() {
  return (
    <div className="h-32 flex items-center justify-center bg-black relative">
      <div className="w-[60%] h-px bg-white absolute top-1/2"></div>
      <div className="w-12 h-12 md:w-16 md:h-16 bg-black border-2 border-white animate-spin" style={{ animationDuration: '10s' }}></div>
    </div>
  );
}
