"use client";

import { BookingService } from "@/src/services";
import { IBooking2 } from "@/src/types";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ViewBooking() {
  const bookingService = new BookingService();
  const [data, setData] = useState<IBooking2>();
  const [errorMessage, setErrorMessage] = useState("");

  type FormValue = { id: string };
  const { register, handleSubmit } = useForm<FormValue>({
    defaultValues: { id: "" },
  });

  const onSubmit: SubmitHandler<FormValue> = async (value: FormValue) => {
    try {
      const result = await bookingService.getByIdAsync(value.id);

      if (result.errors) {
        return;
      }

      setData(result.data);
    } catch (error) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <>
      <div className="container text-centered-content">
        <h2>Find Booking by ID</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Enter Booking ID"
              {...register("id")}
            ></input>
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        <div>Client ID: {data?.client_id}</div>
        <div>Expert ID: {data?.expert_id}</div>
        <div> Slot ID: {data?.slot_id}</div>
        <div>Status: {data?.status}</div>
      </div>
    </>
  );
}
