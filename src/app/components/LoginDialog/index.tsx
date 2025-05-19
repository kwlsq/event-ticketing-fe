"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

export default function LoginDialog() {
  const router = useRouter();
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession({
    required: true,
    onUnauthenticated: () => {
      console.log(session);
      console.log("Session expired, opening login dialog...");
      setOpenLoginDialog(true);
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
      console.log(result);
      if (!result?.ok) {
        setError(
          result?.error || "An unexpected error occurred. Please try again."
        );
      } else {
        if (
          session?.user.roles.includes("ADMIN") ||
          session?.user.roles.includes("ORGANIZER")
        ) {
          router.push("/dashboard");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={openLoginDialog} onOpenChange={setOpenLoginDialog}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpenLoginDialog(true)}>Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="border border-gray-300 p-2 rounded text-black"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              {...register("password")}
              className="border border-gray-300 p-2 rounded text-black"
            />
            {errors.password && (
              <span className="text-red-500">{errors.password.message}</span>
            )}
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 text-white p-2 rounded"
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
          {error && <span className="text-red-500">{error}</span>}
        </form>
      </DialogContent>
    </Dialog>
  );
}
