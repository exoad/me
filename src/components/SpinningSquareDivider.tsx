import "../styles/SpinningSquareDivider.css";

export default function SpinningSquareDivider({ reverse = false, includeLine = true }: Readonly<{ reverse?: boolean; includeLine?: boolean; }>) {
  return (
    <div className="h-32 flex items-center justify-center bg-gb-bg0-hard relative">
      {includeLine ? <div className="w-[60%] h-px bg-gb-fg2 absolute top-1/2" /> : <></>}
      <div className="w-8 h-8 md:w-10 md:h-10 bg-gb-bg0-hard border-2 border-gb-fg2" style={{ animation: reverse ? 'spin-rev 10s linear infinite' : 'spin 10s linear infinite' }} />
    </div>
  );
}
