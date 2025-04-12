import React, { useEffect, useState } from "react";
import { faLock, faUser, faEye, faEyeSlash, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup, BASE_API, DOMAIN, routes, endpoints } from './constants';
import InputField from "./Inputs";
import axios from "axios";
import Header from "./Header";
import MainButton , {SecondButton} from "./Buttons";
import Layout from "./Layout";
import SuccessM, { ErrorM } from "./Messages";

export const GoogleSign = ({ state, error, redirectUrl, label }) => {
  const handleSignIn = async () => {
    state(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken();
      // Send the token to your Django backend
      const response = await axios.post(`${BASE_API}${endpoints["google_login"]}`, { token: token }, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      localStorage.setItem("token", response.data["token"]);
      if (redirectUrl) {
        window.location.href = DOMAIN + redirectUrl
      }
      else {
        window.location.href = DOMAIN + routes["main"]
      }
    } catch (erro) {
      error(erro.response["data"]["message"])
      console.error(erro);
      state(false);
    }
  };

  return (
    <button onClick={handleSignIn} className="bg-white px-4 py-2 border gap-2 border-slate-200  rounded-lg w-full flex justify-center space-x-2">
      <img class="w-6 h-6" src="https://www.svgrepo.com/show/475656/google-color.svg" loading="lazy" alt="google logo" />
      <span>{label}</span>
    </button>
  );
};

export function LoginForm() {

  const navigate = useNavigate();
  const redirectUrl = new URLSearchParams(window.location.search).get('redirect_url');

  const [isPassShow, setIsPassShow] = useState(false);
  const [loginStatus, setLoginStatus] = useState({ isCorrect: false, error: null, success: null });
  const [isLoginClicked, setIsLoginClicked] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoginClicked(true);

    try {
      const response = await axios.post(`${BASE_API}${endpoints["login"]}`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem('token', response.data.token);
      setLoginStatus({ 
        isCorrect: true, 
        error: null, 
        success: 'Successfully logged in. You will be redirected now!'
      });
    } catch (error) {
      setLoginStatus({ 
        isCorrect: false, 
        error: error.response?.data?.non_field_errors || 'An error occurred', 
        success: null 
      });
    }

    setIsLoginClicked(false);
  };

  useEffect(() => { document.title = "Login" }, []);

  return (
    <Layout>
      <div className="flex justify-center items-center w-full h-full">

        <div className="w-[30%] space-y-3">
          <Header />
          <div className="space-y-3 pl-4">
            <h2 className="font-poppins font-semibold lg:text-3xl text-main xss:text-2xl">Welcome back 🙌!</h2>
            <div className="w-full flex justify-center">
              <div className="w-full">
                <GoogleSign error={setLoginStatus} state={setIsLoginClicked} redirectUrl={redirectUrl} label="Login with Google" />
                <p className="text-center text-main">or</p>
              </div>

            </div>
            <form className="w-full space-y-3" onSubmit={handleSubmit}>
              {loginStatus.error && <p className="text-red-400">{loginStatus.error}</p>}
              {loginStatus.success && <p className="text-green-400">{loginStatus.success}</p>}
              <InputField icon={faUser} type="text" name="email" placeholder="Email" onChange={handleChange} />
              <InputField
                icon={faLock}
                type={isPassShow ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                rightIcon={
                  <FontAwesomeIcon
                    icon={isPassShow ? faEyeSlash : faEye}
                    onClick={() => setIsPassShow(!isPassShow)}
                    className="cursor-pointer"
                  />
                }
              />
              <div className="mt-5">
                <a href={"/" + routes["forgetpassword"]} className="text-transparent-black">Forgot password?</a>

                <div className="flex gap-5 pt-6 items-center">

                  <MainButton  label={"Login"}  IsClicked={isLoginClicked}/>
                  <SecondButton label="Create account" onClick={ ()=>navigate("/" + routes["signup"])}/>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>

  );
}


export function SignupForm() {


  // const responseMessage = (response) => {
  //   // log.log(response);
  // };
  // const errorGMessage = (error) => {
  //   // log.log(error);
  // };
  // const loginWithGoogle = async (idToken, referralId) => {
  //   try {
  //     const response = await axios.post(`${BASE_API}${endpoints["google_login"]}`, { idToken, referralId });
  //     // Store the session ID in localStorage
  //     localStorage.setItem("session", response.data.session);
  //     return response.data;
  //   } catch (error) {
  //     // log.error('Error signing in with Google:', error);
  //     return { result: 'error', message: 'Something went wrong with Google Sign-In' };
  //   }
  // };
  // const OnSignIn = async (user) => {
  //   try {
  //     const referralId = new URLSearchParams(window.location.search).get('ref');
  //     // log.log("referral id", referralId);
  //     // log.log("idToken", idToken);

  //     const idToken = await user.getIdToken();
  //     const response = await loginWithGoogle(idToken, referralId); // call the new function
  //     // Check the response from your backend and update the app's state accordingly.
  //     if (response.result === 'success') {
  //       window.location.href = routes["login"];
  //     } else {
  //       alert(response.message);
  //     }
  //   } catch (error) {
  //     alert("Something went wrong with Google Sign-In");
  //   }
  // };

  const token = localStorage.getItem("token");
  const redirectUrl = new URLSearchParams(window.location.search).get('redirect_url')
  let navigate = useNavigate();
  const [ActivatingSpinner, setActivatingSpinner] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [Message, setMessage] = useState(null);
  const [IsPassShow, setIsPassShow] = useState(true);
  const [IsSignupClicked, setISignupClicked] = useState(false);
  const [IsActivated, setIsActivated] = useState(false);
  const [PassForm, setPassForm] = useState({ password: '', password2: '' })
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [check, setCheck] = useState(false);

  const IsPassMatch = () => {
    let pass1 = PassForm.password
    let pass2 = PassForm.password2
    // log.log(PassForm)
    if (pass1 === pass2) {
      // log.log('the password is matched')
      return true;
    }
    setErrorMessage("The passwords deosnt match")
    return false;
  }
  const handleSubmit = async (e) => {
    setErrorMessage("")
    setMessage("")

    e.preventDefault();
    console.log(formData)
    if (!IsPassMatch()) {
      
      return;
    }
    setISignupClicked(true);
    try {
      setErrorMessage("")

      if (check) {
        const response = await axios.post(`${BASE_API}${endpoints["signup"]}`, formData, {
          headers: {
            'Content-Type': 'application/json',
          }
        })
        setISignupClicked(false);
        setErrorMessage("")
        setMessage("Your account has been created. Please check your inbox to activate it!")
      } else {
      }
      

    } catch (error) {
      console.log(error.response)
      setMessage("")
      setErrorMessage(error.response["data"]["message"][0])     
    }
    setISignupClicked(false);
  };

  const handleCheckChange = (e) => {
    setCheck(!check);
  }
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password' | name === 'password2') {
      const { name, value } = e.target;
      setPassForm({
        ...PassForm,
        [name]: value,
      })

    }

  };
  // const handleShowPass = () => {
  //   setIsPassShow(!IsPassShow);
  // }
  const verifyEmail = async (uid64, activation_id) => {
    if (uid64 && activation_id) {
      setActivatingSpinner(true);
      try{
        const response = await axios.get(`${BASE_API}${endpoints['verify-email']}/${uid64}/${activation_id}`)
        if (response.status === 200) {
          // log.log('You email has been succussfully.');
          setActivatingSpinner(true);
          setIsActivated(true)
          window.location.href = DOMAIN + routes["login"]
        } else {
        }
      }
      catch (error){
      }

      setActivatingSpinner(false);
    }
  }

  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    const uid64 = queryparams.get('uidb64');
    const activation_id = queryparams.get('activationId');
    verifyEmail(uid64, activation_id);
  }, [])

  useEffect(() => { document.title = "Sign up" }, []);

  return (
    <Layout>
      <div className="flex justify-center items-center w-full h-full">
        <div className="w-[30%] space-y-3">
          <Header />
          <div className="space-y-3 pl-4">
            <h2 className="font-poppins font-semibold lg:text-3xl text-main xss:text-2xl">Sign up!</h2>
            <div className="w-full flex justify-center">
              <div className="w-full">
              <GoogleSign error={setErrorMessage} state={setISignupClicked} redirectUrl={routes["main"]} label="Continue with Google" />
                <p className="text-center text-main">or</p>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="w-full space-y-3">

              {ActivatingSpinner ? <div className="spinner"></div> : ""}
              {Message ? (<SuccessM message={Message}/>) : (<></>)}
              {IsActivated ? (<SuccessM message={"Your account has been activated succussfully. You can login now."}/>) : (<></>)}
              {errorMessage ? (<ErrorM message={errorMessage}/>) : (<></>)}
              <InputField icon={faUser} type="text" name="email" placeholder="Email" onChange={handleChange} />
              <InputField icon={faUser} type="text" name="username" placeholder="username" onChange={handleChange} />

              <InputField
                icon={faLock}
                type={IsPassShow ? "text" : "password"}
                name="password"
                placeholder="Password"
                onChange={handleChange}
                rightIcon={
                  <FontAwesomeIcon
                    icon={IsPassShow ? faEyeSlash : faEye}
                    onClick={() => setIsPassShow(!IsPassShow)}
                    className="cursor-pointer"
                  />
                }/>
              <InputField
                icon={faLock}
                type={IsPassShow ? "text" : "password"}
                name="password2"
                placeholder="Confirm password"
                onChange={handleChange}
                rightIcon={
                  <FontAwesomeIcon
                    icon={IsPassShow ? faEyeSlash : faEye}
                    onClick={() => setIsPassShow(!IsPassShow)}
                    className="cursor-pointer"
                  />
                }/>
              <div className="space-x-5 pb-5 pt-5">
                <input type="checkbox" name="signinbox" value={check} onChange={handleCheckChange} required />
                <label htmlFor="signinbox">By Sign up I agree to the {" "}
                  <a href="/terms-of-services" className="text-primary">Term of services</a> and {" "}
                  <a href="/privacy-policy" className="text-primary">Privacy Policy</a>
                </label>
              </div>
              <div className="flex gap-5 mt-3 items-center">
                <MainButton  label={"Create account"}  IsClicked={IsSignupClicked}/>
                <SecondButton label="Login" onClick={ ()=>navigate("/" + routes["login"])}/>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>

  );
}


export function ForgotPassword() {

  const SendReset = async () => {

    try {
      const response = await axios.post(
        `${BASE_API}${endpoints["password-reset"]}`,
        { email: Email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.status === 200) {
        // log.log(response.data);
        setIsReponseOK(true);
        setIsReponseNotOK(false);
      } else {
        setIsReponseOK(false);
        setIsReponseNotOK(true);
        console.log(erros)
      }
    } catch (erros) {
      setEmailError(erros["message"])
      console.log(erros)
      setIsReponseOK(false);
      setIsReponseNotOK(true);
    }
    setIsClicked(false);
    setdisable(false);
    setEmail('');
  };
  const [disable, setdisable] = useState(false);
  const [Email, setEmail] = useState('');
  const [IsClicked, setIsClicked] = useState(false);
  const [IsReponseOK, setIsReponseOK] = useState(false);
  const [IsReponseNotOK, setIsReponseNotOK] = useState(false);
  const [EmailError, setEmailError] = useState('');
  const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    return emailRegex.test(email);
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    if (!Email) {
      setEmailError('Email is required');
      return;
    }
    if (!isEmailValid) {
      setEmailError('Please enter a valid email adress');
      return;
    }
    setEmailError('')
    e.preventDefault();
    setIsClicked(true);
    setdisable(true);
    SendReset();
  };
  const handleChange = (e) => {
    if (!isEmailValid(e.target.value)) {
      setEmailError('Please enter a valid email adress.')
    } else { setEmailError('') }
    setEmail(e.target.value);
  };
  let navigate = useNavigate();
  const backClick = () => {
    window.location.href = DOMAIN + "?login=true";
  };
  useEffect(() => {
    document.title = "Forgot your password";
  }, []);
  return (
    <Layout>
      <div className="flex justify-center items-center w-full h-full">

        <div className="w-[30%] space-y-3">
          <Header />
          <div className="space-y-3 pl-4">
            <h2 className="font-poppins font-semibold lg:text-3xl text-main xss:text-2xl">Forget password</h2>
            <form action="" className="w-full inline space-y-3" onSubmit={handleSubmit}>
            {IsReponseOK ? (
              <p className="text-green-500">
                Please check your inbox. We have sent reset link.
              </p>
            ) : (
              <></>
            )}
            {IsReponseNotOK ? (<><p className="text-red-500">User with that email is not exist</p></>) : (<></>)}
            <p className="text-main pt-2 text-sm">Please enter your email to reset your password.</p>
            <InputField icon={faUser} type="text" name="email" placeholder="Email" onChange={handleChange} />
            <div className="flex gap-5 mt-3 items-center">
              <MainButton disabled={disable}label={"Reset password"} onClick={()=>null} IsClicked={IsClicked}/>
              <SecondButton label="Login" onClick={ ()=>navigate("/" + routes["login"])}/>
            </div>
          </form>
          </div>
        </div>
      </div>
    </Layout>
    
  );
}
