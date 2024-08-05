import {Link} from 'react-router-dom'
import './Header.css';
import { useSelector } from 'react-redux';
export default function Header() {
  const { currentUser } = useSelector( (state) => state.user)
  return (
    <div className="background">
      <div className='flex justify-between  items-center max-w-full mx-auto p-2 text-black'>
        <Link to='/'>   
        <h1 className='font-authappfont font-bold text-3xl justify-items-start'>Auth App </h1>
        </Link>
        <ul className='text-base flex gap-4 font-semibold font-mono'>
         <Link to='/'>
         <li>Home</li>
         </Link>
         <Link to='/about'>
         <li>About</li>
         </Link>
        </ul>
         <Link to='/Profile'>
         
            {currentUser ? (
              <img src={currentUser.profilePicture} alt='profile' className='h-7 w-7 rounded-full object-cover' />
            ) : (
           <li>LogIn</li>)
          }
         
         </Link>
        
      </div>
    </div>
  )
}

