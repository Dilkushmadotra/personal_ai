import React, { createContext, useState, useEffect } from 'react';
import run from '../gemini';

export const datacontext = createContext();

function UserContext({ children }) {
  const [speaking, setSpeaking] = useState(false);
  const [prompt, setPrompt] = useState('listening...');
  const [response, setResponse] = useState(false);
  const [voice, setVoice] = useState(null);

  const aiName = "Sifra";

  useEffect(() => {
    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', 'Dilkush Ror');
    }

    const synth = window.speechSynthesis;
    const loadVoices = () => {
      const voices = synth.getVoices();
      const femaleVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes('female') ||
          v.name.toLowerCase().includes('zira') ||
          v.name.toLowerCase().includes('samantha') ||
          v.gender === 'female'
      );
      setVoice(femaleVoice || voices[0]);
    };

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }
    loadVoices();
  }, []);

  function speak(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.volume = 1;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.lang = 'en-US';
    if (voice) utterance.voice = voice;
    window.speechSynthesis.speak(utterance);
  }

  async function aiResponse(prompt) {
    let text = await run(prompt);
    let newText = text
      .replace(/\*\*/g, '')
      .replace(/\*/g, '')
      .replace(/google/gi, localStorage.getItem('username') || 'User');

    setPrompt(newText);
    speak(newText);
    setResponse(true);
    setTimeout(() => setSpeaking(false), 5000);
  }

  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();

  recognition.onresult = (e) => {
    let currentIndex = e.resultIndex;
    let transcript = e.results[currentIndex][0].transcript.toLowerCase();
    setPrompt(transcript);
    takeCommand(transcript);
  };

  function callOpenApp(appName) {
    fetch('http://localhost:5000/open-app', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ app: appName }),
    })
      .then((res) => res.json())
      .then((data) => {
        speak(data.message);
        setPrompt(data.message);
      })
      .catch((err) => {
        console.error('Error:', err);
        speak('Failed to open the application.');
        setPrompt('Failed to open the application.');
      });
  }

  async function getWeather(city = 'Delhi') {
    const apiKey = 'fece2ac4ffec0ff39e4deff5c13acaa6';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
      const res = await fetch(url);
      const data = await res.json();

      if (data.cod !== 200) {
        const msg = "Sorry, I couldn't fetch the weather.";
        speak(msg);
        setPrompt(msg);
        return;
      }

      const temp = data.main.temp;
      const desc = data.weather[0].description;
      const msg = `The weather in ${city} is ${desc} with a temperature of ${temp}°C.`;

      speak(msg);
      setPrompt(msg);
    } catch (error) {
      console.error('Weather error:', error);
      speak("Failed to get weather.");
      setPrompt("Failed to get weather.");
    }
  }

  function takeCommand(command) {
    const userName = localStorage.getItem('username') || 'User';

    const greetings = [
      'hey sifra',
      'hi sifra',
      'hello sifra',
      'good morning sifra',
      'good evening sifra',
    ];

    if (greetings.some(greet => command.includes(greet))) {
      const reply = `Hello ${userName}! How can I help you today?`;
      speak(reply);
      setPrompt(reply);
      setResponse(true);
      return;
    }

    // Handle weather
    if (command.includes('weather')) {
      const match = command.match(/weather in ([a-zA-Z\s]+)/);
      const city = match ? match[1].trim() : 'Delhi';
      getWeather(city);
      return;
    }

    if (command.includes("your name") || command.includes("who are you")) {
      const reply = `I am ${aiName}, your smart assistant.`;
      speak(reply);
      setPrompt(reply);
    } else if (command.includes("my name") || command.includes("who am i")) {
      const reply = `You are ${userName}, my creator.`;
      speak(reply);
      setPrompt(reply);
    } else if (command.includes('open') && command.includes('notepad')) {
      callOpenApp('notepad');
    } else if (command.includes('open') && command.includes('calculator')) {
      callOpenApp('calculator');
    } else if (command.includes('open') && command.includes('chrome')) {
      callOpenApp('chrome');
    } else if (command.includes('open') && command.includes('vscode')) {
      callOpenApp('vscode');
    } else if (command.includes('open') && command.includes('downloads')) {
      callOpenApp('downloads');
    } else if (command.includes('open') && command.includes('documents')) {
      callOpenApp('documents');
    } else if (command.includes('open') && command.includes('youtube')) {
      window.open('https://www.youtube.com/', '_blank');
      speak('Opening YouTube');
      setPrompt('Opening YouTube...');
    } else if (command.includes('open') && command.includes('google')) {
      window.open('https://www.google.com/', '_blank');
      speak('Opening Google');
      setPrompt('Opening Google...');
    } else if (command.includes('open') && command.includes('instagram')) {
      window.open('https://www.instagram.com/', '_blank');
      speak('Opening Instagram');
      setPrompt('Opening Instagram...');
    } else if (command.includes('time')) {
      let time = new Date().toLocaleString(undefined, {
        hour: 'numeric',
        minute: 'numeric',
      });
      speak(time);
      setPrompt(time);
    } else if (command.includes('date')) {
      let date = new Date().toLocaleString(undefined, {
        day: 'numeric',
        month: 'short',
      });
      speak(date);
      setPrompt(date);
    } else {
      aiResponse(command);
      return;
    }

    setResponse(true);
    setTimeout(() => {
      setSpeaking(false);
    }, 5000);
  }

  const value = {
    recognition,
    speaking,
    setSpeaking,
    prompt,
    setPrompt,
    response,
    setResponse,
  };

  return (
    <datacontext.Provider value={value}>
      {children}
    </datacontext.Provider>
  );
}

export default UserContext;


function callOpenApp(appName) {
  fetch('http://localhost:5000/open-app', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ app: appName }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log('Response:', data);
      speak(data.message); // ✅ NOW it's in scope
      setPrompt(data.message);
    })
    .catch((err) => {
      console.error('Error:', err);
      speak('Failed to open the application.');
    });
}
