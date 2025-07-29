// backend/server.js
const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Route 1: Open predefined apps
app.post('/open-app', (req, res) => {
  const { app } = req.body;

  const allowedApps = {
    notepad: 'notepad',
    calculator: 'calc',
    chrome: 'start chrome',
    vscode: 'code',
    documents: 'start "" "%USERPROFILE%\\Documents"',
    downloads: 'start "" "%USERPROFILE%\\Downloads"',
  };

  const command = allowedApps[app.toLowerCase()];
  
  if (!command) {
    return res.status(400).json({ message: `App '${app}' is not allowed.` });
  }

  exec(command, { shell: 'cmd.exe' }, (err) => {
    if (err) {
      console.error('Error opening app:', err);
      return res.status(500).json({ message: 'Failed to open app.' });
    }
    res.json({ message: `${app} opened successfully.` });
  });
});

// ✅ Route 2: Open any path or executable (USE CAUTION)
app.post('/open-any', (req, res) => {
  const { path } = req.body;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ message: 'No path provided or invalid format.' });
  }

  // Enclose path in quotes to support spaces in folder names
  const command = `start "" "${path}"`;

  exec(command, { shell: 'cmd.exe' }, (err) => {
    if (err) {
      console.error('Error opening custom path:', err);
      return res.status(500).json({ message: 'Failed to open the specified path.' });
    }
    res.json({ message: `Opened: ${path}` });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
