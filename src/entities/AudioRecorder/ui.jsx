import { render } from "preact";
import { useState, useEffect } from "preact/hooks";
import useWebSocket from "react-use-websocket";

const convertAudioBufferToPCM = (interleavedData) => {
  const length = interleavedData.length;
  const outputData = new Int16Array(length);

  for (let i = 0; i < length; i++) {
    outputData[i] = Math.min(1.0, interleavedData[i]) * 0x7fff; // Convert to 16-bit PCM
  }
  return outputData.buffer;
};

const AudioRecorder = ({ isStopSending, handleMessage, handleError }) => {
  const { sendMessage, lastMessage, readyState, getWebSocket } = useWebSocket(
    "ws://10.219.89.249:8080",
    {
      onOpen: () => console.log("onOpen"),
      onClose: () => console.log("onClose"),
      onMessage: (message) => {
        handleMessage(message?.data);
        console.log("onMessage: ", message);
      },
      onError: () => {
        handleError();
        console.log("onError");
      },
    }
  );

  console.log({ readyState });

  const handleSendMessage = (data) => {
    if (!isStopSending) {
      sendMessage(data);
    }
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(function (stream) {
        // Access the audio stream from the microphone
        const audioContext = new AudioContext({
          sampleRate: 16000,
        });
        const audioInput = audioContext.createMediaStreamSource(stream);

        // Create a ScriptProcessorNode to process audio data
        const bufferSize = 512;
        const numChannels = 1;

        const scriptNode = audioContext.createScriptProcessor(
          bufferSize,
          numChannels,
          numChannels
        );

        // Connect the audio input to the ScriptProcessorNode
        audioInput.connect(scriptNode);
        scriptNode.connect(audioContext.destination);

        // Handle audio data when available
        scriptNode.onaudioprocess = function (event) {
          const audioData = event.inputBuffer.getChannelData(0); // Get audio buffer data
          const raw_pcm_data = convertAudioBufferToPCM(audioData);
          handleSendMessage(raw_pcm_data); // Send audio buffer through WebSocket
        };
      })
      .catch(function (err) {
        console.error("Error accessing microphone:", err);
      });

    return () => {
      getWebSocket().close();
    };
  }, []);

  return <></>;
};

export default AudioRecorder;
