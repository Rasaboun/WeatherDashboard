import Head from "next/head";
import { useState, useEffect, Dispatch, SetStateAction } from "react";
import { GetServerSideProps } from "next";
import { WeekDashBoard } from "components/WeekDashBoard";
import { TodayDashBoard } from "components/TodayDashBoard";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";
import img from "./../public/favicon.png"

import {
  WeatherData,
  AirData,
  Data,
  ResultsGeo,
} from "components/type/WeatherType";

export const getServerSideProps: GetServerSideProps = async (context) => {
  let weatherDatas: WeatherData | undefined = undefined;
  let data: Data = {
    weatherData: undefined,
    airData: undefined,
  };
  try {
    const res = await fetch(
      "https://geocoding-api.open-meteo.com/v1/search?name=Paris"
    );
    const resultsGeo: ResultsGeo = await res.json();
    if (resultsGeo) {
      let lat = resultsGeo.results[0].latitude;
      let long = resultsGeo.results[0].longitude;
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&hourly=uv_index,relativehumidity_2m,windspeed_10m,apparent_temperature,temperature_2m,visibility&timezone=auto`
      );

      const rest = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&hourly=european_aqi&timezone=auto`
      );
      weatherDatas = await res.json();
      const airDatas: AirData = await rest.json();

      data.airData = airDatas;
      data.weatherData = weatherDatas;
      return { props: { data, errorFetch: false } };
    }
  } catch (error) {
    return { props: { data, errorFetch: true } };
  }
  return { props: { data, errorFetch: true } };
};

const WeatherDashboard = ({
  weatherData,
  airData,
}: {
  weatherData: WeatherData;
  airData: AirData;
}) => {
  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-4 mx-8">
        <WeekDashBoard weatherData={weatherData} />
        <TodayDashBoard airData={airData} weatherData={weatherData} />
      </div>
    </>
  );
};

const fetchWeatherData = async (
  city: string,
  setAllData: Dispatch<SetStateAction<Data>>,
  setValidColor: Dispatch<SetStateAction<string>>,
  setError: Dispatch<SetStateAction<boolean>>
) => {
  let weatherDatas: WeatherData | undefined = undefined;
  let data: Data = {
    weatherData: undefined,
    airData: undefined,
  };
  try {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${city}`
    );

    const resultsGeo: ResultsGeo = await res.json();
    if (resultsGeo.results) {
      let lat = resultsGeo.results[0].latitude;
      let long = resultsGeo.results[0].longitude;
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weathercode&hourly=uv_index,relativehumidity_2m,windspeed_10m,apparent_temperature,temperature_2m,visibility&timezone=auto`
      );

      const rest = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${long}&hourly=european_aqi&timezone=auto`
      );
      weatherDatas = await res.json();
      const airDatas: AirData = await rest.json();
      data.airData = airDatas;
      data.weatherData = weatherDatas;
      if (airDatas == undefined || weatherDatas == undefined) {
        setError(true);
      } else {
        setError(false);
      }
      setValidColor("bg-sky-200");
      setAllData(data);
    } else {
      setValidColor("border border-red-600 bg-red-100");
      setError(true);
    }
  } catch (error) {
    setError(true);
  }
};

export default function Home({
  data,
  errorFetch,
}: {
  data: Data;
  errorFetch: boolean;
}) {
  const [allData, setAllData] = useState<Data>(data);
  const [validColor, setValidColor] = useState<string>("bg-sky-200");
  const [error, setError] = useState<boolean>(errorFetch);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    const form = e.currentTarget;
    fetchWeatherData(form.City.value, setAllData, setValidColor, setError);
  }

  return (
    <>
      <Head>
        <title>WeatherDashboard</title>
        <meta name="description" content="WeatherDashboard" />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <title>Weathear DashBoard | Rasaboun</title>
        <meta
          name="description"
          content="Here is my weather dashboard that I coded in nextjs and tailwindcss"
        />
      <link rel="icon" type="image/png" href={img.src} />

        <link rel="manifest" href="/site.webmanifest" />
      </Head>
     
      <main className="text-white">
        <div className="flex space-y-10 flex-col justify-center items-center mb-10">
          <form method="post" onSubmit={handleSubmit} className="mt-10">
            <div className="flex flex-col space-y-4 items-center">
              <label className="text-center text-4xl text-sky-900 font-medium">
                Your City
              </label>
              <div className="flex flex-row space-x-1">
                <input
                  className={`text-sky-900 ${validColor} font-semibold rounded-lg px-3 py-2 placeholder-sky-700 bg-sky-50`}
                  name="City"
                  defaultValue="Paris"
                  type="text"
                  placeholder="Search City"
                />
                <button type="submit" aria-label="Search City">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    className="w-9 h-9 stroke-sky-50 "
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </form>

          {!error && (
            <WeatherDashboard
              weatherData={allData.weatherData as WeatherData}
              airData={allData.airData as AirData}
            />
          )}
        </div>
      </main>
     
    </>
  );
}
