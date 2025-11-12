import React, {useState} from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/Inputs/Input';
import { validateEmail } from '../../utils/helper';
import ProfilePhotoSelector from '../../components/Inputs/ProfilePhotoSelector';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

function SignUp() {
  const [profilePic,setProfilePic]=useState(null);
  const [fullName,setFullName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState(null);
  const [loading,setLoading]=useState(false);
  const navigate=useNavigate();
  const { register, uploadImage } = useAuth();

  //Handle SignUp Form submit
  const handleSignUp=async(e)=>{
    e.preventDefault()
    
    if(!fullName){
      setError("Please enter your name")
      return
    }
    if(!validateEmail(email)){
      setError("Please enter a valid email address")
      return
    }
    if(!password){ 
      setError("Please enter the password")
      return
    }
    if(password.length < 6){
      setError("Password must be at least 6 characters")
      return
    }
    
    setError("")
    setLoading(true)
    
    try {
      let profileImageUrl = "";
      
      // Upload profile image if selected
      if (profilePic) {
        const uploadResult = await uploadImage(profilePic);
        if (uploadResult.success) {
          profileImageUrl = uploadResult.imageUrl;
        } else {
          toast.error('Failed to upload profile image');
        }
      }
      
      // Register user
      const result = await register({
        fullName,
        email,
        password,
        profileImageUrl
      });
      
      if (result.success) {
        toast.success('Account created successfully!');
        navigate('/dashboard');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  }
  return (
    <AuthLayout>
      <div className='lg:w-[100%] h-auto md:h-full mt-10 md:mt-0 flex flex-col justify-center'>
        <h3 className='text-xl font-semibold' style={{color: '#777C6D'}}>Create an Account</h3>
        <p className='text-xs mt-[5px] mb-6' style={{color: '#777C6D', opacity: 0.8}}>
          Join us today by entering your details below.
        </p>
        <form onSubmit={handleSignUp}>
          <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <Input
              value={fullName}
              onChange={({target})=> setFullName(target.value)}
              label="Full Name"
              placeholder="John Doe"
              type="text"
            />
            <Input
                value={email}
                onChange={({target})=> setEmail(target.value)}
                label="Email Address"
                placeholder="john@example.com"
                type="text"
              />
              <div className='col-span-2'>
                <Input
                  value={password}
                  onChange={({target})=> setPassword(target.value)}
                  label="Password"
                  placeholder="Min 8 characters"
                  type="password"
                />
              </div>
          </div>
            {error && <p className="text-red-500 text-xs pb-5">{error}</p>}
            <button type="submit" className='w-full py-3 rounded-lg font-medium transition-colors disabled:opacity-50' style={{backgroundColor: '#777C6D', color: '#EEEEEE'}} disabled={loading}>
              {loading ? 'CREATING ACCOUNT...' : 'SIGN UP'}
            </button>
            <p className='text-[13px] mt-3' style={{color: '#777C6D'}}>
            Already have an account?
            <Link to="/login" className='font-medium underline' style={{color: '#777C6D'}}>Login
            </Link>
            </p>
        </form>
      </div>
    </AuthLayout>
  )
}

export default SignUp