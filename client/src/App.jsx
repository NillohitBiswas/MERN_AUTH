import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Header from './components/Header';
export default function App() {
  return (
 <BrowserRouter>
   {/* header */}
   <Header/>
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/About" element={<About />} />
     <Route path="/SignIn" element={<SignIn />} />
     <Route path="/SignUp" element={<SignUp />} />
     <Route path="/Profile" element={<Profile />} />
   </Routes>  
 </BrowserRouter>
  );
}
