import FileUploadButton from './FileUploadButton'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import React, { useState, useEffect, createContext } from 'react';
import Button from 'react-bootstrap/Button'

function App() {
  const [theme, setTheme] = useState('light');
  const toggleTheme = () => {
    console.log(theme)
    if (theme === 'light') {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };
  
  
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    /*
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
    */
   <>
    <div className={`App ${theme}`}>
      <Button variant={theme === 'light' ? "primary" : "dark"} onClick={toggleTheme}>Toggle Theme</Button>
    </div>
    <div>
      <FileUploadButton theme={theme}/>
    </div>
    </>
  );
}

export default App;
