"use client"

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerProps = {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  maxDate?: Date
};

const DatePicker = ({ value, onChange, maxDate }: DatePickerProps) => {

  const today = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          size={"action"}
          className={cn(
            "w-full justify-start text-left font-normal px-3",
            !value && "text-muted-foreground"
          )}
        >
          {value ? format(value, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        {maxDate
          ?
          // For selling date
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => date < new Date(today.setHours(0, 0, 0, 0)) || date > maxDate
            }
            initialFocus
          />
          :
          // For event date
          <Calendar
            mode="single"
            selected={value}
            onSelect={onChange}
            disabled={(date) => date < new Date(today.setHours(0, 0, 0, 0))
            }
            initialFocus
          />
        }
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;