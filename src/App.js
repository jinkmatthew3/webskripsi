import { useState } from 'react';
import './App.css';
import NavbarComp from './component/navbar';
import Routes from './routes';


function App() {
  const [linkState, setLinkState] = useState("");

  return (
    <div>
      <NavbarComp linkState={linkState} />
      <Routes />
    </div>
  );
}

export default App;
