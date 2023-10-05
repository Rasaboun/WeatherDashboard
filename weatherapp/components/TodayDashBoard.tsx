import Image from "next/image";
import { WeatherData, AirData, temperatureDataType } from "components/type/WeatherType";
import dynamic from 'next/dynamic'


const DynamicTemperatureChart = dynamic(() => import("components/TemperatureChart"), {
  loading: () => <p className="text-xl font-medium ">Loading...</p>,
  ssr: false,
})


export  const TodayDashBoard = ({
	weatherData,
	airData
  }: {
	weatherData: WeatherData,
	airData: AirData
  }) => {


	const todayDate = new Date();
	const actualHoursDate = new Date();
  actualHoursDate.setTime(actualHoursDate.getTime() + weatherData.utc_offset_seconds * 1000)
  const actualHours = actualHoursDate.getUTCHours();
	let sunrise = "";
	let sunset = "";
	if (weatherData) {
    let sunsetDate = new Date(weatherData.daily.sunset[0])
    sunsetDate.setTime(sunsetDate.getTime() - todayDate.getTimezoneOffset() * 60000)
	  sunset =
		sunsetDate.getUTCHours() +
		":" +
		sunsetDate.getUTCMinutes();
    let sunriseDate = new Date(weatherData.daily.sunrise[0])
    sunriseDate.setTime(sunriseDate.getTime() - todayDate.getTimezoneOffset() * 60000)
	  sunrise =
		sunriseDate.getUTCHours() +
		":" +
		sunriseDate.getUTCMinutes();
	}
	const qualityColor = chooseQualityColor(actualHours, weatherData);
	const colorAir = chooseAirQualityColor(actualHours, airData);

	return (
		
		<>
		 <h1 className=" col-span-full  row-span-2 font-semibold text-4xl tracking-wide	 text-sky-900">
          Today
        </h1>
        <div className="place-content-center shadow-2xl align-middle overflow-auto bg-sky-700 rounded-xl row-span-2 p-6 flex flex-col space-x-2 space-y-6 text-center ">
          <h1 className=" text-xl font-medium ">Sunrise & Sunset</h1>
          <div className="flex flex-col space-y-2">
            <div className="justify-center flex flex-row space-x-2 items-center">
              <Image
                priority
                src="/sunny.svg"
                alt="Sunny Icon"
                height={40}
                width={40}
              />
              <p className="font-normal text-lg">{sunrise}</p>
            </div>
            <div className="justify-center flex flex-row space-x-2 items-center">
              <Image
                priority
                src="/night.svg"
                alt="night Icon"
                height={40}
                width={40}
              />
              <p className="text-lg font-normal">{sunset}</p>
            </div>
          </div>
        </div>
        
        <div className="shadow-2xl  bg-sky-700 py-4 px-4 justify-center content-center rounded-xl text-lg font-medium flex flex-col space-y-1">
          <h1 className="text-center text-xl  font-medium">Humidity</h1>
          <div className="justify-center flex flex-row space-x-2 items-center">
            <Image
              priority
              src="/humidity.svg"
              alt="Humidity Icon"
              height={42}
              width={42}
            />
            <p className="text-lg font-normal">
              {weatherData?.hourly.relativehumidity_2m[
                actualHours
              ].toString() + " %"}
            </p>
          </div>
        </div>

        <div className="shadow-2xl  bg-sky-700 py-4 row-span-1 px-4 rounded-xl text-lg font-medium flex flex-col justify-center items-center">
          <h1 className="text-center text-xl font-medium">UV Index</h1>
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
                  <stop offset="1" stopColor={qualityColor} />
                </linearGradient>
              </defs>
            </svg>
            <p className="font-normal text-lg">
              {weatherData?.hourly.uv_index[actualHours]}
            </p>
          </div>
        </div>
        <div className="shadow-2xl  bg-sky-700 py-4 px-4 justify-center content-center rounded-xl text-lg font-medium flex flex-col space-y-1">
          <h1 className="text-center text-xl font-medium">
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

            <p className="text-lg font-normal">
              {weatherData?.hourly.visibility[0]
                ? (
                    weatherData.hourly.visibility[actualHours] / 1000
                  ).toString() + " km"
                : ""}
            </p>
          </div>
        </div>
        <div className="shadow-2xl  bg-sky-700 py-4 px-4 justify-center content-center rounded-xl text-lg font-medium flex flex-col space-y-1">
          <h1 className="text-center text-xl font-medium">WindSpeed</h1>

          <div className="justify-center flex flex-row space-x-2 items-center">
            <Image
              priority
              src="/windspeed.svg"
              alt="windspeed Icon"
              height={32}
              width={32}
            />

            <p className="text-lg font-normal">
              {weatherData?.hourly.windspeed_10m
                ? weatherData.hourly.windspeed_10m[
                    actualHours
                  ].toString() + " km/h"
                : ""}
            </p>
          </div>
        </div>
        <div className="shadow-2xl row-span-2 col-span-2 bg-sky-700 rounded-xl justify-center content-center">
            <DynamicTemperatureChart weatherData={weatherData}/>
        </div>

        <div className="shadow-2xl  bg-sky-700 py-4 px-4 justify-center content-center rounded-xl text-lg font-medium flex flex-col space-y-1">
          <h1 className="text-center text-xl font-medium">
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
                  <stop offset="1" stopColor={qualityColor} />
                </linearGradient>
              </defs>
            </svg>

            <p className="text-lg font-normal">
              {weatherData?.hourly.apparent_temperature
                ? weatherData.hourly.apparent_temperature[
                    actualHours
                  ].toString() + " °C"
                : ""}
            </p>
          </div>
        </div>

        <div className="shadow-2xl  bg-sky-700 py-4 px-4 justify-center content-center rounded-xl text-lg font-medium flex flex-col space-y-1">
          <h1 className="text-center text-xl font-medium">
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

            <p className="text-lg font-normal">
              {airData?.hourly.european_aqi
                ? airData?.hourly.european_aqi[
                    actualHours
                  ].toString() + " EAQI"
                : ""}
            </p>
          </div>
        </div>
                
		</>
	)
}


const chooseQualityColor = (actualHours: number, weatherData: WeatherData) =>  {

	let colorchoose: string = "#ffffff";
	if (weatherData?.hourly.uv_index[actualHours]) {
	  switch (true) {
		case weatherData.hourly.uv_index[actualHours] <= 2:
		  colorchoose = "#a6c33e";
		  break;
		case weatherData.hourly.uv_index[actualHours] <= 5:
		  colorchoose = "#f5bc41";
		  break;
		case weatherData.hourly.uv_index[actualHours] < 7:
		  colorchoose = "#f19436";
		  break;
		case weatherData.hourly.uv_index[actualHours] < 10:
		  colorchoose = "#e45b37";
		  break;
		case weatherData.hourly.uv_index[actualHours] >= 11:
		  colorchoose = "#9350c4";
		  break;
		default:
		  colorchoose = "#ffffff";
		  break;
	  }
	}

	return colorchoose;
}

const chooseAirQualityColor = (actualHours: number, airData: AirData) =>  {

	let colorAir: string = "#ffffff";
	if (airData.hourly.european_aqi[actualHours]) {
	  switch (true) {
		case airData.hourly.european_aqi[actualHours] <= 20:
		  colorAir = "#a6c33e";
		  break;
		case airData.hourly.european_aqi[actualHours] <= 40:
		  colorAir = "#f5bc41";
		  break;
		case airData.hourly.european_aqi[actualHours] < 60:
		  colorAir = "#f19436";
		  break;
		case airData.hourly.european_aqi[actualHours] < 80:
		  colorAir = "#e45b37";
		  break;
		case airData.hourly.european_aqi[actualHours] >= 100:
		  colorAir = "#9350c4";
		  break;
		default:
		  colorAir = "#ffffff";
		  break;
	  }
	}
	return colorAir;
}



