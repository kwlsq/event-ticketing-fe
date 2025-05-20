import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function CreateEvent() {
  return (
    <Select>
      <SelectTrigger>
        <SelectValue placeholder="Select a category"/>
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
  )
}