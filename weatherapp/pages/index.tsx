import Head from "next/head";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { useState, useEffect } from "react";
import Image from "next/image";

type WeatherData = {
  latitude: number;
  longitude: number;
  timezone: string;
  daily_units: {};
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    weathercode: number[];
  };
};

type GeoData = {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country_code: string;
  country: string;
};

type ResultsGeo = {
  results: GeoData[];
};

const CityTable = ({
  city,
  setResultsGeo,
  setGeoData,
  setWeatherData,
}: {
  city: ResultsGeo;
  setResultsGeo: React.Dispatch<React.SetStateAction<ResultsGeo | null>>;
  setGeoData: React.Dispatch<React.SetStateAction<GeoData | null>>;
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>;
}) => {
  return (
    <div className="rounded-lg border shadow-2xl">
      <table className="table-auto my-5">
        <thead>
          <tr className="text-gray-300 font-bold text-lg uppercase">
            <th>Country</th>
            <th>latitude</th>
            <th>longitude</th>
            <th>timezone</th>
          </tr>
        </thead>
        <tbody>
          {city.results.map((geoData) => (
            <tr
              className="border-b border-neutral-700 rounded-lg hover:bg-neutral-700 hover:scale-110"
              onClick={() => {
                setGeoData(geoData);
                setResultsGeo(null);
                getData(
                  geoData.latitude.toString(),
                  geoData.longitude.toString(),
                  setWeatherData
                );
              }}
              key={geoData.latitude + geoData.longitude}
            >
              <td className="px-6 py-4">{geoData.country}</td>
              <td className="px-6 py-4">{geoData.latitude}</td>
              <td className="px-6 py-4">{geoData.longitude}</td>
              <td className="px-6 py-4">{geoData.timezone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const getData = async (
  lat: string,
  long: string,
  setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>>
) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,weathercode&timezone=auto`
  );
  const weatherData: WeatherData = await res.json();
  if (!weatherData) {
    setWeatherData(null);
    return;
  }
  setWeatherData(weatherData);
};

const WeatherDashboard = ({
  weatherData,
}: {
  weatherData: WeatherData | null;
}) => {
  const dayDef: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDate = new Date().getDay();
  let weatherDaily: JSX.Element[] = [];
  let sunrise = "";
  let sunset = "";
  if (weatherData) {
    sunset =
      new Date(weatherData.daily.sunset[0]).getHours().toString() +
      ":" +
      new Date(weatherData.daily.sunset[0]).getMinutes().toString();
    sunrise =
      new Date(weatherData.daily.sunrise[0]).getHours().toString() +
      ":" +
      new Date(weatherData.daily.sunrise[0]).getMinutes().toString();
  }

  for (let i = 0; i < 7; i++) {
    if (weatherData?.daily) {
      let date = new Date(weatherData.daily.time[i]);
      let day = date.getDay();
      weatherDaily.push(
        <div
          key={i}
          className="items-center bg-neutral-800 rounded-lg w-fit flex flex-col p-2 space-y-2"
        >
          <h1 className="text-center text-xl font-mono font-bold">
            {todayDate === day ? "Today" : dayDef[day]}
          </h1>
          <Image
            priority
            src="/nuage.svg"
            alt="nuage Icon"
            height={40}
            width={40}
          />
          <div className="flex flex-row space-x-2">
            <p className="font-bold">
              {weatherData?.daily.temperature_2m_max[i]}°C
            </p>
            <p className="font-light">
              {weatherData?.daily.temperature_2m_min[i]}°C
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-2 gap-4 mx-4">
        <div className="overflow-auto bg-neutral-900 rounded-xl items-start row-span-2 p-6 flex flex-col space-x-2 space-y-3 text-center ">
          <h1 className="text-center text-xl font-mono font-bold">
            Sunrise & Sunset
          </h1>
          <div className="flex flex-row space-x-4 items-center">
            <Image
              priority
              src="/sunny.svg"
              alt="Sunny Icon"
              height={40}
              width={40}
            />
            <p className="text-2xl font-medium">{sunrise}</p>
          </div>
          <div className="flex flex-row space-x-4 items-center">
            <Image
              priority
              src="/night.svg"
              alt="night Icon"
              height={40}
              width={40}
            />
            <p className="text-2xl font-medium">{sunset}</p>
          </div>
        </div>
        <div className="overflow-auto bg-neutral-900 col-span-2 rounded-xl row-span-2 p-6 flex flex-row space-x-3">
          {weatherDaily}
        </div>

        <h1 className="bg-neutral-900 py-4 px-4 text-center rounded-xl text-lg font-semibold">
          Paris Weather DashBoard
        </h1>
      </div>
    </>
  );
};

export default function Home() {
  const [resultsGeo, setResultsGeo] = useState<ResultsGeo | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    setGeoData(null);
    // Read the form data
    const form = e.currentTarget;
    const formData = new FormData(form);

    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${form.City.value}`
    );
    const resultsGeo: ResultsGeo = await res.json();
    if (resultsGeo) setResultsGeo(resultsGeo);
    else setResultsGeo(null);
  }

  return (
    <>
      <Head>
        <title>WeatherDashboard</title>
        <meta name="description" content="WeatherDashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
      </Head>
      <main className=" text-white">
        <div className="flex space-y-4 flex-col h-screen justify-center items-center mt-8">
          <form method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <label className="text-center text-4xl font-mono font-bold">
                Your City
              </label>
              <div className="flex flex-row space-x-1">
                <input
                  className="text-black rounded-lg px-2 py-1 bg-gray-100"
                  name="City"
                  defaultValue="Paris"
                  type="text"
                />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
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
          {resultsGeo && (
            <CityTable
              city={resultsGeo}
              setGeoData={setGeoData}
              setResultsGeo={setResultsGeo}
              setWeatherData={setWeatherData}
            />
          )}
          {geoData && <WeatherDashboard weatherData={weatherData} />}
        </div>
      </main>
    </>
  );
}
