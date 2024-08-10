import { useSelector } from "react-redux"
import Particlescomp from '../components/Particles';

export default function Profile() {
  const { currentUser } = useSelector(state => state.user)
  return (
    <div >
       <Particlescomp id="particles"/>
      <h1 className='font-mono font-bold text-3xl text-center my-6  max-w-lg mx-auto'>
        User Profile
      </h1>
      <form className="flex flex-col bg-white/30 backdrop-blur-xl rounded-[0px_40px_0px_40px] border-2 border-[#333332] shadow-[4px_4px_15px_rgba(0,0,0,0.25)] p-8 w-[350px] mx-auto my-8 text-center">
        <img src={currentUser.profilePicture} alt="profile" 
        className="h-24 w-24 self-center cursor-pointer rounded-full object-cover  border-4 border-red-600" />
        <h2 className="text-2xl font-semibold font-mono mt-4 ">WELCOME!</h2>
        <div>
           <input
             defaultValue={currentUser.username}
             type="text"
             id="username"
             className=" h-10 w-full bg-transparent border-b-4 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg mt-8 "
             placeholder="John"
            
           />
           <input
             defaultValue={currentUser.email}
             type="email"
             id="Email"
             className="peer h-10 w-full bg-transparent border-b-4 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg mt-6"
             placeholder="John@gmail.com"
             
           />
           <input
             defaultValue={currentUser.password}
             type="password"
             id="password"
             className="peer h-10 w-full bg-transparent border-b-4 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg  mt-6 mb-10 "
             placeholder="password"
             
           />
           <button type="submit" className="bg-[#242424] text-zinc-300 font-mono border border-[#bbbaba] text-[16px] transition-[800ms] shadow-xl hover:shadow-slate-900  hover:text-white active:transition-[800ms] py-2 px-4 rounded-full w-full">
             Update Profile
           </button>
           <div className="flex justify-between"> 
              <span className="font-mono text-sm font-semibold text-gray-500  hover:text-[#000000]  active:transition-[800ms] py-4 "> Delete Account</span>
              <span className="font-mono text-sm font-semibold text-gray-500  hover:text-[#000000]  active:transition-[800ms] py-4 "> Logout</span>
           </div>
        </div>
      </form>
      
    </div>
  )
}
