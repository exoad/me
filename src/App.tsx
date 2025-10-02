import { useState } from 'react';
import strings from "./data/strings.json";
import { SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiMysql, SiAndroid, SiLlvm, SiPython } from 'react-icons/si';
import { SpinningSquareDivider } from './components/SpinningSquareDivider';

export function App() {
  const [nameIndex, setNameIndex] = useState(0);
  return (
    <div className="relative select-none">
      <header className="w-full fixed top-0 z-50 backdrop-blur-xs bg-black/46">
        <div className="flex justify-between items-center" style={{ padding: '0.5rem 4rem' }}>
          <button
            className="text-white text-lg md:text-xl font-light cursor-pointer bg-transparent border-none"
            style={{ fontFamily: 'Playfair Display' }}
            type="button"
            onClick={() => setNameIndex((nameIndex + 1) % strings.header.names_funny.length)}
          >
            {strings.header.names_funny[nameIndex]}
          </button>
          <nav className="flex gap-6 md:gap-12">
            <button className="bg-transparent border-none text-white text-sm md:text-base font-light py-2 px-3 md:px-6 cursor-pointer" style={{ fontFamily: 'Montserrat' }}>
              HOME
            </button>
            <button className="bg-transparent border-none text-white text-sm md:text-base font-light py-2 px-3 md:px-6 cursor-pointer" style={{ fontFamily: 'Montserrat' }}>
              PROJECTS
            </button>
            <button className="bg-transparent border-none text-white text-sm md:text-base font-light py-2 px-3 md:px-6 cursor-pointer" style={{ fontFamily: 'Montserrat' }}>
              SOCIALS
            </button>
          </nav>
        </div>
      </header>
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-4 sm:px-8 md:px-16">
        <div className="flex flex-col items-center justify-center gap-12">
          <h1
            className="text-white text-6xl font-bold"
            style={{ fontFamily: 'Playfair Display' }}
          >
            Jiaming Meng
          </h1>
          <div className="w-[8rem] h-px bg-white"></div>
          <div className="overflow-hidden" style={{ height: '2rem' }}>
            <div
              className="flex flex-col"
              style={{
                animation: 'subtitlesRollAnim 17s ease-in-out infinite',
                fontFamily: 'Montserrat'
              }}
            >
              {[...strings.pages.home.subtitles, strings.pages.home.subtitles[0]].map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className="text-white text-xl font-light text-center"
                  style={{ height: '2rem', lineHeight: '2rem' }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes subtitlesRollAnim {
              ${(() => {
              const stepPercentage = 80 / strings.pages.home.subtitles.length;
              let keyframes = '0% { transform: translateY(0); }\n';
              for (let i = 0; i < strings.pages.home.subtitles.length; i++) {
                const pauseStart = 10 + (i * stepPercentage);
                keyframes += `${pauseStart}% { transform: translateY(-${i * 2}rem); }\n`;
                if (i < strings.pages.home.subtitles.length - 1) {
                  keyframes += `${pauseStart + (stepPercentage * 0.8)}% { transform: translateY(-${(i + 1) * 2}rem); }\n`;
                }
              }
              keyframes += `100% { transform: translateY(-${strings.pages.home.subtitles.length * 2}rem); }`;
              return keyframes;
            })()}
            }
          `}</style>
        </div>
      </div>
      <SpinningSquareDivider />
      <div className="min-h-screen flex items-center justify-center bg-black px-4 sm:px-8 md:px-16 py-8">
        <div className=" flex flex-col md:flex-row items-center md:gap-16 gap-8 w-full max-w-6xl">
          <img
            src="/profile.jpg"
            alt="Jiaming Meng"
            className="w-48 h-48 md:w-64 md:h-64 object-cover"
            draggable={false}
          />
          <div className="w-px h-16 md:h-24 bg-white"></div>
          <div className="flex flex-col md:items-start md:text-left text-center items-center max-w-4xl w-full gap-6">
            <h1
              className="text-white text-3xl md:text-5xl lg:text-7xl font-bold"
              style={{ fontFamily: 'Playfair Display' }}
            >
              About Me
            </h1>
            <p className="text-white text-base md:text-lg leading-relaxed" style={{ fontFamily: 'Montserrat' }}>
              {strings.pages.home.about.content}
            </p>
            <div className="mt-8 flex flex-col gap-4">
              <h2 className="text-white text-2xl font-bold" style={{ fontFamily: 'Playfair Display' }}>My Toolkit</h2>
              <div className="flex flex-wrap gap-4 justify-start">
                {(() => {
                  const icons = [SiC, SiCplusplus, SiDart, SiFlutter, SiKotlin, SiOpenjdk, SiLlvm, SiMysql, SiAndroid, SiPython];
                  return ["C", "C++", "Dart", "Flutter", "Kotlin", "Java", "LLVM", "MySQL", "Jetpack Compose", "Python"].map((item, index) => {
                    const Icon = icons[index];
                    return (
                      <div key={item} className="flex items-center gap-2">
                        <Icon className="text-white text-xs" />
                        <span className="text-white text-sm" style={{ fontFamily: 'Montserrat' }}>{item}</span>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-black text-white text-center" style={{ fontFamily: 'Montserrat' }}>
        (C) 2025 Jiaming Meng
      </footer>
    </div>
  );
}

