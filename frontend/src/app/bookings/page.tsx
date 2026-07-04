"use client";

import { SlotService } from "@/src/services/SlotService";
import { ISlot } from "@/src/types/domain/ISlot";
import { useEffect, useState } from "react";

export default function Bookings() {
  const slotService = new SlotService();
  const [data, setData] = useState<ISlot[]>([]);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await slotService.getAllAsync();

        console.log(response.data);

        setData(response?.data ?? []);
      } catch (error) {
        setErrorMessage([(error as Error).message]);
      }
    };
    fetchData();
  }, []);

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
                <button className="btn btn-primary">Book</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
