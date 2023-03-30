export type WeatherData = {
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
  
  export type AirData = {
	latitude: number;
	longitude: number;
	timezone: string;
	hourly: {
	  european_aqi: number[];
	};
  };
  
  export type GeoData = {
	name: string;
	latitude: number;
	longitude: number;
	timezone: string;
	country_code: string;
	country: string;
  };
  
  export type ResultsGeo = {
	results: GeoData[];
  };
  
  export type Data = {
	weatherData?: WeatherData ;
	airData?: AirData;
  };

  export  type temperatureDataType = {
    time: number;
    temperature: number;
  };
  