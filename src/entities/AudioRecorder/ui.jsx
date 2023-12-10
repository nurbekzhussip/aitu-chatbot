import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import { MediaRecorder } from "extendable-media-recorder";

const stream = await navigator.mediaDevices.getUserMedia({
  audio: true,
});

const audioContext = new AudioContext({ sampleRate: 16000 });
const { sampleRate } = audioContext;
const inputNode = audioContext.createMediaStreamSource(stream);

// const mediaStreamAudioSourceNode = new MediaStreamAudioSourceNode(
//   audioContext,
//   { mediaStream: stream }
// );

// Set the buffer size based on your requirements
const targetSize = 960; // 16k (frame rate) * 0.03s (30 ms) = 480 frames = 480 * 2 bytes (16bit pcm) = 960 bytes to send
const bufferSize = 1024; // here need value to be a power of 2,
const numChannels = 1;

const audioBuffer = audioContext.createBuffer(
  numChannels,
  bufferSize,
  sampleRate
);

const scriptNode = audioContext.createScriptProcessor(
  bufferSize,
  numChannels,
  numChannels
);

const mediaStreamAudioDestinationNode = new MediaStreamAudioDestinationNode(
  audioContext,
  {
    channelCount: numChannels,
  }
);
mediaStreamAudioSourceNode.connect(mediaStreamAudioDestinationNode);
const mediaRecorder = new MediaRecorder(mediaStreamAudioDestinationNode.stream);

const AudioRecorder = () => {
  const [recording, setRecording] = useState(false);
  const [mediaRecorderState, setMediaRecorderState] = useState(null);

  useEffect(() => {
    console.log({ sampleRate });
  }, []);
  const startRecording = async () => {
    try {
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        audioChunks.push(e.data);
        if (mediaRecorder.state == "inactive") {
          let blob = new Blob(audioChunks, { type: "audio/x-mpeg-3" });
          setMediaRecorderState(blob);
        }
      };

      mediaRecorder.start();
      setRecording(true);

      // const recorder = new ExtendableMediaRecorder(stream, {
      //   mimeType: "audio/wav", // Adjust the MIME type as needed
      // });
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  const playRecordedAudio = () => {
    console.log({ mediaRecorderState });
    if (mediaRecorderState) {
      const audioURL = URL.createObjectURL(mediaRecorderState);

      // Create an audio element dynamically to play the recorded audio
      const audio = new Audio(audioURL);
      audio.play();
    } else {
      console.log("No recorded audio available");
    }
  };

  return (
    <div>
      <h2>Audio Recorder</h2>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? "Stop Recording" : "Start Recording"}
      </button>
      <button onClick={playRecordedAudio}>Play Recorded Audio</button>
    </div>
  );
};

export default AudioRecorder;
