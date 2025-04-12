import { useState, useEffect } from "react";
import { faLock, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import NotFound from './NotFound';
import { useNavigate } from "react-router-dom";
import { BASE_API ,DOMAIN, endpoints, routes} from '../components/constants';
import Layout from "../components/Layout";
import Header from "../components/Header";
import InputField from "../components/Inputs";
import MainButton from "../components/Buttons";
import SuccessM, { ErrorM } from "../components/Messages";


export default function PasswordReset() {
  const BASE_URL = `${BASE_API}${endpoints["password-reset"]}/`;

  const [IsPassShow, setIsPassShow] = useState(true);
  const [IsClicked, setIsClicked] = useState(false);
  const [IsResponseOK, setIsResponseOK] = useState(false);
  const [SuccessMessage, setSuccessMessage] = useState(null);
  const [uidb64, setuidb64] = useState(null);
  const [ActivationId, setActivationId] = useState(null);
  const [ErrorMessage, setErrorMessage] = useState(null);

  let navigate = useNavigate();
  const CheckVerification = async () => {
    // log.log(
    "getting reponse from ",
      `${BASE_URL}${uidb64}/${ActivationId}`
    //);
    if(uidb64 && ActivationId){
      const response = await axios.get(`${BASE_URL}${uidb64}/${ActivationId}`);
      // log.log(response);
      if (response.status === 200) {
        // log.log("response data : ",response.data);
        setIsResponseOK(true);
      } else {
        setIsResponseOK(false);
        // log.error("404 Not found");
      }
    }
  };
  const ResetPassword = async () => {
    try{
      const response = await axios.post(`${BASE_URL}${uidb64}/${ActivationId}`, { 'new_password': PassForm.password }, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.status === 200) {
        // console.log(response.data)
        setSuccessMessage(response.data["message"]);
        window.location.href = DOMAIN + routes["login"]
        // log.log("reponse after reset : ", response.data);
      }
    }catch(error){
      console.log("error",error.response.data.message)
      setErrorMessage(error.response.data.message)
    }
  
    setIsClicked(false);
  }
  useEffect(() => {
    const queryparams = new URLSearchParams(window.location.search);
    if(queryparams.get("activationId") !==null && queryparams.get("uidb64") !==null){
      setActivationId(queryparams.get("activationId"));
      setuidb64(queryparams.get("uidb64"));
      CheckVerification();
    }
  }, [ActivationId, uidb64]);
  const handleShowPass = () => {
    setIsPassShow(!IsPassShow);
  };
  const [PassForm, setPassForm] = useState({ password: '', password2: '' })

  const handleChange = (e) => {
    const { name, value } = e.target;

    setPassForm({
      ...PassForm,
      [name]: value,
    })
  };
  const IsPassMatch = () => {
    const pass1 = PassForm.password
    const pass2 = PassForm.password2
    if (pass1 === pass2) {

      return true;
    }
    setIsClicked(false);
    return false;
  }
  const handleSubmit = async (e) => {
    setErrorMessage("");
    setSuccessMessage("")
    e.preventDefault();
    const results = IsPassMatch();
    if (!results) {
      setErrorMessage('Your Password deosnt matched')
      return;
    }
    setIsClicked(true);
    ResetPassword();
  };
  useEffect(() => { document.title = "Reset your passowrd." }, [])

  return (
    <>
      {IsResponseOK ? (
          
        <Layout>
          <div className="flex justify-center items-center w-full h-full">
            <div className="w-[30%] space-y-3">
              <Header />
              <div className="pl-4">
              <form action="" className="w-full inline space-y-3" onSubmit={handleSubmit}>
              <h2 className="font-poppins font-semibold lg:text-3xl text-edit_color_2 xss:text-2xl">
                Reset your password
              </h2>
              <p>Please enter new password.</p>
              <ErrorM message={ErrorMessage}/>
              <SuccessM message={SuccessMessage}/>
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
              <MainButton label={"Set new password"} IsClicked={IsClicked} type={"submit"}/>
              
            </form>
              </div>
            
            </div>

          </div>
         </Layout>           

      ) : (
        <NotFound />
      )}
    </>
  );
}
