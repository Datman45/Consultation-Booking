"use client";

import { ClientContex } from "@/src/contex/ClientContex";
import { BookingService } from "@/src/services/BookingService";
import { SlotService } from "@/src/services/SlotService";
import { ISlot } from "@/src/types";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";

export default function Bookings() {
  const slotService = new SlotService();
  const bookingService = new BookingService();
  const [data, setData] = useState<ISlot[]>([]);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const { setClientInfo, clientInfo } = useContext(ClientContex);
  const router = useRouter();

  useEffect(() => {
    if (!clientInfo?.id) {
      router.push("/");
    }
  }, [clientInfo, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await slotService.getAllAsync();

        setData(response?.data ?? []);
      } catch (error) {
        setErrorMessage([(error as Error).message]);
      }
    };
    fetchData();
  }, []);

  async function handleSubmit(slot: ISlot) {
    if (!slot.id) {
      setErrorMessage(["Slot id is missing"]);
      return;
    }

    if (!clientInfo?.id) {
      setErrorMessage(["Client id is missing"]);
      return;
    }

    const inputData = {
      clientId: clientInfo?.id,
      expertId: slot.expert_id,
      slotId: slot.id,
    };

    try {
      const response = await bookingService.createAsync(inputData);

      if (response.errors) {
        setErrorMessage(response.errors);
        return;
      }

      if (!response.errors && clientInfo && setClientInfo) {
        setClientInfo({
          ...clientInfo,
          credits: clientInfo.credits - 100,
        });
      }

      setErrorMessage([]);
    } catch (error) {
      setErrorMessage([(error as Error).message]);
    }
  }

  function formatDate(value: Date | undefined): string | undefined {
    if (!value) {
      return undefined;
    }

    const date = new Date(value);

    const days = String(date.getDate()).padStart(2, "0");
    const months = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear());

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return days + "." + months + "." + year + " | " + hours + ":" + minutes;
  }

  return (
    <>
      <div className="container">
        <div className="text-centered-content">
          <h2>Available slots:</h2>
        </div>
        <div className="text-danger text-centered-content">{errorMessage}</div>
        <div className="cards mt-3">
          {data.map((slot) => (
            <div className="card" key={slot.id}>
              <div className="card-expert mb-1">
                Expert: {slot.first_name} {slot.last_name}
              </div>
              <div className="card-date mb-3">
                Date: {formatDate(slot.date)}
              </div>
              <div className="card-btn mb-1">
                <button
                  className="btn btn-primary"
                  onClick={() => handleSubmit(slot)}
                >
                  Book
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
