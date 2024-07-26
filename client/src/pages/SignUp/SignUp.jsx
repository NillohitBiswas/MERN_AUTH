import {Link, useNavigate} from 'react-router-dom';
import Particlescomp from '../../components/Particles';
import './SignUp.css';
import { useState } from 'react';
import OAuth from '../../components/OAuth';
function SignUp() {
  const [ formData, setFormData ] = useState({})
  const [error, setError] = useState(false)
  const [emailInvalid, setEmailInvalid] = useState(false);
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e)=> {
    setFormData({...formData, [e.target.id]: e.target.value});
  }
  const handleSubmit = async(e)=> {
    e.preventDefault();
    try {
      if (!formData.username && !formData.email && !formData.password) {
        setError(true);
        setLoading(false);
        console.log('# Please enter username, email, and password!');
        return;
      }
      if (!formData.email && !formData.password) {
        setError(true);
        setLoading(false);
        console.log('# Please enter email and password!');
        return;
      }
      if (!formData.password) {
        setError(true);
        setLoading(false);
        console.log('# Please enter password!');
        return;
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(formData.email)) {
        setError(true);
        setEmailInvalid(true);
        setLoading(false);
        console.log('# Invalid email format!');
        return;
      }
      setLoading(true);
      setError(false);
     const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
     } )
     const data = await res.json();
     console.log(data);
     setLoading(false)
     if (data.success === false) {
      setError(true)
      return;
     }
     navigate('/login');
    } 
   catch(error){
    setError(true)
    setLoading(false)
   }
  }
  return (
    <div>
      <Particlescomp id="particles"/>
      <div className='p-4 max-w-lg mx-auto'>
        <h1 className='font-mono font-bold text-3xl text-center my-7'>Create Your Account</h1>
        <div className="signup-container">
         <div className="signup-header">
           <span>Hello, Friend!</span>
           <h2>Enter Your personal details and Start the journey with me.</h2>
         </div>
         <div className="line"></div>
         <form onSubmit={handleSubmit} className="signup-form">
          <div className=" mt-6 relative">
           <input
             type="text"
             name="username"
             id="username"
             className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg"
             placeholder="John"
             onChange={handleChange} 
             autoComplete='given-name'
           />
           <label htmlFor="username" className="absolute left-0 -top-3.5 text-gray-800 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
          </div>
          <div className="mt-4 relative">
           <input
             type="email"
             name="email"
             id="email"
             className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg"
             placeholder="john@doe.com" 
             onChange={handleChange}
             autoComplete='off'
           />
           <label htmlFor="email" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email address</label>
          </div>
          <div className="mt-4 relative">
           <input
             type="password"
             name="Password"
             id="password"
             className="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg"
             placeholder="password" 
             onChange={handleChange}
             autoComplete='off'
           />
           <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
          </div>

           <button disabled={loading} type="submit">
            {loading ? "Loading..." : "Sign Up" }
           </button>
           <div className="line mt-4 mb-1 ">
           </div>
           <p className='font-mono text-sm flex justify-center gap-2'>Or You Can ...</p>
           <OAuth />
          </form>

          <div className='mt-5 font-mono text-xs flex justify-center gap-2'>
            <p>Already have an Account?</p>
            <Link to='/Login'>
            <span className='text-blue-600 '>Login</span>
            </Link>
          </div>
          <p className='text-red-700 mt-5'>{error && (
           
           !formData.username && !formData.email && !formData.password ? 'Please enter username, email, and password!' :
           formData.username && formData.email && !formData.password ? 'Please enter password!' :
           !formData.username && formData.email ? 'Please enter username!' :
           formData.username && !formData.email ? 'Please enter email!' :
           emailInvalid ? 'Invalid email format!' : !emailInvalid ? ' Thank You !' : 'An unknown error occurred'
          )}</p>
        </div>
      </div>
    </div>
  )
}
export default SignUp;
