class LoginPage {
  constructor(page) {
    this.page = page;
    this.email = page.locator('#userEmail');
    this.password = page.locator('#userPassword');
    this.loginBtn = page.locator('#login');
  }

  async goToLoginPage() {
    await this.page.goto('https://rahulshettyacademy.com/client/#/auth/login');
  }

  async validLogin(emailId, password) {
    await this.email.fill(emailId);
    await this.password.fill(password);
    await this.loginBtn.click();
    await this.page.waitForLoadState('networkidle');
  }
}

module.exports = { LoginPage };
