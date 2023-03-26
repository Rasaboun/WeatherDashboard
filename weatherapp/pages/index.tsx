import Head from "next/head";
import { useState, useEffect } from "react";
import Image from "next/image";
import { InferGetServerSidePropsType, GetServerSideProps } from "next";

import {
  ResponsiveContainer,
  AreaChart,
  YAxis,
  XAxis,
  Tooltip,
  Area,
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
    weathercode: number[];
    windspeed_10m_max: number[];
  };
  hourly: {
    relativehumidity_2m: number[];
    visibility: number[];
    temperature_2m: number[];
    time: string[];
    apparent_temperature: number[];
    windspeed_10m: number[];
    uv_index: number[];
  };
};

type AirData = {
  latitude: number;
  longitude: number;
  timezone: string;
  hourly: {
    european_aqi: number[];
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

type Data = {
  weatherData: WeatherData | null;
  airData: AirData | null;
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  let weatherDatas: WeatherData | null = null;
  let data: Data = {
    weatherData: null,
    airData: null,
  };
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
    return { props: { data } };
  }
  return { props: { data } };
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div>
        <p>{`${payload[0].value} °C`}</p>
      </div>
    );
  }

  return null;
};

const chooseSVG = (weatherCode: number) =>  {

  let svgchoose: string = "/sunny.svg";
    switch (true) {
      case weatherCode == 0:
        svgchoose = "/sunny.svg";
        break;
      case weatherCode >= 1 && weatherCode <= 3:
        svgchoose = "/partly-cloudy.svg";
        break;
      case weatherCode == 45 || weatherCode == 48:
        svgchoose = "/fog.svg";
        break;
      case weatherCode >= 51 && weatherCode <= 55:
        svgchoose = "/drizzle.svg";
        break;
      case weatherCode >= 95 && weatherCode <= 99:
        svgchoose = "/severthunder.svg";
        break;
      case weatherCode >= 61 && weatherCode <= 67:
        svgchoose = "/rain.svg";
        break;
      case weatherCode >= 71 && weatherCode <= 77:
        svgchoose = "/snow.svg";
        break;
      case weatherCode >= 80 && weatherCode <= 82:
        svgchoose = "/rain.svg";
        break;
      case weatherCode >= 85 && weatherCode <= 86:
        svgchoose = "/snow.svg";
        break;

      default:
        svgchoose = "/sunny.svg";
        break;
    }

  return (svgchoose)
}


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
    <div className="">
      <table className="rounded-lg  shadow-2xl bg-sky-300 table-auto my-5 mx-2">
        <thead>
          <tr className="text-gray-300 font-bold text-lg uppercase">
            <th>Country</th>
            <th>latitude</th>
            <th>longitude</th>
            <th className="hidden md:table-cell">timezone</th>
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
              <td className="px-6 py-4 hidden md:table-cell">
                {geoData.timezone}
              </td>
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
) => {};

const WeatherDashboard = ({
  weatherData,
  airData,
}: {
  weatherData: WeatherData | null;
  airData: AirData | null;
}) => {
  const dayDef: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDate = new Date();
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
          key={i.toString() + "weekDay"}
          className="items-center bg-sky-800 rounded-lg w-fit flex flex-col p-2 space-y-2 "
        >
          <h1 className="text-center text-xl font-mono font-bold">
            {todayDate.getDay() === day ? "Today" : dayDef[day]}
          </h1>
          <Image
            priority
            src={chooseSVG(weatherData?.daily.weathercode[i])}
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
  if (weatherData?.hourly.uv_index[todayDate.getHours()]) {
    switch (true) {
      case weatherData.hourly.uv_index[todayDate.getHours()] <= 2:
        colorchoose = "#a6c33e";
        break;
      case weatherData.hourly.uv_index[todayDate.getHours()] <= 5:
        colorchoose = "#f5bc41";
        break;
      case weatherData.hourly.uv_index[todayDate.getHours()] < 7:
        colorchoose = "#f19436";
        break;
      case weatherData.hourly.uv_index[todayDate.getHours()] < 10:
        colorchoose = "#e45b37";
        break;
      case weatherData.hourly.uv_index[todayDate.getHours()] >= 11:
        colorchoose = "#9350c4";
        break;
      default:
        colorchoose = "#ffffff";
        break;
    }
  }


  type temperatureDataType = {
    time: number;
    temperature: number;
  };

  let temperatureData = [];

  if (weatherData) {
    for (let i = 0; i < 24; i++) {
      let tmp: temperatureDataType = {
        time: new Date(weatherData.hourly.time[i]).getHours(),
        temperature: weatherData.hourly.temperature_2m[i],
      };
      temperatureData.push(tmp);
    }
  }

  let colorAir: string = "#ffffff"
  if (airData?.hourly.european_aqi[todayDate.getHours()]) {
    switch (true) {
      case airData.hourly.european_aqi[todayDate.getHours()] <= 20:
        colorAir = "#a6c33e";
        break;
      case airData.hourly.european_aqi[todayDate.getHours()] <= 40:
        colorAir = "#f5bc41";
        break;
      case airData.hourly.european_aqi[todayDate.getHours()] < 60:
        colorAir = "#f19436";
        break;
      case airData.hourly.european_aqi[todayDate.getHours()] < 80:
        colorAir = "#e45b37";
        break;
      case airData.hourly.european_aqi[todayDate.getHours()] >= 100:
        colorAir = "#9350c4";
        break;
      default:
        colorAir = "#ffffff";
        break;
    }
  }

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-10 gap-4 mx-4">
        <div className="flex flex-col space-y-10 col-span-full  row-span-2">
          <h1 className="font-bold text-4xl font-sans text-sky-900">
            This Week
          </h1>
          <div className="bg-sky-300 shadow-2xl rounded-xl p-3">
            <div className="overflow-auto flex flex-row justify-between space-x-3">
              {weatherDaily}
            </div>
          </div>
        </div>
        <h1 className=" col-span-full  row-span-2 font-bold text-4xl font-sans text-sky-900">
          Today
        </h1>
        <div className="place-content-center shadow-2xl align-middle overflow-auto bg-sky-300 rounded-xl row-span-2 p-6 flex flex-col space-x-2 space-y-6 text-center ">
          <h1 className=" text-xl font-mono font-bold ">Sunrise & Sunset</h1>
          <div className="flex flex-col space-y-2">
            <div className="justify-center flex flex-row space-x-2 items-center">
              <Image
                priority
                src="/sunny.svg"
                alt="Sunny Icon"
                height={40}
                width={40}
              />
              <p className="font-medium text-lg">{sunrise}</p>
            </div>
            <div className="justify-center flex flex-row space-x-2 items-center">
              <Image
                priority
                src="/night.svg"
                alt="night Icon"
                height={40}
                width={40}
              />
              <p className="text-lg font-medium">{sunset}</p>
            </div>
          </div>
        </div>
        <div className="shadow-2xl  bg-sky-300 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-col space-y-1">
          <h1 className="text-center text-xl font-mono font-bold">Humidity</h1>
          <div className="justify-center flex flex-row space-x-2 items-center">
            <Image
              priority
              src="/humidity.svg"
              alt="Humidity Icon"
              height={42}
              width={42}
            />
            <p className="text-lg font-medium">
              {weatherData?.hourly.relativehumidity_2m[
                todayDate.getHours()
              ].toString() + " %"}
            </p>
          </div>
        </div>

        <div className="shadow-2xl  bg-sky-300 py-4 row-span-1 px-4 rounded-xl text-lg font-semibold flex flex-col justify-center items-center">
          <h1 className="text-center text-xl font-mono font-bold">UV Index</h1>
          <div className="justify-center flex flex-row space-x-2 items-center">
            <svg
              width="42"
              height="42"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
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
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor={colorchoose} />
                </linearGradient>
              </defs>
            </svg>
            <p className="font-semibold text-lg">
              {weatherData?.hourly.uv_index[todayDate.getHours()]}
            </p>
          </div>
        </div>
        <div className="shadow-2xl  bg-sky-300 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-col space-y-1">
          <h1 className="text-center text-xl font-mono font-bold">
            Visibility
          </h1>

          <div className="justify-center flex flex-row space-x-2 items-center">
            <Image
              priority
              src="/visibility.svg"
              alt="visibility Icon"
              height={32}
              width={32}
            />

            <p className="text-lg font-medium">
              {weatherData?.hourly.visibility[0]
                ? (
                    weatherData.hourly.visibility[todayDate.getHours()] / 1000
                  ).toString() + " km"
                : ""}
            </p>
          </div>
        </div>
        <div className="shadow-2xl  bg-sky-300 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-col space-y-1">
          <h1 className="text-center text-xl font-mono font-bold">WindSpeed</h1>

          <div className="justify-center flex flex-row space-x-2 items-center">
            <Image
              priority
              src="/windspeed.svg"
              alt="windspeed Icon"
              height={32}
              width={32}
            />

            <p className="text-lg font-medium">
              {weatherData?.hourly.windspeed_10m
                ? weatherData.hourly.windspeed_10m[
                    todayDate.getHours()
                  ].toString() + " km/h"
                : ""}
            </p>
          </div>
        </div>
        <div className="shadow-2xl row-span-2 col-span-2 bg-sky-300 rounded-xl justify-center content-center">
          <ResponsiveContainer width="100%" height={242}>
            <AreaChart
              data={temperatureData}
              
            >
              <defs>
                <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0284c7" stopOpacity={0.2} />
                  <stop offset="80%" stopColor="#0284c7" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="time" stroke="white" />
              <YAxis unit="°C" stroke="white" />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="temperature"
                stroke="#0c4a6e"
                fillOpacity={1}
                fill="url(#colorUv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="shadow-2xl  bg-sky-300 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-col space-y-1">
          <h1 className="text-center text-xl font-mono font-bold">
            Fells Like
          </h1>

          <div className="justify-center flex flex-row space-x-2 items-center">
            <svg
              width="42"
              height="42"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M29.3333 40C32.2788 40 34.6667 42.3878 34.6667 45.3333C34.6667 48.2788 32.2788 50.6667 29.3333 50.6667C26.3878 50.6667 24 48.2788 24 45.3333C24 42.3878 26.3878 40 29.3333 40ZM29.3333 40V21.3333M40 16H48M40 21.3333H48M40 26.6667H48M40 32H48M29.3333 8C32.2788 8 34.6667 10.3878 34.6667 13.3333L34.6696 36.0954C37.8563 37.9401 40 41.3864 40 45.3333C40 51.2244 35.2244 56 29.3333 56C23.4423 56 18.6667 51.2244 18.6667 45.3333C18.6667 41.3853 20.8116 37.9382 23.9997 36.0939L24 13.3333C24 10.3878 26.3878 8 29.3333 8Z"
                stroke="url(#paint0_linear_9_803)"
                strokeWidth="2"
                strokeLinejoin="round"
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
                  <stop stopColor="#ffffff" />
                  <stop offset="1" stopColor={colorchoose} />
                </linearGradient>
              </defs>
            </svg>

            <p className="text-lg font-medium">
              {weatherData?.hourly.apparent_temperature
                ? weatherData.hourly.apparent_temperature[
                    todayDate.getHours()
                  ].toString() + " °C"
                : ""}
            </p>
          </div>
        </div>

        <div className="shadow-2xl  bg-sky-300 py-4 px-4 justify-center content-center rounded-xl text-lg font-semibold flex flex-col space-y-1">
          <h1 className="text-center text-xl font-mono font-bold">
            Air Quality
          </h1>

          <div className="justify-center flex flex-row space-x-2 items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              fill={colorAir}
              viewBox="0 0 16 16"
            >
              <path d="M8.5 1.5a.5.5 0 1 0-1 0v5.243L7 7.1V4.72C7 3.77 6.23 3 5.28 3c-.524 0-1.023.27-1.443.592-.431.332-.847.773-1.216 1.229-.736.908-1.347 1.946-1.58 2.48-.176.405-.393 1.16-.556 2.011-.165.857-.283 1.857-.241 2.759.04.867.233 1.79.838 2.33.67.6 1.622.556 2.741-.004l1.795-.897A2.5 2.5 0 0 0 7 11.264V10.5a.5.5 0 0 0-1 0v.764a1.5 1.5 0 0 1-.83 1.342l-1.794.897c-.978.489-1.415.343-1.628.152-.28-.25-.467-.801-.505-1.63-.037-.795.068-1.71.224-2.525.157-.82.357-1.491.491-1.8.19-.438.75-1.4 1.44-2.25.342-.422.703-.799 1.049-1.065.358-.276.639-.385.833-.385a.72.72 0 0 1 .72.72v3.094l-1.79 1.28a.5.5 0 0 0 .58.813L8 7.614l3.21 2.293a.5.5 0 1 0 .58-.814L10 7.814V4.72a.72.72 0 0 1 .72-.72c.194 0 .475.11.833.385.346.266.706.643 1.05 1.066.688.85 1.248 1.811 1.439 2.249.134.309.334.98.491 1.8.156.814.26 1.73.224 2.525-.038.829-.224 1.38-.505 1.63-.213.19-.65.337-1.628-.152l-1.795-.897A1.5 1.5 0 0 1 10 11.264V10.5a.5.5 0 0 0-1 0v.764a2.5 2.5 0 0 0 1.382 2.236l1.795.897c1.12.56 2.07.603 2.741.004.605-.54.798-1.463.838-2.33.042-.902-.076-1.902-.24-2.759-.164-.852-.38-1.606-.558-2.012-.232-.533-.843-1.571-1.579-2.479-.37-.456-.785-.897-1.216-1.229C11.743 3.27 11.244 3 10.72 3 9.77 3 9 3.77 9 4.72V7.1l-.5-.357V1.5Z" />
            </svg>

            <p className="text-lg font-medium">
              {airData?.hourly.european_aqi
                ? airData?.hourly.european_aqi[
                    todayDate.getHours()
                  ].toString() + " EAQI"
                : ""}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default function Home({ data }: { data: Data }) {
  const [allData, setAllData] = useState<Data>(
    data
  );

 
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    // Prevent the browser from reloading the page
    e.preventDefault();
    // Read the form data
    const form = e.currentTarget;

    let weatherDatas: WeatherData | null = null;
    let data: Data = {
      weatherData: null,
      airData: null,
    };
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${form.City.value}`
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
      setAllData(data)
  }
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
        <div className="flex space-y-4 flex-col justify-center items-center my-10">
          <form method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <label className="text-center text-4xl font-sans text-sky-900 font-bold">
                Your City
              </label>
              <div className="flex flex-row space-x-1">
                <input
                  className="text-sky-900 font-semibold rounded-lg px-2 py-1 bg-sky-200"
                  name="City"
                  defaultValue="Paris"
                  type="text"
                />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="3"
                    className="w-6 h-6 stroke-sky-200"
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

          {allData.weatherData && (
            <WeatherDashboard
              weatherData={allData.weatherData}
              airData={allData.airData}
            />
          )}
        </div>
      </main>
    </>
  );
}
