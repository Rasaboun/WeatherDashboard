import Head from "next/head";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  PieChart,
  ResponsiveContainer,
  Pie,
  Sector,
  Cell,
  Label,
  AreaChart,
  YAxis,
  XAxis,
  Tooltip,
  Area,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

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
  hourly: {
    relativehumidity_2m: number[];
    visibility: number[];
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
    <div className="rounded-lg  shadow-2xl bg-neutral-900">
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
              className="border-b border-neutral-800 rounded-xl hover:bg-neutral-700 hover:scale-110"
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
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,weathercode&hourly=relativehumidity_2m,visibility&timezone=auto`
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
 
  let colorchoose: string = "#ffffff";
  if (weatherData?.daily.uv_index_max[0])
  {
    switch (true)
    {
      case (weatherData.daily.uv_index_max[0] <= 2):
        colorchoose = "#a6c33e"
        break;
      case (weatherData.daily.uv_index_max[0] <= 5):
        colorchoose = "#f5bc41"
        break;
      case (weatherData.daily.uv_index_max[0] < 7):
        colorchoose = "#f19436"
        break;
      case (weatherData.daily.uv_index_max[0] < 10):
        colorchoose = "#e45b37"
        break;
      case (weatherData.daily.uv_index_max[0] >= 11):
        colorchoose = "#9350c4"
        break;
      default:
        colorchoose = "#ffffff"
        break;
    }
  }



  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-4 mx-4">
        <div className="flex flex-col space-y-10 col-span-full  row-span-2">
          <h1 className="font-bold text-4xl">This Week</h1>
          <div className="shadow-2xl  overflow-auto bg-neutral-900 rounded-xl p-6 flex flex-row space-x-3">
            {weatherDaily}
          </div>
        </div>
        <h1 className=" col-span-full  row-span-2 font-bold text-4xl">Today</h1>
        <div className="place-content-center shadow-2xl align-middle overflow-auto bg-neutral-900 rounded-xl row-span-2 p-6 flex flex-col space-x-2 space-y-3 text-center ">
          <h1 className=" text-xl font-mono font-bold">Sunrise & Sunset</h1>
          <div className="justify-center flex flex-row space-x-4 items-center">
            <Image
              priority
              src="/sunny.svg"
              alt="Sunny Icon"
              height={40}
              width={40}
            />
            <p className="text-3xl font-medium">{sunrise}</p>
          </div>
          <div className="justify-center flex flex-row space-x-4 items-center">
            <Image
              priority
              src="/night.svg"
              alt="night Icon"
              height={40}
              width={40}
            />
            <p className="text-3xl font-medium">{sunset}</p>
          </div>
        </div>

        <div className="shadow-2xl  bg-neutral-900 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-row space-y-1">
          <Image
            priority
            src="/humidity.svg"
            alt="Humidity Icon"
            height={72}
            width={72}
          />
          <div className="flex flex-col text-center">
            <h1 className="text-center text-xl font-mono font-bold">
              Humidity
            </h1>

            <p className="text-3xl font-medium">
              {weatherData?.hourly.relativehumidity_2m[0].toString() + " %"}
            </p>
          </div>
        </div>

        <div className="shadow-2xl  bg-neutral-900 py-4 row-span-1 px-4 rounded-xl text-lg font-semibold flex flex-col justify-center items-center">
          <h1 className="text-center text-xl font-mono font-bold">UV INDEX</h1>
          <div className="flex flex-row space-x-2">
            <svg
              width="42"
              height="42"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M15 5V2H17V5H15ZM20.634 5.97381L22.134 3.37573L23.8661 4.37573L22.3661 6.97381L20.634 5.97381ZM16 23C19.866 23 23 19.866 23 16C23 12.134 19.866 9 16 9C12.134 9 9 12.134 9 16C9 19.866 12.134 23 16 23ZM16 25C20.9706 25 25 20.9706 25 16C25 11.0294 20.9706 7 16 7C11.0294 7 7 11.0294 7 16C7 20.9706 11.0294 25 16 25ZM27 15H30V17H27V15ZM27.6243 8.13397L25.0263 9.63397L26.0263 11.366L28.6243 9.86603L27.6243 8.13397ZM8.13397 4.37573L9.63397 6.97381L11.366 5.97381L9.86603 3.37573L8.13397 4.37573ZM5.97375 11.366L3.37567 9.86603L4.37567 8.13397L6.97375 9.63397L5.97375 11.366ZM15 27V30H17V27H15ZM5 15H2V17H5V15ZM3.37562 22.134L5.97369 20.634L6.97369 22.366L4.37562 23.866L3.37562 22.134ZM9.63404 25.0264L8.13404 27.6244L9.86609 28.6244L11.3661 26.0264L9.63404 25.0264ZM22.134 28.6244L20.634 26.0264L22.366 25.0264L23.866 27.6244L22.134 28.6244ZM25.0263 22.366L27.6244 23.866L28.6244 22.134L26.0263 20.634L25.0263 22.366Z"
                fill="url(#paint0_linear_9_803)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_9_803"
                  x1="16"
                  y1="2"
                  x2="16"
                  y2="30"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stop-color="#ffffff" />
                  <stop offset="1" stop-color={colorchoose} />
                </linearGradient>
              </defs>
            </svg>
            <p className="font-semibold text-3xl">
              {weatherData?.daily.uv_index_max[0]}
            </p>
          </div>
        </div>
        <div className="shadow-2xl  bg-neutral-900 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-row space-y-1">
          <Image
            priority
            src="/ThumbsUp.png"
            alt="Humidity Icon"
            height={50}
            width={55}
          />
          <div className="flex flex-col text-center">
            <h1 className="text-center text-xl font-mono font-bold">
              Visibility
            </h1>

            <p className="text-3xl font-medium">
              {weatherData?.hourly.visibility[0]
                ? (weatherData.hourly.visibility[0] / 1000).toString() + " km"
                : ""}
            </p>
          </div>
        </div>
        <div className="shadow-2xl row-span-4 col-span-2 bg-neutral-900 rounded-xl justify-center content-center"></div>
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
    console.log(resultsGeo);
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
        <div className="flex space-y-4 flex-col justify-center items-center mt-8">
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

          {resultsGeo?.results && (
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
