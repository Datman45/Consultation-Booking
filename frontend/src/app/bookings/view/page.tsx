"use client";

import { BookingService } from "@/src/services";
import { IBooking2 } from "@/src/types";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

export default function ViewBooking() {
  const bookingService = new BookingService();
  const [data, setData] = useState<IBooking2>();
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  type FormValue = { id: string };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: { id: "" },
  });

  const onSubmit: SubmitHandler<FormValue> = async (value: FormValue) => {
    try {
      const result = await bookingService.getByIdAsync(value.id);

      if (result.errors) {
        setErrorMessage(result.errors);
        return;
      }

      setData(result.data);
    } catch (error) {
      setErrorMessage([(error as Error).message]);
    }
  };

  return (
    <>
      <div className="container text-centered-content">
        <h2>Find Booking by ID</h2>
        {errorMessage && <div className="text-danger mb-3">{errorMessage}</div>}
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <input
              className="form-control mb-3"
              type="text"
              placeholder="Enter Booking ID"
              {...register("id", {
                required: "ID is required",
                minLength: {
                  value: 36,
                  message: "ID length must be 36 symbols",
                },
                maxLength: {
                  value: 36,
                  message: "ID length must be 36 symbols",
                },
              })}
            />
            {errors.id && (
              <div className="text-danger field-validation-valid mb-3">
                {errors.id.message}
              </div>
            )}
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>
        {data && (
          <div className="card mt-3">
            <div className="card-item">Client ID: {data?.client_id}</div>
            <div className="card-item">Expert ID: {data?.expert_id}</div>
            <div className="card-item"> Slot ID: {data?.slot_id}</div>
            <div className="card-item">Status: {data?.status}</div>
          </div>
        )}
      </div>
    </>
  );
}
