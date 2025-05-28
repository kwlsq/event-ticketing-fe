import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useUserContext } from "@/app/context/userContext";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const LoginDialogContent = () => {
  const { updateIsOpenDialog, updateIsRegister } = useUserContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      console.log(session);
      console.log("Session expired, opening login dialog...");
      // setopenDialog(true);
    },
  });

  useEffect(() => {
    console.log("Session updated:", session);
  }, [session]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setError(null);
    setIsLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (result?.error || !result?.ok) {
        toast.error("Invalid email or password");
        return;
      }
      toast.success("Login successful!");

      updateIsOpenDialog(false);
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      toast.error("An unexpected error occurred");

      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
      <div className="flex flex-col items-center gap-2 mt-5">
        <Button disabled={isLoading} type="submit" size="action">
          {isLoading ? "Loading..." : "Login"}
        </Button>
        <p className="text-sm">
          Don’t have an account?{" "}
          <span
            className="text-primary font-medium cursor-pointer"
            onClick={() => updateIsRegister(true)}
          >
            Create Account
          </span>
        </p>
      </div>

      {error && <span className="text-red-500 text-center">{error}</span>}
    </form>
  );
};

export default LoginDialogContent;
