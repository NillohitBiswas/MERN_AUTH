import {Link} from 'react-router-dom'

export default function Header() {
  return (
    <div className='bg-orange-100 mt-2'>
      <div className='flex justify-between  items-center max-w-6xl mx-auto p-2'>
        <Link to='/'>   
        <h1 className='font-authappfont font-bold text-3xl justify-items-start'>Auth App </h1>
        </Link>
        <ul className='font-typofont text-lg flex gap-4 font-semibold'>
         <Link to='/'>
         <li>Home</li>
         </Link>
         <Link to='/about'>
         <li>About</li>
         </Link>
         <Link to='/sign-in'>
         <li>Sign In</li>
         </Link>
        </ul>
      </div>
    </div>
  )
}

