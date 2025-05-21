import { registerUser } from "@/app/services/userService";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useParams } from "next/navigation";

const formSchema = z.object({
  name: z.string().nonempty(),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  referralCode: z.string().max(8).optional(),
});

type FormData = z.infer<typeof formSchema>;

const RegisterDialogContent: React.FC<Props> = ({ setIsRegister }) => {
  const [openDialog, setopenDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });
  const params = useParams();
  console.log(params.type);

  const registrationType = params.type === "organizer" ? "organizer" : "user";
  console.log(registrationType);

  const onSubmit = async (data: FormData) => {
    console.log(data);
    setError(null);
    setIsLoading(true);
    try {
      const res = await registerUser(registrationType, {
        name: data.name,
        email: data.email,
        password: data.password,
        code: data.referralCode,
      });
      console.log("Success:", res);
    } catch (err) {
      console.error("Error:", err);
    }
    // try {
    //   const result = await signIn("credentials", {
    //     redirect: false,
    //     email: data.email,
    //     password: data.password,
    //   });
    //   console.log(result);
    //   if (!result?.ok) {
    //     setError(
    //       result?.error || "An unexpected error occurred. Please try again."
    //     );
    //   } else {
    //     setopenDialog(!openDialog);
    //   }
    // } catch (error) {
    //   console.error("An unexpected error occurred:", error);
    //   setError("An unexpected error occurred. Please try again.");
    // } finally {
    //   setIsLoading(false);
    // }
  };
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold">Create account</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="font-medium text-sm">
            Name
          </label>
          <input
            id="name"
            type="name"
            placeholder="Type your name"
            {...register("name")}
            className="border border-gray-300 p-2 rounded text-black text-sm"
          />
          {errors.name && (
            <span className="text-red-500">{errors.name.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="font-medium text-sm">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Type your email"
            {...register("email")}
            className="border border-gray-300 p-2 rounded text-black text-sm"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="font-medium text-sm">
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Type your password"
            {...register("password")}
            className="border border-gray-300 p-2 rounded text-black text-sm"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="referralCode" className="font-medium text-sm">
            Referral code (optional)
          </label>
          <input
            id="referralCode"
            type="referralCode"
            placeholder="Type your referral code"
            maxLength={8}
            {...register("referralCode")}
            className="border border-gray-300 p-2 rounded text-black text-sm"
          />
          {errors.referralCode && (
            <span className="text-red-500">{errors.referralCode.message}</span>
          )}
        </div>

        <div className="flex flex-col items-center gap-2 mt-5">
          <Button disabled={isLoading} type="submit" size="action">
            {isLoading ? "Loading..." : "Create account"}
          </Button>
          <p className="text-sm">
            Have an account?{" "}
            <span
              className="text-primary font-medium cursor-pointer"
              onClick={() => setIsRegister(false)}
            >
              Login
            </span>
          </p>
        </div>

        {error && <span className="text-red-500">{error}</span>}
      </form>
    </DialogContent>
  );
};

export default RegisterDialogContent;
