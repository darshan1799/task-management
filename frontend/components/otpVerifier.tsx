"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRef, useState } from "react";
import showMessage from "@/lib/toastMessage";
import LoadingOverlay from "@/components/loadingOverlay";

type OtpFormValues = {
  email: string;
  otp: string;
};

type OtpVerificationProps = {
  email: string;
  loading: boolean;
  onSubmit: (values: OtpFormValues, form: any) => void;
};

const otpValidationSchema = z.object({
  email: z.string().email(),
  otp: z
    .string()
    .length(6, "OTP must be exactly 6 digits")
    .regex(/^\d+$/, "OTP must contain only numbers"),
});

export default function OtpVerification({
  email,
  loading,
  onSubmit,
}: OtpVerificationProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<OtpFormValues>({
    resolver: zodResolver(otpValidationSchema),
    defaultValues: {
      email,
      otp: "",
    },
  });

  const otpValue = watch("otp");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isPendingResend, setPending] = useState(false);

  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const otpArr = otpValue.split("");
    otpArr[index] = value;
    const newOtp = otpArr.join("").slice(0, 6);

    setValue("otp", newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otpValue[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (!paste) return;

    setValue("otp", paste);
    inputRefs.current[paste.length - 1]?.focus();
  };

  const handleVerificationOtp = (values: OtpFormValues) => {
    onSubmit(values, null);
  };

  const handleResendOtp = async (email: string) => {
    setPending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!data.success) {
        showMessage(data.message, "error");
        return;
      }

      showMessage("OTP resent successfully!", "success");
    } catch (error) {
      console.error(error);
      showMessage("Something went wrong while resending OTP", "error");
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <LoadingOverlay show={isPendingResend} />

      <div className="w-full mx-auto px-0 sm:px-4 py-4">
        <form
          onSubmit={handleSubmit(handleVerificationOtp)}
          className="flex flex-col gap-4"
        >
          <div>
            <h2 className="text-xl font-semibold text-center sm:text-lg">
              OTP Verification
            </h2>
            <p className="mt-1 text-center text-sm text-gray-500">
              Enter the 6-digit code sent to{" "}
              <span className="font-medium text-gray-700 break-all">
                {email}
              </span>
            </p>
          </div>

          {/* OTP INPUTS */}
          <div className="flex justify-center gap-2 sm:gap-3">
            {[...Array(6)].map((_, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                autoComplete="one-time-code"
                aria-label={`OTP digit ${index + 1}`}
                className="w-10 h-11 text-center text-base font-semibold border rounded-md focus:outline-none focus:ring-2 focus:ring-black sm:w-12 sm:h-12 sm:text-lg"
                value={otpValue[index] || ""}
                onChange={(e) =>
                  handleOtpChange(e.target.value.replace(/\D/, ""), index)
                }
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
              />
            ))}
          </div>

          {errors.otp && (
            <p className="text-xs text-red-500 text-center">
              {errors.otp.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-sm font-medium text-white transition-colors sm:py-2
              disabled:cursor-not-allowed disabled:bg-gray-400
              bg-black hover:bg-gray-800"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => handleResendOtp(email)}
            className="text-sm text-center text-blue-600 hover:underline"
          >
            Resend OTP
          </button>
        </form>
      </div>
    </>
  );
}
