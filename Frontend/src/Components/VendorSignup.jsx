import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";

const VendorSignup = () => {
  const navigate = useNavigate(); // Initialize navigate function
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      console.log("Submitting Vendor Data:", data); // Log the data being submitted
      const response = await axios.post('http://localhost:3001/register/vendor', data, {
        withCredentials: true, // Important if you're handling cookies or sessions
      });
      console.log("Vendor Registration Response:", response.data);
      toast.success("Vendor registered successfully!");
      navigate('/'); // Redirect to vendor login page on successful signup
    } catch (error) {
      console.error('Error registering vendor:', error);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(`Error: ${error.response.data.message}`);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-[600px]">
        <div className="modal-box">
          <form onSubmit={handleSubmit(onSubmit)} method="dialog">
            {/* Close Button */}
            <Link
              to="/"
              className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
            >
              ✕
            </Link>

            <h3 className="font-bold text-lg">Vendor Signup</h3>

            {/* VendorID */}
            <div className="mt-4 space-y-2">
              <span>Vendor ID</span>
              <input
                type="text"
                placeholder="Enter your Vendor ID"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("vendorID", { required: true })}
              />
              {errors.vendorID && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* VendorName */}
            <div className="mt-4 space-y-2">
              <span>Vendor Name</span>
              <input
                type="text"
                placeholder="Enter your Vendor Name"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("vendorName", { required: true })}
              />
              {errors.vendorName && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* VendorPhoneNo */}
            <div className="mt-4 space-y-2">
              <span>Phone No.</span>
              <input
                type="text"
                placeholder="Enter your Phone Number"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("vendorPhoneNumber", { required: true })}
              />
              {errors.vendorPhoneNumber && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* VendorAddress */}
            <div className="mt-4 space-y-2">
              <span>Address</span>
              <input
                type="text"
                placeholder="Enter your Address"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("vendorAddress", { required: true })}
              />
              {errors.vendorAddress && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* Email */}
            <div className="mt-4 space-y-2">
              <span>Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("vendorEmail", { required: true })}
              />
              {errors.vendorEmail && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* Password */}
            <div className="mt-4 space-y-2">
              <span>Password</span>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-80 px-3 py-1 border rounded-md outline-none"
                {...register("vendorPassword", { required: true })}
              />
              {errors.vendorPassword && (
                <span className="text-sm text-red-500">
                  This field is required
                </span>
              )}
            </div>

            {/* Button */}
            <div className="flex justify-around mt-4">
              <button className="bg-pink-500 text-white rounded-md ml-[10px] px-3 py-1 hover:bg-pink-700 duration-200">
                Signup
              </button>
              <div className="ml-[150px]">
                <p className="text-xl">
                  Have an account?{" "}
                  <Link
                    to="/login/vendor"
                    className="underline text-blue-500 cursor-pointer"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VendorSignup;