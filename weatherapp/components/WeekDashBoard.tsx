import Image from "next/image";
import { WeatherData } from "components/type/WeatherType";

export const WeekDashBoard = ({
  weatherData,
}: {
  weatherData: WeatherData;
}) => {
  let weatherDaily: JSX.Element[] = [];
  const dayDef: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayDate = new Date();

  for (let i = 0; i < 7; i++) {
    if (weatherData?.daily) {
      let date = new Date(weatherData.daily.time[i]);
      let day = date.getDay();
      weatherDaily.push(
        <div
          key={i.toString() + "weekDay"}
          className="items-center bg-sky-700 rounded-lg w-fit flex flex-col p-2 space-y-2 "
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
  return (
    <div className="flex flex-col space-y-10 col-span-full  row-span-2">
      <h1 className="font-bold text-4xl font-sans text-sky-900">This Week</h1>
      <div className="bg-blue-300 shadow-2xl rounded-xl p-3">
        <div className="overflow-auto flex flex-row justify-between space-x-3">
          {weatherDaily}
        </div>
      </div>
    </div>
  );
};

const chooseSVG = (weatherCode: number) => {
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
  return svgchoose;
};
