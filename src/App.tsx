import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMusic } from "@fortawesome/free-solid-svg-icons";
import { ClipTypes, audioClips, DrumpadProps } from "./interfaces";

export default function App() {
  const [volume, setVolume] = useState<number>(0.5);

  useEffect(() => {
    const handleKeyPress = (e: { key: string }) => {
      const clipToPlay = audioClips.find(
        (clip) => clip.keyTrigger === e.key.toUpperCase()
      );

      if (clipToPlay) {
        playAudio(clipToPlay, volume);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [volume, audioClips]);

  const playAudio = (selector: ClipTypes, volume: number) => {
    const audio = document.getElementById(
      selector.keyTrigger
    ) as HTMLAudioElement;
    if (audio) {
      if (volume >= 0 && volume <= 1) {
        audio.volume = volume;
      }
      audio.currentTime = 0;
      audio.play().catch(console.error);

      document.getElementById("display")!.innerText = selector.description;
    }
  };

  const DrumPad = ({ audioClips }: DrumpadProps) => {
    return (
      <button
        className="drum-pad font-semibold rounded text-zinc-800 bg-zinc-200 flex justify-center items-center shadow-md shadow-zinc-900 cursor-pointer select-none transform transition-transform active:shadow-inner active:shadow-zinc-900 active:bg-zinc-300"
        id={`drum-${audioClips.keyTrigger}`}
        onClick={() => playAudio(audioClips, volume)}
      >
        <audio
          className="clip"
          id={audioClips.keyTrigger}
          src={audioClips.url}
        />
        {audioClips.keyTrigger}
      </button>
    );
  };

  return (
    <>
      <div className=" w-screen h-screen flex flex-col justify-center items-center font-mono">
        <div
          id="drum-machine"
          className=" border-8 border-zinc-700 bg-zinc-600 box-border flex flex-col items-center "
        >
          <h1 className=" font-extrabold text-4xl my-3 ml-4 mr-3 w-[350px] text-zinc-200 bg-zinc-500 px-3 py-1 text-center">
            <FontAwesomeIcon
              icon={faMusic}
              className=" text-zinc-200 text-4xl float-left rotate-[10deg]"
            />{" "}
            Soundboard{" "}
            <FontAwesomeIcon
              icon={faMusic}
              className=" text-zinc-200 text-4xl float-right rotate-[10deg]"
            />
          </h1>

          <div id="grid-and-doodads-wrapper" className="flex flex-row">
            <div
              id="grid-wrapper"
              className="bg-zinc-500 w-[500px] h-[500px] grid grid-cols-3 gap-3 box-border m-3 mr-40 p-3 border-zinc-400"
            >
              {audioClips.map((clip) => (
                <DrumPad key={clip.description} audioClips={clip} />
              ))}
            </div>
            <div
              id="doodads"
              className="bg-zinc-500 w-[250px] h-[500px] box-border m-3 border-[0.75rem] border-zinc-500 flex flex-col"
            >
              <div
                id="display"
                className=" bg-zinc-300 mb-16 font-semibold text-zinc-800 h-10 flex items-center justify-center border-2 border-zinc-700 shadow-inner shadow-zinc-900 cursor-default"
              ></div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className=" transform -rotate-90 origin-top-left rounded cursor-pointer appearance-none w-[100px] h-[7px] border-transparent relative top-14 left-48 bg-zinc-300"
              />
              <div className="bg-zinc-300 mb-16 relative left-7 bottom-5 font-semibold text-zinc-800 h-10 w-32 flex items-center justify-center border-2 border-zinc-700 shadow-inner shadow-zinc-900 cursor-default">
                Volume: {Math.round(volume * 100)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
