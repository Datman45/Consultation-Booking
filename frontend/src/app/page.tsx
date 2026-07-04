"use client";

import { useContext, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { ClientService } from "../services";
import { IClient } from "../types";
import { ClientContex } from "../contex/ClientContex";

export default function Home() {
  const clientService = new ClientService();
  const [data, setData] = useState<IClient[]>([]);
  const [errorMessage, setErrorMessage] = useState<string[]>([]);
  const { clientInfo, setClientInfo } = useContext(ClientContex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await clientService.getAllAsync();

        setData(result.data ?? []);
      } catch (error) {
        setErrorMessage([(error as Error).message]);
      }
    };
    fetchData();
  }, []);

  type FormValue = { id: string };

  const { register, handleSubmit } = useForm<FormValue>({
    defaultValues: { id: "" },
  });

  const onSubmit: SubmitHandler<FormValue> = async (value: FormValue) => {
    const selectedClient = data.find((client) => client.id === value.id);

    if (selectedClient) {
      setClientInfo!(selectedClient);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="text-centered-content mb-3">
          <h2>Please choose a profile:</h2>
        </div>
        <select
          className="form-select form-select-sm mb-3"
          aria-label=".form-select-sm example"
          {...register("id")}
        >
          <option value={""}>Click to select profile</option>
          {data.map((client) => (
            <option key={client.id} value={client.id}>
              Client ({client.credits} credits)
            </option>
          ))}
        </select>
        <div className="text-centered-content">
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
