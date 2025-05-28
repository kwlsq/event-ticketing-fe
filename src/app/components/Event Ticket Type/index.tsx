import { EventForm } from "@/app/create-event/page";
import { Input } from "@/components/ui/input"
import { FieldErrors, UseFormRegister } from "react-hook-form";

type Props = {
  index: number
  isEventFree: boolean
  register: UseFormRegister<EventForm>;
  errors: FieldErrors<EventForm>;
  remove?: () => void
};

export default function EventTicketTypeCard({ index, register, errors, isEventFree }: Props) {
  const nameError = errors.ticketTypeRequest?.[index]?.name?.message;
  const priceError = errors.ticketTypeRequest?.[index]?.price?.message;
  const stockError = errors.ticketTypeRequest?.[index]?.stock?.message;

  return (
    <div
      className="w-full flex flex-col gap-4 p-4 border rounded-2xl border-neutral-300"
    >
      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium">
          Ticket type <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Event name"
            {...register(`ticketTypeRequest.${index}.name`)}
            className={`border ${nameError && 'border-red-500'}`}
            disabled={isEventFree}
            defaultValue={isEventFree ? "Regular" : ""}
          />
          {nameError && <p className="text-red-500 text-xs">{nameError}</p>}
        </div>
      </div>

      <div className="flex gap-3 w-full">
        <div className="flex flex-col gap-3 w-full">
          <label className="text-sm font-medium">
            Price (IDR) <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-1">
            <Input
              type="number"
              placeholder="Ticket price"
              {...register(`ticketTypeRequest.${index}.price`, { valueAsNumber: true})}
              className={`border ${priceError && 'border-red-500'}`}
              disabled={isEventFree}
            />
            {priceError && <p className="text-red-500 text-xs">{priceError}</p>}
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <label className="text-sm font-medium">
            Stock (pcs) <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-1">
            <Input
              type="number"
              placeholder="Ticket stock"
              {...register(`ticketTypeRequest.${index}.stock`, { valueAsNumber: true})}
              className={`border ${stockError && 'border-red-500'}`}
            />
            {stockError && <p className="text-red-500 text-xs">{stockError}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}