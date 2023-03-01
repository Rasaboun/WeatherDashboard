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
} from "recharts";

const data = [
  { name: "1", value: 1 },
  { name: "3", value: 1 },
  { name: "6", value: 1 },
  { name: "8", value: 1 },
  { name: "11", value: 1 },
];

const COLORS = ["#22c55e", "#f97316", "#c2410c", "#b91c1c", "#5b21b6"];

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
  const datas = [
    { value: 0 },

    { value: weatherData?.daily.uv_index_max[0] },
    { value: 6 },
    { value: 8 },
    { value: 11 },
  ];
  let uvindex: number = 0;
  let colorchoose: string = "none";

  if (weatherData?.daily.uv_index_max[0]) {
    uvindex = 180 - (weatherData.daily.uv_index_max[0] / 11) * 180;
  }

  let renderLabel = function (data: { name: string; value: number }) {
    return data.name;
  };

  return (
    <>
      <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-3 gap-y-10 gap-4 mx-4">
        <div className="flex flex-col space-y-10 col-span-full  row-span-2">
          <h1 className="font-bold text-4xl">This Week</h1>
          <div className="shadow-2xl  overflow-auto bg-neutral-900 rounded-xl p-6 flex flex-row space-x-3">
            {weatherDaily}
          </div>
        </div>
        <h1 className=" col-span-full  row-span-2 font-bold text-4xl">Today</h1>
        <div className="place-content-center shadow-2xl align-middle overflow-auto bg-neutral-900 rounded-xl row-span-2 p-6 flex flex-col space-x-2 space-y-3 text-center ">
          <h1 className=" text-xl font-mono font-bold">
            Sunrise & Sunset
          </h1>
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

        <div className="shadow-2xl  bg-neutral-900 py-4 row-span-2 px-4 rounded-xl text-lg font-semibold flex flex-col">
          <h1 className="text-center text-xl font-mono font-bold">UV INDEX</h1>
          <ResponsiveContainer height={150}>
            <PieChart>
              <Pie
                data={data}
                cy="95%"
                startAngle={180}
                endAngle={0}
                innerRadius={62}
                outerRadius={75}
                fill="#8884d8"
                stroke="none"
                dataKey="value"
                nameKey="index"
                label={renderLabel}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Pie
                data={datas}
                cy="95%"
                startAngle={180}
                endAngle={uvindex}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                stroke="none"
                dataKey="value"
              >
                {datas.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill="#facc15" />
                ))}

                <Label
                  className="font-mono fill-white"
                  value={weatherData?.daily.uv_index_max[0]}
                  position="center"
                />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="shadow-2xl  bg-neutral-900 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-row space-y-1">
          <Image
            priority
            src="/ThumbsUp.png"
            alt="Humidity Icon"
            height={62}
            width={62}
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
