import { MouseEvent, useEffect, useState, useRef} from "react";
import { Howl } from "howler";

/* So actually the main error I'm getting with this is that the html5 audiopool is exhausted, and just found a stack overflow thread that talks
about this error with Howler and suggested the solution is to do it using the native html audio tag, so could maybe try that unless someone else finds a solution */

const testUrl1 = 'https://res.cloudinary.com/ddj3xjxrc/video/upload/v1710529539/D.J._Poizen_Visits_Kool_Kyle_Side_A_ncjkhb.mp3'
const testUrl2 = `https://res.cloudinary.com/ddj3xjxrc/video/upload/v1710529445/podcast_mark-mendoza-podcast_1988-mixtape_1000413811719_ts9qep.mp3`


// Define the component
const TestPlayer  = () => {
  const channelMixtapes = [testUrl1, testUrl2]; // urls of audio files
  const [stream, setStream] = useState<Howl[]>([]) // current stream, array of howls created in useeffect
  const [streamIndex, setStreamIndex] = useState<number>(0) // stores the index of current mixTape in stream
  const durationRef = useRef<HTMLParagraphElement>(null) // ref to duration p element that will change
  const totalDurationRef = useRef<HTMLParagraphElement>(null) // ref to duration p that will show mixtapes total length
  const volumeRef = useRef<HTMLParagraphElement>(null) // ref to volume p that will show current vol


  useEffect(() => {
    // create stream array from mixTapes
    const generateStream = () => {
      const mixtapes: Howl[] = channelMixtapes.map((mixtape) => {
        // maps through urls and creates new howl obj for each mixtape url
        return new Howl({
          src: [mixtape],
          html5: true, // html 5 is better for large files
          onplay: function (this: Howl) { // defines callback function that runs onplay, must be function needs explicit this
            if (totalDurationRef.current) {
              // renders total duration in p element
              totalDurationRef.current.textContent = formatTime(Math.round(this.duration()));
            }
            if (volumeRef.current) {
              // renders default 100% volume
              volumeRef.current.textContent = (this.volume() * 100).toString()
            }
            const timerId = setInterval(() => {
              // handles the rendering of the currently elapsed time by updating every second
              if (this.playing()) {
                const currentTime = this.seek();
                // seek is property of howl, finds current point 
                if (durationRef.current) {
                  durationRef.current.textContent = formatTime(Math.round(currentTime));
                }
              }
            }, 1000);
            return () => clearInterval(timerId);
          }
        });
      });
      return mixtapes;
    };
    const generatedStream = generateStream();
    // set the state to the stream produced by above function
    setStream(generatedStream);
  }, []);
  
  // just to examine properties etc
  console.log(stream);

  // this all needs refactoring, was more to test and illustrate functionality, not DRY
  const handlePlayClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('play clicked')
    const currentMixtape = stream[streamIndex];
    if (!currentMixtape.playing()) {
      currentMixtape.play()
    }
  }

  const handlePauseClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('pause clicked')
    const currentMixtape = stream[streamIndex];
    if (currentMixtape.playing()) {
      currentMixtape.pause()
    }
  }

  const handleStopClick = (event: MouseEvent<HTMLButtonElement>) => {
    const currentMixtape = stream[streamIndex];
    console.log('stop clicked')
    if (currentMixtape.playing()) {
      currentMixtape.stop()
    }
  }

  const handleNextClick = (event: MouseEvent<HTMLButtonElement>) => {
    console.log('next clicked');
    // tried to do this with a currentMixtape state but didnt work as well
    const currentMixtape = stream[streamIndex];
    currentMixtape.stop();
    const newIndex = streamIndex + 1;
    setStreamIndex(newIndex);
    const newMixtape = stream[newIndex];
    console.log;(newMixtape)
    newMixtape.play();
  };

  // super ssimple time formatting util function
  const formatTime = (seconds: number) => {
    return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
  };  

  const handleVolumeUp = (event: MouseEvent<HTMLButtonElement>) => {  
    const currentMixtape = stream[streamIndex];
    if (currentMixtape.volume() === 1) { return } // cant go above 100
    const newVolume = currentMixtape.volume()+0.05;
    currentMixtape.volume(newVolume);
  }

  const handleVolumeDown = (event: MouseEvent<HTMLButtonElement>) => {  
    const currentMixtape = stream[streamIndex];
    if (currentMixtape.volume() === 0) { return } // cant go below 0
    const newVolume = currentMixtape.volume()-0.05;
    currentMixtape.volume(newVolume);
  }
  

  return (
    <div className="player">
      <h1>Channel #1</h1>
      <div className="progress-bar">
        <p ref={durationRef}></p><p ref={totalDurationRef}></p>
      </div>
      <div className="player-controls">
        <button type="button" onClick={handlePlayClick}>Play</button>
        <button type="button" onClick={handlePauseClick}>Pause</button>
        <button type="button" onClick={handleStopClick}>Stop</button>
        <button type="button" onClick={handleNextClick}>Next</button>
      </div>
      <div className="volume-controls">
        <p ref={volumeRef}></p>
        <button type="button">Mute</button>
        <button type="button" onClick={handleVolumeUp}>Volume Up</button>
        <button type="button" onClick={handleVolumeDown}>Volume Down</button>
      </div>
    </div>
  );
};

export default TestPlayer;
