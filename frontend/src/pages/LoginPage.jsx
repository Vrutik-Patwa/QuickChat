import React, { use, useState } from "react";
import assets from "../assets/assets";
import { useFormik } from "formik";
const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up");
  /*const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  */
  //  This is one way to do  it another way is to use LoginForm
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const LoginForm = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      password: "",
      bio: "",
      terms: false,
    },
    onSubmit: (values) => {
      alert(JSON.stringify(values, null, 2));
    },
  });
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center
      gap-8 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl"
    >
      {/* Left */}
      <img src={assets.logo_big} alt="logo" className="w-[min(30vw,250px)]" />
      {/* Right */}
      {/* <form className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg">
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
        </h2>
        {currState === "Sign Up" && (
          <input
            type="text"
            className="p-2 border border-gray-50 rounded-md focus:outline-none
         "
            placeholder="Full Name"
            required
          />
        )}
      </form> */}
      <form
        onSubmit={LoginForm.handleSubmit}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl flex justify-between items-center">
          {currState}
          <img src={assets.arrow_icon} alt="" className="w-5 cursor-pointer" />
        </h2>

        {/* <label htmlFor="firstName">First Name</label> */}
        {!isDataSubmitted && (
          <input
            id="firstName"
            name="firstName"
            type="text"
            onChange={LoginForm.handleChange}
            value={LoginForm.values.fullName}
            required
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2"
            placeholder="Full Name"
          />
        )}
        {/* <label htmlFor="lastName">Last Name</label> */}

        {/* <label htmlFor="email">Email Name</label> */}
        <input
          id="email"
          name="email"
          type="text"
          onChange={LoginForm.handleChange}
          value={LoginForm.values.email}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          placeholder="Email"
        />
        <input
          id="password"
          name="password"
          type="text"
          onChange={LoginForm.handleChange}
          value={LoginForm.values.password}
          className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          required
          placeholder="Password"
        />
        {/* <label htmlFor="bio">Bio</label> */}
        {!isDataSubmitted && (
          <textarea
            id="bio"
            rows={4}
            name="bio"
            type="text"
            onChange={LoginForm.handleChange}
            value={LoginForm.values.bio}
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
            placeholder="Provide a short bio...."
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>
        {!isDataSubmitted && (
          <div className="flex flex-row items-center gap-1 ml-2 justify-center">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              onChange={LoginForm.handleChange}
              value={LoginForm.values.terms}
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />

            <label htmlFor="terms " className="text-sm text-gray-500">
              Agree to term use & privacy policy
            </label>
          </div>
        )}
        {currState === "Sign Up" ? (
          <div className="flex text-sm gap-1 items-center justify-center">
            <p className=" text-gray-600">Already Have an Account?</p>
            <p
              onClick={() => {
                setCurrState("Login");
                setIsDataSubmitted(true);
              }}
              className="font-medium text-violet-500 cursor-pointer"
            >
              Login Here
            </p>
          </div>
        ) : (
          <div className="flex  gap-1 items-center justify-center ">
            <p className="text-sm text-gray-600">Create An Account?</p>
            <p
              onClick={() => {
                setCurrState("Sign Up");
                setIsDataSubmitted(false);
              }}
              className="font-medium text-sm text-violet-500 cursor-pointer"
            >
              Click Here
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default LoginPage;
