"use client"

import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import DatePicker from "../components/Date Picker"
import { z } from 'zod'
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import EventTicketTypeCard from '../components/Event Ticket Type/index';
import { useEffect } from "react"
import { useSession } from "next-auth/react";
import NewOrganizerView from "./NewOrganizerView";

const ticketTypeSchema = z.object({
  name: z.string(),
  price: z.number(),
  stock: z.number()
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
  ticketTypeRequest: z.array(ticketTypeSchema).optional()
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypeRequest"
  })

  const watchType = watch("isEventFree");

  useEffect(() => {
    console.log(watchType);
    if (!watchType) {
      setValue("ticketTypeRequest", [{ name: "Regular", price: 0, stock: 0 }])
    } else {
      if (fields.length === 0) {
        append({ name: "", price: 0, stock: 0 });
      }
    }
  }, [watchType]);

  const onSubmit = (data: EventForm) => {
    console.log("Form submitted: ", data);
  };

  return session ? (
    <form
      className="w-full flex gap-4 px-24"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="w-2/3 flex flex-col gap-4">
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

          <div className="flex">
            <Input
              placeholder="Venue name"
              {...register("venue")}
            />
            {errors.venue && <p className="text-red-500 text-xs">{errors.venue.message}</p>}
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>
                    Location
                  </SelectLabel>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex">
            <div className="flex flex-col gap-3">
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
                    <SelectTrigger>
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

            <Select>
              <SelectTrigger>
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
      <div>

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
            {/* button to add new ticket type card */}
            {!watchType && (
              <Button type="button" onClick={() => append({ name: "", price: 0, stock: 0 })}>
                Add Ticket Type
              </Button>
            )}
          </div>
        </div>
        <Button type="submit">Submit</Button>
      </div>
    </form>
  ) : (
    <NewOrganizerView></NewOrganizerView>
  );
}
