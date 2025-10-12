import "../styles/SpinningSquareDivider.css";

export default function SpinningSquareDivider({ reverse = false, includeLine = true }: Readonly<{ reverse?: boolean; includeLine?: boolean; }>) {
  return (
    <div className="h-32 flex items-center justify-center bg-black relative">
      {includeLine ? <div className="w-[60%] h-px bg-white absolute top-1/2" /> : <></>}
      <div className="w-8 h-8 md:w-10 md:h-10 bg-black border-2 border-white" style={{ animation: reverse ? 'spin-rev 10s linear infinite' : 'spin 10s linear infinite' }} />
    </div>
  );
}
