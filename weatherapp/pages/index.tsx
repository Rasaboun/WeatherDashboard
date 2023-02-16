import Head from "next/head";

type WeatherData = {
  latitude: number,
  longitude: number,
  timezone: string,
  daily_units : { },
  daily: {
    time: string[],
    temperature_2m_max: number[]
    temperature_2m_min: number[],
    sunrise: string[],
    sunset: string[],
    uv_index_max: number[],
    weathercode: number[],
  }
}



export default function Home() {
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
      <main>
        <h1 className="text-3xl font-bold ">Hello world!</h1>
      </main>
    </>
  );
}
