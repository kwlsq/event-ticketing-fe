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
  }, [session, setUserDetail, reset]);

  useEffect(() => {
    if (session) {
      updateUserDetail();
    }
  }, [session, updateUserDetail]);

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
      console.log(userDetail);

      toast.success("Update profile successful!");
    } catch (err) {
      toast.error("Update profile failed!");
      console.error("Error:", err);
    }
  };
  return (
    <div className="flex flex-col">
      <div className="font-medium md:text-4xl mb-8">Organizer info</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-3 mb-10">
          <div className="flex flex-col gap-2">
            <div className="font-medium text-xl">Profile</div>
            <div className="text-gray-500">Description</div>
          </div>
          <div className="col-span-2">
            <input
              id="name"
              type="name"
              placeholder="name"
              {...register("name")}
              className="border border-gray-300 p-2 rounded text-black text-sm w-full"
            />
            {errors.name && (
              <span className="text-red-500">{errors.name.message}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 mb-8">
          <div className="flex flex-col gap-2">
            <div className="font-medium text-xl">Account</div>
            <div className="text-gray-500">Description</div>
          </div>
          <div className="col-span-2">
            <input
              id="email"
              type="email"
              placeholder="email"
              {...register("email")}
              className="border border-gray-300 p-2 rounded text-black text-sm w-full"
            />
            {errors.email && (
              <span className="text-red-500">{errors.email.message}</span>
            )}
          </div>
          <div className="col-start-2 col-span-2">
            <input
              id="msisdn"
              type="msisdn"
              placeholder="phone number"
              maxLength={16}
              {...register("msisdn")}
              className="border border-gray-300 p-2 rounded text-black text-sm w-full"
            />
            {errors.msisdn && (
              <span className="text-red-500">{errors.msisdn.message}</span>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          {error && <span className="text-red-500">{error}</span>}
          <Button
            disabled={isLoading}
            type="submit"
            size="action"
            className="w-fit p-4"
          >
            {isLoading ? "Loading..." : "Update profile"}
          </Button>
        </div>
      </form>
    </div>
  );
}
