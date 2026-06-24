"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LuEyeOff } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";

import showMessage from "@/lib/toastMessage";
import OtpVerification from "@/components/otpVerifier";
import { login } from "@/store/reducer/authStore";
import { baseSchema } from "@/lib/formSchema";

/* ------------------ Schema ------------------ */
const formSchema = baseSchema.pick({ email: true }).extend({
  password: z.string().min(3, "Password is required"),
});

type LoginFormValues = z.infer<typeof formSchema>;

export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();

  const [otpEmail, setOtpEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  /* ------------------ Login Submit ------------------ */
  const submitHandler: SubmitHandler<LoginFormValues> = async (values) => {
    setIsLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    const data = await res.json();

    if (!data.success) {
      showMessage(data.message || "Login failed", "error");
    } else {
      showMessage(data.message || "Login successful", "success");
      setOtpEmail(values.email);
    }

    setIsLoading(false);
  };

  /* ------------------ OTP Verify ------------------ */
  const otpVerificationHandler = async (
    values: { otp: string; email: string },
    form: any,
  ) => {
    setOtpLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/verify-otp`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      },
    );

    const data = await res.json();

    if (!data.success) {
      showMessage(data.message || "Incorrect OTP", "error");
    } else {
      showMessage(data.message, "success");
      dispatch(login(data.data));
      reset();

      router.push("/dashboard");
    }

    setOtpLoading(false);
  };
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        {otpEmail ? (
          <OtpVerification
            email={otpEmail}
            loading={otpLoading}
            onSubmit={otpVerificationHandler}
          />
        ) : (
          <>
            <h1 className="mt-4 text-center text-2xl font-semibold">
              Login into account
            </h1>
            <p className="text-center text-sm text-gray-500">
              Enter your credentials below
            </p>

            <form
              onSubmit={handleSubmit(submitHandler)}
              className="mt-6 space-y-4"
            >
              {/* Email */}
              <div>
                <label className="text-sm font-medium">Email</label>
                <input
                  {...register("email")}
                  placeholder="Enter your email"
                  className="mt-1 w-full rounded border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.email && (
                  <p className="text-xs text-red-500">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium">Password</label>
                <div className="relative">
                  <input
                    {...register("password")}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    className="mt-1 w-full rounded border px-3 py-2 pr-10 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <span
                    className="absolute right-3 top-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <LuEyeOff /> : <MdOutlineRemoveRedEye />}
                  </span>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type={"submit"}
                disabled={isLoading}
                className="w-full py-2 rounded bg-black text-white text-sm disabled:bg-gray-400"
              >
                {isLoading ? "Loading..." : "login"}
              </button>

              <div className="flex justify-between text-sm">
                <Link
                  href={"/auth/forgot-password"}
                  className="text-blue-600 hover:underline"
                >
                  Forgot password?
                </Link>
                <Link
                  href={"/auth/register"}
                  className="text-blue-600 hover:underline"
                >
                  Create account
                </Link>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
