import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp';
import LogIn from './pages/Login';
import Profile from './pages/Profile';
import Header from './components/Header/Header';

 function App() {
  return (
 <BrowserRouter>
   {/* header */}
   <Header/>
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/About" element={<About />} />
     <Route path="/SignUp" element={<SignUp />} />
     <Route path="/Login" element={<LogIn />} />
     <Route path="/Profile" element={<Profile />} />
   </Routes>  
 </BrowserRouter>
  );
}

export default App;
