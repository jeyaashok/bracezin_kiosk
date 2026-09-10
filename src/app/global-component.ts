import { environment } from 'src/environments/environment';

export const GlobalComponent = {
    // Api Calling
    API_URL: environment.apiUrl,
    headerToken: { 'Authorization': `Bearer ${sessionStorage.getItem('token')}` },

    // Auth Api
    AUTH_API: `${environment.apiUrl}auth/`,

    // Products Api
    product: 'apps/product',
    productDelete: 'apps/product/',

    // Orders Api
    order: 'apps/order',
    orderId: 'apps/order/',

    // Customers Api
    customer: 'apps/customer',

}