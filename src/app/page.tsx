import DatePicker from "@/components/DatePicker";
import DatePickerProvider from "@/context/DatePickerContext";
import { format } from "date-fns";
import Alert from "../components/Alert";

export default function Home() {
  return (
    <div className="container mx-auto min-h-[100dvh] flex flex-col gap-8 items-center mt-6">
      <DatePickerProvider>
        <h1 className="text-[#94A3B8] text-3xl w-fit">
          Today: {format(new Date(), "d MMMM, yyyy")}
        </h1>
        <Alert />
        <DatePicker />
      </DatePickerProvider>
    </div>
  );
}
