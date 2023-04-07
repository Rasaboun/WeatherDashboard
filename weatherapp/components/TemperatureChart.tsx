import {
	ResponsiveContainer,
	AreaChart,
	YAxis,
	XAxis,
	Tooltip,
	Area,
  } from "recharts";
  import { WeatherData, temperatureDataType } from "components/type/WeatherType";


  export const TemperatureChart = ({weatherData}: {weatherData: WeatherData}) => {


	  const temperatureData = CreateTemperatureDataSet(weatherData);

	return (
		<ResponsiveContainer width="100%" height={242}>
		<AreaChart data={temperatureData}>
		  <defs>
			<linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
			  <stop offset="5%" stopColor="#ffffff" stopOpacity={0.2} />
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
			strokeWidth={2}
			fillOpacity={1}
			fill="url(#colorUv)"
		  />
		</AreaChart>
	  </ResponsiveContainer>
	)
  }
  export default TemperatureChart;


  const CreateTemperatureDataSet = (weatherData: WeatherData) => {
	let temperatureData = [];
	  for (let i = 0; i < 24; i++) {
		let tmp: temperatureDataType = {
		  time: new Date(weatherData.hourly.time[i]).getUTCHours(),
		  temperature: weatherData.hourly.temperature_2m[i],
		};
		temperatureData.push(tmp);
	  }
	  return (temperatureData)
}

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