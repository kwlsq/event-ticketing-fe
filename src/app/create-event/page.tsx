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
import { toast } from "sonner";
import { subDays } from "date-fns"
import { Textarea } from "@/components/ui/textarea"

const ticketTypeSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty!" }),
  price: z.number().nonnegative(),
  stock: z.number().nonnegative().min(10, { message: "Minimum stock is 10!" })
});

enum PromotionType {
  Percentage = "PERCENTAGE",
  Nominal = "NOMINAL"
}

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
  categoryID: z.number(),
  ticketTypeRequest: z.array(ticketTypeSchema),
  eventPromotion: z.object({
    name: z.string().min(1, { message: "Promotion name cannot be empty!" }).min(5, { message: "Should be more than 5 characters" }),
    description: z.string().min(1, { message: "Description name cannot be empty!" }).min(5, { message: "Should be more than 5 characters" }),
    type: z.enum([PromotionType.Percentage, PromotionType.Nominal]),
    value: z.number(),
    maxUsage: z.number(),
    isReferralPromotion: z.boolean(),
    period: z.number()
  }).nullable().optional()
});

export type EventForm = z.infer<typeof eventFormSchema>;

export default function CreateEvent() {
  const { data: session } = useSession();
  const { regencies, createEvent, uploadImage, createPromotion, categories } = useEvents();
  const [files, setFiles] = useState<FileList | null>(null);
  const [mediaPreviews, setMediaPreviews] = useState<string[]>();

  const filteredCategories = categories?.filter((category) => category.name !== "All");

  const { register, control, handleSubmit, watch, setValue, formState: { errors }, } = useForm<EventForm>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      ticketTypeRequest: [],
      isEventFree: true,
      eventPromotion: {
        name: "Early Bird",
        description: "Event Promotion",
        type: PromotionType.Percentage,
        value: 0,
        maxUsage: 0,
        isReferralPromotion: false,
        period: 1
      },
      location: ""
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypeRequest"
  })

  const watchType = watch("isEventFree");
  const watchDate = watch("date");

  // Calculate maxSelling date (maximum selling date is 3 days before event date)
  const maxTicketSaleDate = watchDate ? subDays(new Date(watchDate), 3) : undefined;

  useEffect(() => {
    if (watchType) {
      setValue("ticketTypeRequest", [{ name: "Regular", price: 0, stock: 10 }])
    } else {
      if (fields.length === 0) {
        append({ name: "", price: 10000, stock: 10 });
      }
    }
  }, [watchType, append, fields.length, setValue]);

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;

    if (selectedFiles) {
      setFiles(selectedFiles);

      const mediaUrls = Array.from(selectedFiles).map((file) =>
        URL.createObjectURL(file)
      );
      setMediaPreviews(mediaUrls);
    }
  }


  const onSubmit = async (data: EventForm) => {
    try {

      console.log(data);
      

      let createdEvent = null;
      let imageUploadResponse = false;
      let createPromotionResponse = false;

      if (!session || !session.accessToken) {
        console.error("Authentication error!");
        return;
      }

      // create event first
      createdEvent = await createEvent(data, session?.accessToken);

      if (createdEvent === undefined) {
        return null;
      }

      // upload image
      if (files && files.length > 0) {
        const filesArray = Array.from(files);
        imageUploadResponse = await uploadImage(filesArray, session.accessToken, createdEvent.id);

        if (imageUploadResponse) {
          console.log("Image upload successful");
        }
      }

      // create promotion
      if (data.eventPromotion) {
        // match form promotion data with Promotion Request DTO
        const promotionRequest = {
          ...data.eventPromotion,
          eventID: createdEvent.id
        }

        console.log(promotionRequest);


        createPromotionResponse = await createPromotion(promotionRequest, session.accessToken);

        if (createPromotionResponse) {
          console.log("Create promotion successful");
        }
      }

      if (createEvent !== undefined && imageUploadResponse && createPromotionResponse) {
        toast.success("Successfully create event!")
      }

    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return session ? (
    <form
      className="w-full px-24"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h1 className="mt-9 mb-14 text-3xl font-semibold">Create Event</h1>
      <div className="w-full flex gap-4">
        <div className="w-2/3 flex flex-col gap-4">
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
                  <Textarea
                    placeholder="Event description"
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
                        value={field.value ?? ""}
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
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        maxDate={maxTicketSaleDate}
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
                          value={field.value ?? ""}
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
                        value={field.value?.toString() ?? ""}
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
                  <Controller
                    control={control}
                    name="categoryID"
                    render={({ field }) => (
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={(value) => field.onChange(Number(value))}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Category</SelectLabel>
                            {filteredCategories?.map((category) => (
                              <SelectItem key={category.id} value={category.id.toString()}>
                                {category.name}
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
          </div>
          <div>
            {/* Upload event image */}
            <div className="flex flex-col gap-4 p-6 border border-neutral-300 rounded-xl">
              <div className="flex flex-col">
                <label className="text-xl font-medium">
                  Media upload <span className="text-red-500">*</span>
                </label>
                <p className="text-sm">Add your event posters here, you can upload up to 5 files max</p>
                <div >
                  <input
                    type="file"
                    name="multipartFiles"
                    accept="image/*"
                    multiple
                    onChange={handleMediaChange}
                    className="p-4 border-neutral-200 border-dashed border-[1px] rounded-md w-full hover:bg-neutral-100"
                  />
                </div>
                <div className="flex gap-2">
                  {mediaPreviews?.map((media, index) => (
                    <Image
                      key={index}
                      src={media}
                      width={1000}
                      height={1000}
                      alt="image of event"
                      className="w-16 h-16 object-cover rounded-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-1/3 gap-4">
          {/* Define ticket type */}
          <div className="flex flex-col gap-2">
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
          </div>

          {/* Create promotion */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4 p-6 border border-neutral-300 rounded-xl">
              <div className="flex flex-col">
                <label className="text-xl font-medium">
                  Promotion (optional)
                </label>
                <p className="text-sm">Add promotion to boost sales</p>
              </div>
              <div className="flex flex-col gap-3">
                {/* Input promotion name */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium">
                    Name
                  </label>
                  <div className="flex flex-col gap-1">
                    <Input
                      placeholder="Promotion name"
                      {...register("eventPromotion.name")}
                      className={`border ${errors.eventPromotion?.name && 'border-red-500'}`}
                    />
                    {errors.eventPromotion?.name && <p className="text-red-500 text-xs">{errors.eventPromotion?.name.message}</p>}
                  </div>
                </div>
                {/* Input promotion description */}
                <div className="flex flex-col gap-3">
                  <label className="text-sm font-medium">
                    Description
                  </label>
                  <div className="flex flex-col gap-1">
                    <Input
                      placeholder="Promotion description"
                      {...register("eventPromotion.description")}
                      className={`border ${errors.eventPromotion?.description && 'border-red-500'}`}
                    />
                    {errors.eventPromotion?.description && <p className="text-red-500 text-xs">{errors.eventPromotion?.description.message}</p>}
                  </div>
                </div>

                <div className="flex gap-2">
                  {/* Input promotion value */}
                  <div className="flex flex-col gap-3 w-3/5">
                    <label className="text-sm font-medium">
                      Value
                    </label>
                    <div className="flex flex-col gap-1">
                      <Input
                        type="number"
                        placeholder="Promotion value"
                        {...register("eventPromotion.value", { valueAsNumber: true })}
                        className={`border ${errors.eventPromotion?.value && 'border-red-500'}`}
                      />
                      {errors.eventPromotion?.value && <p className="text-red-500 text-xs">{errors.eventPromotion?.value.message}</p>}
                    </div>
                  </div>

                  {/* Choose promotion unit (percentage or nominal) */}
                  <div className="flex flex-col gap-3 w-2/5">
                    <label className="text-sm font-medium">
                      Promotion unit <span className="text-red-500">*</span>
                    </label>
                    <Controller
                      control={control}
                      name="eventPromotion.type"
                      render={({ field }) => (
                        <Select
                          value={field.value ?? ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Percentage" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value={PromotionType.Percentage}>Percentage</SelectItem>
                              <SelectItem value={PromotionType.Nominal}>Nominal</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  {/* Voucher max usage */}
                  <div className="flex flex-col gap-3 w-3/5">
                    <label className="text-sm font-medium">
                      Max usage
                    </label>
                    <div className="flex flex-col gap-1">
                      <Input
                        type="number"
                        placeholder="Voucher stocks"
                        {...register("eventPromotion.maxUsage", { valueAsNumber: true })}
                        className={`border ${errors.eventPromotion?.maxUsage && 'border-red-500'}`}
                      />
                      {errors.eventPromotion?.maxUsage && <p className="text-red-500 text-xs">{errors.eventPromotion?.maxUsage.message}</p>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-medium">
                      Period (month)
                    </label>
                    <div className="flex flex-col gap-1">
                      <Input
                        type="number"
                        placeholder="Promotion period"
                        {...register("eventPromotion.period", { valueAsNumber: true })}
                        className={`border ${errors.eventPromotion?.period && 'border-red-500'}`}
                      />
                      {errors.eventPromotion?.period && <p className="text-red-500 text-xs">{errors.eventPromotion?.period.message}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            size={"action"}
          >Submit</Button>
        </div>
      </div>
    </form>
  ) : (
    <NewOrganizerView />
  );
}
