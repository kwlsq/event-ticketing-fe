"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import DatePicker from "../components/Date Picker"
import { z } from 'zod'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import EventTicketTypeCard from '../components/Event Ticket Type/index';
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react";
import NewOrganizerView from "./NewOrganizerView";
import PlusIcon from "../../../public/icon/Plus Icon.svg";
import Image from "next/image"
import { useEvents } from "../context/use-event"
import axios from "axios"
import { API_URL } from "@/constants/url"

const ticketTypeSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty!" }),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative().min(10, { message: "Minimum stock is 10!" })
});

const eventFormSchema = z.object({
  name: z.string().min(1, { message: "Event name cannot be empty!" }).min(5, { message: "Should be more than 5 characters" }),
  description: z.string().min(1, { message: "Description cannot be empty!" }).max(255),
  date: z.date({ required_error: "Date is required!" }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, { message: "Date cannot be in the past!" }),
  venue: z.string().min(1, { message: "Please input event venue!" }),
  ticketSaleDate: z.date({ required_error: "Date is required!" }).refine((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date >= today;
  }, { message: "Date cannot be in the past!" }),
  isEventFree: z.boolean(),
  location: z.string(),
  ticketTypeRequest: z.array(ticketTypeSchema)
});

export type EventForm = z.infer<typeof eventFormSchema>;

export default function CreateEvent() {
  const { data: session } = useSession();

  const { register, control, handleSubmit, watch, setValue, formState: { errors }, } = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ticketTypeRequest: [],
      isEventFree: true
    }
  });

  const { regencies, createEvent } = useEvents();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypeRequest"
  })

  const watchType = watch("isEventFree");

  useEffect(() => {
    if (watchType) {
      setValue("ticketTypeRequest", [{ name: "Regular", price: 0, stock: 10 }])
    } else {
      if (fields.length === 0) {
        append({ name: "", price: 10000, stock: 10 });
      }
    }
  }, [watchType, append, fields.length, setValue]);

  const [files, setFiles] = useState<FileList | null>(null);

  const onSubmit = async (data: EventForm) => {
    try {
      let imageUploadResponse = null;

      const formData = new FormData();

      if (!session || !session.accessToken) {
        console.error("Authentication error!");
        return;
      }

      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          formData.append("multipartFiles", files[i]);
        }

        // create event first
        const createdEvent = await createEvent(data, session?.accessToken);

        console.log(createdEvent);

        if (createdEvent === undefined) {
          return null;
        }

        const res = await axios.post(
          `${API_URL.BASE_URL_LOCAL}${API_URL.endpoints.image}/${createdEvent.id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${session.accessToken}`,
            },
          }
        );

        imageUploadResponse = res.data;
        console.log(imageUploadResponse);

      }

      // Send event + image data to your own event creation endpoint here (if needed)
      console.log("Event form data:", data);
      console.log("Uploaded image URLs:", imageUploadResponse.url);

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return session ? (
    <form
      className="w-full flex gap-4 px-24"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-2/3 flex flex-col">
        <div className="flex flex-col gap-4">
          {/* Define event details */}
          <div className="flex flex-col gap-4 p-6 border border-neutral-300 rounded-xl">
            <div className="flex flex-col">
              <label className="text-xl font-medium">
                Event details <span className="text-red-500">*</span>
              </label>
              <p className="text-sm">Define ticket type that can be bought by customer</p>
            </div>
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Event name <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Event name"
                  {...register("name")}
                  className={`border ${errors.name && 'border-red-500'}`}
                />
                {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1">
                <Input
                  placeholder="Description"
                  {...register("description")}
                  className={`border ${errors.name && 'border-red-500'}`}
                />
                {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}

              </div>
            </div>

            {/* Event date */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Event date <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1">
                <Controller
                  control={control}
                  name="date"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.date && <p className="text-xs text-red-500">{errors.date.message}</p>}
              </div>
            </div>

            {/* When the ticket can be bought */}
            <div className="flex flex-col gap-3">
              <label className="text-sm font-medium">
                Ticket selling date <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-1">
                <Controller
                  control={control}
                  name="ticketSaleDate"
                  render={({ field }) => (
                    <DatePicker
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                {errors.ticketSaleDate && <p className="text-xs text-red-500">{errors.ticketSaleDate.message}</p>}
              </div>
            </div>

            <div className="flex gap-3">
              {/* Event venue */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-medium">
                  Event venue <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-1">
                  <Input
                    placeholder="Venue name"
                    {...register("venue")}
                  />
                  {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
                </div>
              </div>

              {/* Pick event location (city) */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-medium">
                  Location <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-col gap-1">
                  <Controller
                    control={control}
                    name="location"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select location" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>
                              Location
                            </SelectLabel>
                            {regencies.map((regency) => (
                              <SelectItem key={regency.code} value={regency.name}>
                                {regency.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              {/* Choose event type (free or paid) */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-medium">
                  Event type <span className="text-red-500">*</span>
                </label>
                <Controller
                  control={control}
                  name="isEventFree"
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString()}
                      onValueChange={(val) => field.onChange(val === "true")}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Paid" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="true">Free</SelectItem>
                          <SelectItem value="false">Paid</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              {/* Choose event category */}
              <div className="flex flex-col gap-3 w-full">
                <label className="text-sm font-medium">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>
                        Category
                      </SelectLabel>
                      <SelectItem value="Music">Music</SelectItem>
                      <SelectItem value="Art">Art</SelectItem>
                      <SelectItem value="Workshop">Workshop</SelectItem>
                      <SelectItem value="Culinary">Culinary</SelectItem>
                      <SelectItem value="Fair">Fair</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
        <div>
          {/* Upload event image */}
          <div className="flex flex-col gap-4 p-6 border border-neutral-300 rounded-xl">
            <div className="flex flex-col">
              <label className="text-xl font-medium">
                Media upload <span className="text-red-500">*</span>
              </label>
              <p className="text-sm">Upload your event image or posters</p>

              <input
                type="file"
                name="multipartFiles"
                accept="image/*"
                multiple
                onChange={(e) => setFiles(e.target.files)}
                className="mb-4"
              />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-1/3">
        {/* Define ticket type */}
        <div className="flex flex-col gap-4 p-6 border border-neutral-300 rounded-xl">
          <div className="flex flex-col">
            <label className="text-xl font-medium">
              Ticket type <span className="text-red-500">*</span>
            </label>
            <p className="text-sm">Define ticket type that can be bought by customer</p>
          </div>
          <div className="flex flex-col gap-3">
            {fields.map((field, index) => (
              <EventTicketTypeCard
                key={field.id}
                index={index}
                register={register}
                errors={errors}
                remove={() => remove(index)}
                isEventFree={watchType}
              />
            ))}
            {/* Button to add new ticket type card */}
            {!watchType && (
              <Button
                type="button"
                variant={"outline"}
                size={"action"}
                className="border-dashed text-sm flex flex-col gap-3 h-fit p-6"
                onClick={() => append({ name: "", price: 10000, stock: 10 })}
              >
                <Image
                  src={PlusIcon}
                  width={36}
                  height={36}
                  alt="Plus Icon"
                />
                Add Ticket Type
              </Button>
            )}
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ) : (
    <NewOrganizerView />
  );
}
