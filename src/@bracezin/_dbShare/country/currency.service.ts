import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError } from 'rxjs';

export interface CurrencyRateResponse {
	amount: number;
	base: string;
	date: string;
	rates: Record<string, number>;
}

interface CurrencyApiRatesPayload {
	date: string;
	[key: string]: string | Record<string, number>;
}

export interface CurrencyItem {
	code: string;
	name: string;
}

@Injectable({
	providedIn: 'root',
})

export class CurrencyService {
	private readonly apiBaseUrl = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1';
	private readonly ratesCache = new Map<string, Observable<CurrencyRateResponse>>();
	private currenciesCache$: Observable<CurrencyItem[]> | null = null;

	constructor(private httpClient: HttpClient) { }

	getCurrentRates(baseCurrency = 'USD'): Observable<CurrencyRateResponse> {
		const normalizedBase = this.normalizeCurrencyCode(baseCurrency);
		const baseForUrl = normalizedBase.toLowerCase();
		const cachedRates = this.ratesCache.get(normalizedBase);

		if (cachedRates) {
			return cachedRates;
		}

		const request$ = this.httpClient.get<CurrencyApiRatesPayload>(`${this.apiBaseUrl}/currencies/${baseForUrl}.json`).pipe(
			map((response) => {
				const apiRates = (response?.[baseForUrl] || {}) as Record<string, number>;
				const rates = Object.entries(apiRates).reduce<Record<string, number>>((acc, [code, rate]) => {
					acc[code.toUpperCase()] = rate;
					return acc;
				}, {});

				return {
					amount: 1,
					base: normalizedBase,
					date: response?.date || '',
					rates,
				};
			}),
			catchError((error: HttpErrorResponse) => this.handleError(error)),
			shareReplay(1)
		);

		this.ratesCache.set(normalizedBase, request$);
		return request$;
	}

	getCurrencies(): Observable<CurrencyItem[]> {
		if (this.currenciesCache$) {
			return this.currenciesCache$;
		}

		this.currenciesCache$ = this.httpClient.get<Record<string, string>>(`${this.apiBaseUrl}/currencies.json`).pipe(
			map((currencies) =>
				Object.entries(currencies).map(([code, name]) => ({
					code: code.toUpperCase(),
					name,
				})).sort((a, b) => a.code.localeCompare(b.code))
			),
			catchError((error: HttpErrorResponse) => this.handleError(error)),
			shareReplay(1)
		);

		return this.currenciesCache$;
	}

	getRate(baseCurrency: string, targetCurrency: string): Observable<number> {
		const normalizedTarget = this.normalizeCurrencyCode(targetCurrency);

		return this.getCurrentRates(baseCurrency).pipe(
			map((response) => {
				const rate = response.rates[normalizedTarget];

				if (rate === undefined || rate === null) {
					throw new Error(`Currency rate not found for ${normalizedTarget}`);
				}

				return rate;
			})
		);
	}

	private normalizeCurrencyCode(currencyCode: string): string {
		return (currencyCode || 'USD').trim().toUpperCase();
	}

	private handleError(error: HttpErrorResponse) {
		const message = error?.error?.message || error?.message || 'Unable to load currency data';
		return throwError(() => new Error(message));
	}

}
