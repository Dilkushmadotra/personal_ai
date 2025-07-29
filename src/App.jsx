import React, { useContext } from 'react';
import './App.css';
import va from './assets/ai.png';
import { CiMicrophoneOn } from 'react-icons/ci';
import { datacontext } from './context/usercontext';
import speakimg from './assets/speak.gif';
import aigif from './assets/aiVoice.gif';

function App() {
  const {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    response,
    setPrompt,
    setResponse,
  } = useContext(datacontext);

  return (
    <div className='main'>
      <img src={va} alt='VA' id='shifra' />
      <span>I'm Shifra, Your Advanced Virtual Assistant</span>

      {!speaking ? (
        <button
          onClick={() => {
            setPrompt('Listening...');
            setSpeaking(true);
            setResponse(false);
            recognition.start();
          }}
        >
          Click here <CiMicrophoneOn />
        </button>
      ) : (
        <div className='response'>
          {!response ? (
            <img src={speakimg} alt='Speaking...' id='speak' />
          ) : (
            <img src={aigif} alt='AI Response' id='aigif' />
          )}
          <p>{prompt}</p>
        </div>
      )}
    </div>
  );
}

export default App;
