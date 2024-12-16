import {Link} from 'react-router-dom'
import './Header.css';
import { useSelector } from 'react-redux';
import logo from '../../assets/Audiqlogo.png';
export default function Header() {
  const { currentUser } = useSelector( (state) => state.user)
  return (
    <div className="background">
      <div className='flex justify-between  items-center max-w-full mx-auto p-2 text-black'>
        <Link to='/'>   
        <img src={logo} alt="Logo" className=" h-24  w-34 -mt-8 -mb-8" />
        </Link>
        <ul className='text-1xl flex gap-4 font-semibold font-mono items-center'>
         <Link to='/'>
         <li>Home</li>
         </Link>
         <Link to='/about'>
         <li>About</li>
         </Link>
         <Link to='/tracks'>
         <li>Tracks</li>
         </Link>
        
         <Link to='/Profile'>
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-8 w-8 rounded-full object-cover border-2 border-lime-500 shadow-lg hover:shadow-lime-400' />
             ) :
              (
           
             <button type="button" className='h-10 w-24 bg-[#242424] text-[#c0bfbf] flex justify-center items-center cursor-pointer font-mono border border-[#bbbaba] text-[16px] rounded-[5px] transition-[500ms] shadow-xl hover:shadow-slate-900  hover:text-[#ffffff] active:text-[#d6d6d6] active:transition-[500ms]'>
              Login
                </button>

              )
            }
         
         </Link>
         </ul>
      </div>
    </div>
  )
}

