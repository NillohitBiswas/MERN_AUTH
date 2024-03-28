import {Link} from 'react-router-dom'
import './Header.css';
export default function Header() {
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
         <Link to='/LogIn'>
         <button className="button">Login</button>
         </Link>
      </div>
    </div>
  )
}

