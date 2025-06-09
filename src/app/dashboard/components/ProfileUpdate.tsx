"use client";
import { useUserContext } from "@/app/context/userContext";
import { getProfile, udpateProfile } from "@/app/services/userService";
import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  msisdn: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export default function ProfileUpdate() {
  const { data: session } = useSession();
  const { userDetail, setUserDetail } = useUserContext();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(formSchema) });

  const updateUserDetail = useCallback(async () => {
    try {
      const userDetailResponse = await getProfile(session);
      setUserDetail(userDetailResponse.data);
      reset(userDetailResponse.data);
    } catch (error) {
      console.error(error);
    }
  }, [session?.accessToken, setUserDetail, reset]);

  useEffect(() => {
    if (session) {
      updateUserDetail();
    }
  }, [session?.accessToken, updateUserDetail]);

  useEffect(() => {
    if (userDetail) {
      reset(userDetail);
    }
  }, [userDetail, reset]);

  const onSubmit = async (userRequest: FormData) => {
    setError(null);
    setIsLoading(true);
    try {
      await udpateProfile(session, userRequest);
      setUserDetail(userRequest);
      setIsLoading(false);
      toast.success("Update profile successful!");
    } catch (err) {
      toast.error("Update profile failed!");
      console.error("Error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="font-medium text-lg md:text-xl">Profile</div>
          <div className="text-gray-500 text-sm">Description</div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-2">
          <input
            id="name"
            type="text"
            placeholder="Name"
            {...register("name")}
            className="border border-gray-300 p-2 rounded text-black text-sm w-full"
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <div className="font-medium text-lg md:text-xl">Account</div>
          <div className="text-gray-500 text-sm">Description</div>
        </div>
        <div className="md:col-span-2 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <input
              id="email"
              type="email"
              placeholder="Email"
              {...register("email")}
              className="border border-gray-300 p-2 rounded text-black text-sm w-full"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <input
              id="msisdn"
              type="tel"
              placeholder="Phone number"
              maxLength={16}
              {...register("msisdn")}
              className="border border-gray-300 p-2 rounded text-black text-sm w-full"
            />
            {errors.msisdn && (
              <span className="text-red-500 text-sm">
                {errors.msisdn.message}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:justify-end sm:flex-row justify-between items-start sm:items-center">
        {error && <span className="text-red-500 text-sm mb-2">{error}</span>}
        <Button
          disabled={isLoading}
          type="submit"
          size="action"
          className="w-full sm:w-auto px-6 py-3"
        >
          {isLoading ? "Loading..." : "Update profile"}
        </Button>
      </div>
    </form>
  );
}
