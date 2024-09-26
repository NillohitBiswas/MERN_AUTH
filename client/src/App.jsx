import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignUp from './pages/SignUp/SignUp';
import LogIn from './pages/Login/Login';
import Profile from './pages/Profile';
import Tracks from './pages/Tracks';
import Header from './components/Header/Header';
import PrivateRoute from './components/PrivateRoute';

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
     <Route path="/Tracks" element={<Tracks />} />
     <Route element = {<PrivateRoute/>}>
     <Route path="/Profile" element={<Profile />} />
     
     </Route>
   </Routes>  
 </BrowserRouter>
  );
}

export default App;
