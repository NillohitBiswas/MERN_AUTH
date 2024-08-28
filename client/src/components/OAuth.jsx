import { GoogleAuthProvider, signInWithPopup, getAuth} from "firebase/auth";
import { app } from '../Firebase.js';
import { useDispatch } from 'react-redux';
import { loginSuccess } from "../Redux/user/userSlice.js";
import { useNavigate } from 'react-router-dom'
export default function OAuth() {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleClick =async () => {
    try{
      const provider = new GoogleAuthProvider()
      const auth = getAuth (app);

      const result = await signInWithPopup(auth, provider);
      const res = await fetch ('/api/auth/google',{
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: result.user.displayName,
            email: result.user.email,
            photo: result.user.photoURL,
          }),
        });
        const data = await res.json();
        console.log(data);
        dispatch(loginSuccess(data));
        navigate('/');
    
    } catch (error) {
      console.log(' Could not Login with Google', error)
    }
  };
  return (
    <button type='button' onClick={handleGoogleClick}>
  Continue With Google
    </button>
  );
}
