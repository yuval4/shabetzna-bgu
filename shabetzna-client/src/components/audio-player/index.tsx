import PauseCircleIcon from "@mui/icons-material/PauseCircle";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import { IconButton } from "@mui/material";
import { useRef, useState } from "react";
import { useTrack } from "../../hooks/use-track";

interface Props {
  src: string;
}

const AudioPlayer = ({ src }: Props) => {
  const { trackEvent } = useTrack();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleTogglePlay = () => {
    trackEvent("easter_eggs", "nofiki_song", { setTo: isPlaying ? "pause" : "play", src });
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div>
      <audio ref={audioRef} src={src} onEnded={handleAudioEnded} />

      <IconButton onClick={handleTogglePlay}>
        {isPlaying ? <PauseCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
    </div>
  );
};

export default AudioPlayer;
