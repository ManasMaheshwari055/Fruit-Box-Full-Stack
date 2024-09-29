import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
function UserLogin() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate(); // useNavigate hook to programmatically navigate


  const onSubmit = async (data) => {
    const userInfo = {
      userID: data.userID,
      userName: data.userName,
      userPhoneNumber: data.userPhoneNumber,
      userAddress: data.userAddress,
      userPassword: data.userPassword,
      userEmail: data.userEmail,
    };
    try {
      const res = await axios.post("http://localhost:3001/login/user", userInfo, {
        withCredentials: true,
      });

      if (res.data) {
        toast.success("Logged in Successfully");
        localStorage.setItem("users", JSON.stringify(res.data.user));
        setTimeout(() => {
          navigate("/userdashboard"); // Use navigate to redirect
        }, 1000);
      }
    } catch (err) {
      console.error(err);
      toast.error("Login failed. Please check your credentials.");
    }
  };

  return (
    <div>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <Link
              to="/userdashboard"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
              onClick={() => document.getElementById("my_modal_4").close()}
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg">Login</h3>
            {/* Email */}
            <div className="mt-4 space-y-2">
              <span>Email</span>
              <br />
              <input
                type="email"
                placeholder="Enter your email"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("userEmail", { required: true })}
              />
              <br />
              {errors.userEmail && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>
            {/* password */}
            <div className="mt-4 space-y-2">
              <span>Password</span>
              <br />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("userPassword", { required: true })}
              />
              <br />
              {errors.userPassword && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-content mt-6">
              <button className="bg-pink-500 text-white rounded-md ml-[10px] px-3 py-1 hover:bg-pink-700 duration-200">
                Login
              </button>
              <div className="ml-[150px]">
                <p>
                    Not registered ?{" "}
                    <Link
                    to="/signup"
                    className="underline text-blue-500 cursor-pointer"
                    >
                    Signup
                    </Link>{" "}
                </p>
              </div>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default UserLogin;


