import { Injectable, Inject, signal } from '@angular/core'
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import worldJson from 'countrycitystatejson';

@Injectable({
	providedIn: 'root',
})
@UntilDestroy()

export class CountryService {

	locationData= signal<Record<string, unknown>>(worldJson.getAll());
	countries = signal<Array<any>>(worldJson.getCountries());
	states = signal<Array<string>>([]);
	cities = signal<Array<string>>([]);

	countryShortName = signal<string | null>(null);
	countryName = signal<string | null>(null);
	country = signal<any | null>(null);
	stateName = signal<string | null>(null);
	cityName = signal<string | null>(null);

	constructor() { }

	onCountryChange(country: string) {
		let currentCountry = this.countries().find(c => c.name === country);
		let countryShortName = currentCountry?.shortName;
		const selectedCountry = this.locationData()[countryShortName] ? countryShortName : null;
		this.states.set(selectedCountry ? (worldJson.getStatesByShort(countryShortName) ?? []) : []);
		this.cities.set([]);
		this.countryShortName.set(countryShortName);
		this.countryName.set(currentCountry?.name || null);
		this.country.set(currentCountry || null);
		this.stateName.set(null);
		this.cityName.set(null);
	}

	onStateChange(state: string) {
		const selectedCountry = this.countryShortName();
		const selectedState = selectedCountry && this.states().includes(state) ? state : null;
		this.cities.set(selectedCountry && selectedState ? (worldJson.getCities(selectedCountry, selectedState) ?? []) : []);
		this.stateName.set(selectedState);
		this.cityName.set(null);
	}

	onCityChange(city: string) {
		const selectedCity = this.cities().includes(city) ? city : null;
		this.cityName.set(selectedCity);
	}

}
