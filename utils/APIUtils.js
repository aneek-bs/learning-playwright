class APIUtils {
  constructor(apiContext, loginPayload) {
    this.apiContext = apiContext;
    this.loginPayload = loginPayload;
  }

  async getToken() {
    //Fetch the token using login API
    const loginResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/auth/login',
      {
        data: this.loginPayload, //pass the payload containing the user ID and password
      }
    );

    const loginResponseJson = await loginResponse.json();
    const token = loginResponseJson.token;
    console.log('Token fetched!');
    return token;
  }

  async getOrderId(orderPayload) {
    //Place the order directly via create-order API

    let response = {};
    response.token = await this.getToken();
    const orderResponse = await this.apiContext.post(
      'https://rahulshettyacademy.com/api/ecom/order/create-order',
      {
        data: orderPayload, //pass the payload containing the country and product
        headers: {
          Authorization: await response.token, //pass the login token as the request header
          'Content-Type': 'application/json',
        },
      }
    );

    const orderResponseJson = await orderResponse.json();
    const orderId = orderResponseJson.orders[0]; //Fetch the order ID from the response
    response.orderId = orderId;
    return response;
  }
}

module.exports = { APIUtils };
