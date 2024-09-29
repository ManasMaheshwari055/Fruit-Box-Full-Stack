import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';

const Signup = () => {
    const navigate = useNavigate(); // Initialize navigate function
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        try {
            const response = await axios.post('http://localhost:3001/register/user', data, {
                withCredentials: true, // Important if you're handling cookies or sessions
            });
            console.log(response.data);
            navigate('/'); // Redirect to login page on successful signup
        } catch (error) {
            console.error('Error registering user:', error);
            // Show error message to user
        }
    };

    return (
        <div className="flex h-screen items-center justify-center">
            <div className="w-[600px]">
                <div className="modal-box">
                    <form onSubmit={handleSubmit(onSubmit)} method="dialog">
                        <Link
                            to="/"
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        >
                            ✕
                        </Link>

                        <h3 className="font-bold text-lg">User Signup</h3>

                        {/* UserID */}
                        <div className="mt-4 space-y-2">
                            <span>UserId</span>
                            <br />
                            <input
                                type="text"
                                placeholder="Enter your fullID"
                                className="w-80 px-3 py-1 border rounded-md outline-none"
                                {...register("userID", { required: true })}
                            />
                            <br />
                            {errors.userID && (
                                <span className="text-sm text-red-500">
                                    This field is required
                                </span>
                            )}
                        </div>

                        {/* UserName */}
                        <div className="mt-4 space-y-2">
                            <span>UserName</span>
                            <br />
                            <input
                                type="text"
                                placeholder="Enter your fullname"
                                className="w-80 px-3 py-1 border rounded-md outline-none"
                                {...register("userName", { required: true })}
                            />
                            <br />
                            {errors.userName && (
                                <span className="text-sm text-red-500">
                                    This field is required
                                </span>
                            )}
                        </div>

                        {/* Phone No. */}
                        <div className="mt-4 space-y-2">
                            <span>Phone No.</span>
                            <br />
                            <input
                                type="text"
                                placeholder="Enter your Number"
                                className="w-80 px-3 py-1 border rounded-md outline-none"
                                {...register("userPhoneNumber", { required: true })}
                            />
                            <br />
                            {errors.userPhoneNumber && (
                                <span className="text-sm text-red-500">
                                    This field is required
                                </span>
                            )}
                        </div>

                        {/* Address */}
                        <div className="mt-4 space-y-2">
                            <span>Address</span>
                            <br />
                            <input
                                type="text"
                                placeholder="Enter your Full Address"
                                className="w-80 px-3 py-1 border rounded-md outline-none"
                                {...register("userAddress", { required: true })}
                            />
                            <br />
                            {errors.userAddress && (
                                <span className="text-sm text-red-500">
                                    This field is required
                                </span>
                            )}
                        </div>

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

                        {/* Password */}
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
                        <div className="flex justify-around mt-4">
                            <button className="bg-pink-500 text-white rounded-md ml-[10px] px-3 py-1 hover:bg-pink-700 duration-200">
                                Signup
                            </button>
                            <div className="ml-[150px]">
                                <p className="text-xl">
                                    Have an account?{" "}
                                    <Link
                                        to="/"
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

export default Signup;