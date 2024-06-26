import React from 'react';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom';
import Home from './pages/Home';
import Userdata from "./pages/Userdata";
import Team from "./pages/team";


function App() {
  return (
      <>
        <Router>
          <Navbar/>
            <Routes>
                <Route path='/' element={<Home/>} />
                <Route path='/Userdata' element={<Userdata/>} />
                <Route path='/Team' element={<Team/>} />
            </Routes>
        </Router>
      </>
  );
}

export default App;
