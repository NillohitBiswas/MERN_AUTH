import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../Firebase';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  logout,
} from '../Redux/user/userSlice.js';
import Particlescomp from '../components/Particles';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);
  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        console.error('upload failed:', error);
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handlelogout = async () => {
    try {
      await fetch('/api/auth/logout');
      dispatch(logout())
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div >
       <Particlescomp id="particles"/>
      <h1 className='font-mono font-bold text-3xl text-center my-6  max-w-lg mx-auto'>
        User Profile
      </h1>
      <form onSubmit={handleSubmit}
       className="flex flex-col bg-white/30 backdrop-blur-xl rounded-[0px_40px_0px_40px] border-2 border-[#333332] shadow-[4px_4px_15px_rgba(0,0,0,0.25)] p-8 w-[350px] mx-auto my-8 text-center">
        <input 
        type='file' 
        ref={fileRef}
        hidden accept='image/*'
        onChange={(e)=> setImage(e.target.files[0])}/>

        <img 
        src={formData.profilePicture || currentUser.profilePicture} 
        alt="profile" 
        className="h-24 w-24 self-center cursor-pointer rounded-full object-cover  border-4 border-red-600" 
        onClick={() => fileRef.current.click()}
        />

       <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>

        <h2 className="text-2xl font-semibold font-mono mt-4 ">WELCOME!</h2>
        <div>
           <input
             defaultValue={currentUser.username}
             type="text"
             id="username"
             className=" h-10 w-full bg-transparent border-b-4 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg mt-8 "
             placeholder="John"
             onChange={handleChange}
           />
           <input
             defaultValue={currentUser.email}
             type="email"
             id="Email"
             className="peer h-10 w-full bg-transparent border-b-4 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg mt-6"
             placeholder="John@gmail.com"
             onChange={handleChange}
           />
           <input
             defaultValue={currentUser.password}
             type="password"
             id="password"
             className="peer h-10 w-full bg-transparent border-b-4 border-gray-300 text-gray-900 placeholder-transparent focus:outline-none focus:border-rose-600 p-3 rounded-lg  mt-6 mb-10 "
             placeholder="password"
             onChange={handleChange}
           />
           <button type="submit" className="bg-[#242424] text-zinc-300 font-mono border border-[#bbbaba] text-[16px] transition-[800ms] shadow-xl hover:shadow-slate-900  hover:text-white active:transition-[800ms] py-2 px-4 rounded-full w-full">
             {loading ? 'Loading...' : 'Update Profile'}
           </button>
           <div className="flex justify-between"> 
              <span onClick={handleDeleteAccount} className="font-mono text-sm font-semibold text-gray-500  hover:text-[#000000]  active:transition-[800ms] py-4 "> Delete Account</span>
              <span onClick={handlelogout} className="font-mono text-sm font-semibold text-gray-500  hover:text-[#000000]  active:transition-[800ms] py-4 "> Logout</span>
           </div>
           <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
           <p className='text-green-700 mt-5'>
            {updateSuccess && 'User is updated successfully!'}
           </p>
        </div>
      </form>
      
    </div>
  )
}
