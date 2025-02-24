import axios from 'axios';

class SafexpressApi {
  constructor() {
    this.authUrl = '/safexpress-auth/oauth2/token';
    this.trackingUrl = '/safexpress-tracking/wbtrack/SafexWaybillTracking/webresources/safex_customer/tracking';
    this.credentials = {
      username: '40bm9nkp8e01lk7hg67n2kl6fa',
      password: '1b5t27ov9jg035n612dd2pa95d89rkv30nakhtfro0ki3846e6mk'
    };
    this.apiKey = 'x9aVXJVrlQ13kePv7NCHY1cVSi0YCcim9rDJhyA8';
    this.trackingApiKey = '8lqjlSQno5asjL7DuHcW44diS5HVNpkYaXBa6k7l';
  }

  async getAuthToken() {
    try {
      const formData = new URLSearchParams();
      formData.append('x-api-key', this.apiKey);
      formData.append('scope', 'server/waybillapps');
      formData.append('grant_type', 'client_credentials');

      const response = await axios.post(
        this.authUrl,
        formData,
        {
          auth: {
            username: this.credentials.username,
            password: this.credentials.password
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('Auth token error:', error);
      throw new Error('Failed to get authentication token');
    }
  }

  async getTrackingInfo(lrNumber) {
    try {
      // First get the auth token
      const token = await this.getAuthToken();
      
      // Then get tracking info
      const response = await axios.post(
        this.trackingUrl,
        {
          docNo: lrNumber,
          docType: 'WB'
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': this.trackingApiKey,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data;
    } catch (error) {
      console.error('Tracking info error:', error);
      throw new Error('Failed to get tracking information');
    }
  }
}

const safexpressApi = new SafexpressApi();
export default safexpressApi; 