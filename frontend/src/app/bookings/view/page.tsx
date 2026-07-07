"use client";

import { ClientContex } from "@/src/contex/ClientContex";
import { BookingService } from "@/src/services";
import { IBookingResponse } from "@/src/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { formatDate } from "@/src/helpers/FormatDate";

export default function ViewBooking() {
  const bookingService = new BookingService();
  const [data, setData] = useState<IBookingResponse>();
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const [successMessage, setSuccessMessage] = useState<string[]>([]);
  const { clientInfo } = useContext(ClientContex);
  const router = useRouter();

  useEffect(() => {
    if (!clientInfo?.id) {
      router.push("/");
    }
  }, [clientInfo, router]);

  useEffect(() => {
    if (errorMessage.length === 0) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage([]);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (successMessage.length === 0) return;

    const timer = setTimeout(() => {
      setSuccessMessage([]);
    }, 3000);

    return () => clearTimeout(timer);
  }, [successMessage]);

  type FormValue = { id: string };
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    defaultValues: { id: "" },
  });

  const onSubmit: SubmitHandler<FormValue> = async (value: FormValue) => {
    setData(undefined);
    setErrorMessage([]);
    setSuccessMessage([]);
    try {
      const result = await bookingService.getByIdAsync(value.id);

      if (result.errors) {
        setErrorMessage(result.errors);
        return;
      }

      if (result.statusCode == 200 && result.data) {
        setSuccessMessage(["Booking found successfully"]);
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
        {successMessage.length > 0 && (
          <div className="text-success text-centered-content mb-3">
            {successMessage}
          </div>
        )}
        {errorMessage.length > 0 && (
          <div className="text-danger mb-3">{errorMessage}</div>
        )}
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
          <div className="booking-data">
            <div className="card booking-card mt-3">
              <div className="card-item">Client ID: {data.clientId}</div>
              <div className="card-item">Expert ID: {data.expertId}</div>
              <div className="card-item"> Slot ID: {data.slotId}</div>
              <div className="card-item">
                Created at:{" "}
                {data.createdAt ? formatDate(new Date(data.createdAt)) : "N/A"}
              </div>
              <div className="card-item">Status: {data.status}</div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
