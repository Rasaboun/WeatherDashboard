import Head from "next/head";
import { GetServerSideProps } from "next";
import ErrorPage from "next/error";
import { useState, useEffect } from "react";

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

const CityTable = ({ city, setResultsGeo, setGeoData }: { city: ResultsGeo, setResultsGeo: React.Dispatch<React.SetStateAction<ResultsGeo | null>>, setGeoData: React.Dispatch<React.SetStateAction<GeoData | null>> }) => {
  
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
              onClick={() => {setGeoData(geoData); setResultsGeo(null)}}
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

const getData = async (lat: string, long: string, setWeatherData: React.Dispatch<React.SetStateAction<WeatherData | null>> ) => {
  const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,weathercode&timezone=auto`
  );
  const weatherData: WeatherData = await res.json();
  if (!weatherData)
  {
    setWeatherData(null)
    return;
  }
  setWeatherData(weatherData)
}

const WeatherDashboard = ({ city }: { city: GeoData }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  getData(city.latitude.toString(), city.longitude.toString(), setWeatherData);

  return (
    <>
      <h1>{weatherData && weatherData.daily.temperature_2m_max[0].toString()}</h1>
    </>
  );
};

export default function Home(props: { weatherData: WeatherData }) {
  const [resultsGeo, setResultsGeo] = useState<ResultsGeo | null>(null);
  const [geoData, setGeoData] = useState<GeoData | null>(null);

  if (!props.weatherData) return <ErrorPage statusCode={404} />;

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
        <div className="flex space-y-4 flex-col h-screen justify-center items-center">
          <form method="post" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-2">
              <label className="text-center text-3xl font-mono font-semibold">
                Your City
              </label>
              <div className="flex flex-row space-x-1">
                <input
                  className="text-black rounded-lg px-2 bg-gray-100"
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
          {resultsGeo && <CityTable city={resultsGeo} setGeoData={setGeoData} setResultsGeo={setResultsGeo}/>}
          {geoData && <WeatherDashboard city={geoData} />}
        </div>
      </main>
    </>
  );
}
