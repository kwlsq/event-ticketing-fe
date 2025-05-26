"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useSession } from "next-auth/react";
import NewOrganizerView from "./NewOrganizerView";

export default function CreateEvent() {
  const { data: session } = useSession();

  return session ? (
    <div>
      <Input placeholder="Event name"></Input>
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Category</SelectLabel>
            <SelectItem value="Music">Music</SelectItem>
            <SelectItem value="Art">Art</SelectItem>
            <SelectItem value="Workshop">Workshop</SelectItem>
            <SelectItem value="Culinary">Culinary</SelectItem>
            <SelectItem value="Fair">Fair</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  ) : (
    <NewOrganizerView></NewOrganizerView>
  );
}
