import {Link} from 'react-router-dom';
import Particlescomp from '../components/Particles';
import './SignUp.css';
function SignUp() {
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
         <div class="line"></div>
         <form className="signup-form">
          <div class=" mt-10 relative">
           <input
             type="text"
             name="username"
             id="username"
             class="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg" placeholder="John" />
           <label for="email" class="absolute left-0 -top-3.5 text-gray-800 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Username</label>
          </div>
          <div class="mt-8 relative">
           <input
             type="text"
             name="email"
             id="email"
             class="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600  rounded-lg" placeholder="john@doe.com" />
           <label for="email" class="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Email address</label>
          </div>
          <div class="mt-8 relative">
           <input
             type="text"
             name="Password"
             id="password"
             class="peer h-10 w-full border-b-2 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg" placeholder="john@doe.com" />
           <label for="email" class="absolute left-0 -top-3.5 text-gray-600 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-2 peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
          </div>
           <button type="submit">Submit</button>
          </form>
          <div className='mt-5 font-mono text-xs flex justify-center gap-2'>
            <p>Already have an Account?</p>
            <Link to='/Login'>
            <span className='text-blue-600 '>Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SignUp;
