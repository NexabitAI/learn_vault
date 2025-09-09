// src/components/video-player/index.jsx
import { useCallback, useEffect, useRef, useState } from "react";
import ReactPlayer from "react-player";
import { Slider } from "../ui/slider";
import { Button } from "../ui/button";
import {
  Maximize,
  Minimize,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume2,
  VolumeX,
} from "lucide-react";

function VideoPlayer({
  width = "100%",
  height = "100%",
  url,
  onProgressUpdate,
  progressData,
}) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0); // 0..1
  const [duration, setDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const handlePlayAndPause = () => setPlaying((p) => !p);

  const handleProgress = (state) => {
    if (!seeking) setPlayed(state.played); // 0..1
  };

  const handleDuration = (d) => setDuration(d || 0);

  const handleRewind = () => {
    const t = playerRef?.current?.getCurrentTime?.() || 0;
    playerRef?.current?.seekTo(Math.max(0, t - 5));
  };

  const handleForward = () => {
    const t = playerRef?.current?.getCurrentTime?.() || 0;
    playerRef?.current?.seekTo(t + 5);
  };

  const handleToggleMute = () => setMuted((m) => !m);

  const handleSeekChange = (newValue) => {
    // Slider gives 0..100; convert to 0..1 for ReactPlayer
    const v = Array.isArray(newValue) ? newValue[0] : newValue;
    setPlayed(Math.max(0, Math.min(1, v / 100)));
    setSeeking(true);
  };

  const handleSeekMouseUp = () => {
    setSeeking(false);
    playerRef.current?.seekTo(played); // expects fraction 0..1
  };

  const handleVolumeChange = (newValue) => {
    const v = Array.isArray(newValue) ? newValue[0] : newValue;
    setVolume(Math.max(0, Math.min(1, v / 100)));
  };

  const pad = (s) => ("0" + s).slice(-2);

  const formatTime = (seconds) => {
    const date = new Date((seconds || 0) * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = pad(date.getUTCSeconds());
    return hh ? `${hh}:${pad(mm)}:${ss}` : `${mm}:${ss}`;
  };

  const handleFullScreen = useCallback(() => {
    if (!isFullScreen) {
      playerContainerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, [isFullScreen]);

  const handleMouseMove = () => {
    setShowControls(true);
    clearTimeout(controlsTimeoutRef.current);
    // keep controls visible longer when paused
    controlsTimeoutRef.current = setTimeout(
      () => setShowControls(false),
      playing ? 3000 : 5000
    );
  };

  // Keep controls visible when paused
  useEffect(() => {
    if (!playing) setShowControls(true);
  }, [playing]);

  useEffect(() => {
    const onFsChange = () => setIsFullScreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  useEffect(() => {
    if (played === 1 && typeof onProgressUpdate === "function") {
      onProgressUpdate({ ...progressData, progressValue: played });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [played]);

  // Keyboard shortcuts (Space: play/pause, M: mute, arrows seek)
  useEffect(() => {
    const onKey = (e) => {
      // ignore when typing in inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target.isContentEditable
      ) {
        return;
      }
      if (e.code === "Space") {
        e.preventDefault();
        handlePlayAndPause();
      } else if (e.key.toLowerCase() === "m") {
        handleToggleMute();
      } else if (e.key === "ArrowLeft") {
        handleRewind();
      } else if (e.key === "ArrowRight") {
        handleForward();
      } else if (e.key.toLowerCase() === "f") {
        handleFullScreen();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleFullScreen]);

  const currentTime = played * (duration || 0);

  return (
    <div
      ref={playerContainerRef}
      className={[
        "relative overflow-hidden",
        "rounded-[var(--radius)]",
        "shadow-[var(--shadow)]",
        "border border-[hsl(var(--border))]",
        "bg-[hsl(var(--card))]",
        "transition-all duration-300 ease-in-out",
        isFullScreen ? "w-screen h-screen" : "",
      ].join(" ")}
      style={{ width, height }}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
      onDoubleClick={handleFullScreen}
    >
      <ReactPlayer
        ref={playerRef}
        className="absolute inset-0"
        width="100%"
        height="100%"
        url={url}
        playing={playing}
        volume={volume}
        muted={muted}
        onProgress={handleProgress}
        onDuration={handleDuration}
        onEnded={() => setPlaying(false)}
      />

      {/* Controls overlay */}
      {showControls && (
        <div
          className={[
            "absolute inset-x-0 bottom-0",
            // soft gradient for readability
            "bg-gradient-to-t from-[hsl(var(--card))]/90 via-[hsl(var(--card))]/70 to-transparent",
            "px-4 pb-3 pt-8",
            "transition-opacity duration-300",
          ].join(" ")}
        >
          {/* Seek bar */}
          <Slider
            value={[Math.round(played * 100)]}
            max={100}
            step={0.1}
            onValueChange={handleSeekChange}
            onValueCommit={handleSeekMouseUp}
            className="w-full mb-3"
            aria-label="Seek"
          />

          <div className="flex items-center justify-between gap-3">
            {/* Left controls */}
            <div className="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon"
                onClick={handlePlayAndPause}
                aria-label={playing ? "Pause" : "Play"}
                title={playing ? "Pause" : "Play"}
              >
                {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </Button>

              <Button
                onClick={handleRewind}
                variant="ghost"
                size="icon"
                aria-label="Rewind 5 seconds"
                title="Rewind 5s"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>

              <Button
                onClick={handleForward}
                variant="ghost"
                size="icon"
                aria-label="Forward 5 seconds"
                title="Forward 5s"
              >
                <RotateCw className="h-5 w-5" />
              </Button>

              <Button
                onClick={handleToggleMute}
                variant="ghost"
                size="icon"
                aria-label={muted ? "Unmute" : "Mute"}
                title={muted ? "Unmute" : "Mute"}
              >
                {muted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>

              <div className="w-28">
                <Slider
                  value={[Math.round(volume * 100)]}
                  max={100}
                  step={1}
                  onValueChange={handleVolumeChange}
                  aria-label="Volume"
                />
              </div>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              <div className="text-xs md:text-sm font-medium text-[hsl(var(--foreground))] tabular-nums">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFullScreen}
                aria-label={isFullScreen ? "Exit full screen" : "Enter full screen"}
                title={isFullScreen ? "Exit full screen (F)" : "Full screen (F)"}
              >
                {isFullScreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VideoPlayer;
