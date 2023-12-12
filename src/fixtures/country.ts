import axios from "axios";
import Country from "../models/Country";
import { ICountry } from "../types";

async function getCountries() {
	const countries: ICountry[] = [];

	try {
		const res = await axios.get("https://restcountries.com/v3.1/all");
		const data = res.data;

		const list = data.filter((country: any) => country.unMember === true);
		list.forEach((country: any, index: number) => {
			const id = index + 1;
			const name = country.name.common;
			const code = country.cca2;
			let dial_code;
			const capital = country.capital[0];
			const continent = country.continents[0];
			const flag = country.flags.png;
			const currency: { name: string; code: string; symbol: string } = {
				name: "",
				code: "",
				symbol: "",
			};

			if (country.idd.suffixes.length > 1 || country.idd.root === "+1")
				dial_code = country.idd.root;
			else dial_code = country.idd.root + country.idd.suffixes[0];

			const currencies = Object.entries(country.currencies) as any;
			const currencyDetails = Object.values(currencies[0][1]);
			currency.code = currencies[0][0] as string;
			currency.name = currencyDetails[0] as string;
			currency.symbol = (currencyDetails[1] ? currencyDetails[1] : "") as string;

			countries.push({
				_id: id,
				name,
				code,
				dial_code,
				flag,
				capital,
				continent,
				currency,
			});

			console.log(id, name, code, dial_code, capital, continent, flag, currency);
		});

		await Country.insertMany(countries);
		console.log("Countries collection populated!");
	} catch (err: any) {
		console.log(err.message);
		throw err;
	}
}

export default getCountries;
