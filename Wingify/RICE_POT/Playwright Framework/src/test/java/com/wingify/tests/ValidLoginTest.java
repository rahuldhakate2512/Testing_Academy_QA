package com.wingify.tests;

import com.microsoft.playwright.Browser;
import com.microsoft.playwright.BrowserContext;
import com.microsoft.playwright.BrowserType;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.Playwright;
import com.microsoft.playwright.PlaywrightException;
import com.wingify.pages.LoginPage;
import io.qameta.allure.Description;
import io.qameta.allure.Epic;
import io.qameta.allure.Feature;
import io.qameta.allure.Severity;
import io.qameta.allure.SeverityLevel;
import io.qameta.allure.Story;
import org.testng.Assert;
import org.testng.SkipException;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.Test;

@Epic("Wingify Login")
@Feature("Valid Login Scenarios")
public class ValidLoginTest {

    private static final String LOGIN_URL = "https://app.wingify.com/#/login";
    private static final int LOGIN_TIMEOUT_MS = 30000;

    private Playwright playwright;
    private Browser browser;
    private BrowserContext context;
    private LoginPage loginPage;

    @BeforeTest(alwaysRun = true)
    public void launchBrowser() {
        try {
            playwright = Playwright.create();
            browser = playwright.chromium().launch(new BrowserType.LaunchOptions().setHeadless(false));
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to launch browser", e);
        }
    }

    @BeforeMethod(alwaysRun = true)
    public void openLoginPage() {
        try {
            context = browser.newContext();
            Page page = context.newPage();
            loginPage = new LoginPage(page);
            loginPage.navigateTo(LOGIN_URL);
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to prepare login page", e);
        }
    }

    @AfterMethod(alwaysRun = true)
    public void closeContext() {
        try {
            if (context != null) {
                context.close();
            }
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to close browser context", e);
        }
    }

    @AfterTest(alwaysRun = true)
    public void closeBrowser() {
        try {
            if (browser != null) {
                browser.close();
            }
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to close browser", e);
        } finally {
            if (playwright != null) {
                playwright.close();
            }
        }
    }

    private String readCredential(String propertyName, String environmentName) {
        String value = System.getProperty(propertyName);
        if (value == null || value.isBlank() || value.startsWith("${")) {
            value = System.getenv(environmentName);
        }
        if (value == null || value.isBlank()) {
            throw new SkipException("Insufficient information to determine.");
        }
        return value;
    }

    @Test(priority = 1, description = "Login form displays email, password and submit controls")
    @Story("Login form display")
    @Severity(SeverityLevel.BLOCKER)
    @Description("Verifies the email field, password field and submit button are visible on the login page")
    public void verifyLoginFormIsDisplayed() {
        try {
            Assert.assertTrue(loginPage.isLoginFormDisplayed(), "Login form controls are not displayed");
        } catch (PlaywrightException e) {
            Assert.fail("Login form verification failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 2, description = "Login page URL contains login route")
    @Story("Login page access")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verifies the browser is on the login route after opening the login page")
    public void verifyLoginPageUrl() {
        try {
            Assert.assertTrue(loginPage.isOnLoginPage(), "Browser is not on the login page");
        } catch (PlaywrightException e) {
            Assert.fail("Login page URL verification failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 3, description = "Remember Me checkbox can be checked and unchecked")
    @Story("Remember Me")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verifies the Remember Me checkbox toggles between checked and unchecked states")
    public void verifyRememberMeToggle() {
        try {
            loginPage.setRememberMe(true);
            Assert.assertTrue(loginPage.isRememberMeChecked(), "Remember Me should be checked");
            loginPage.setRememberMe(false);
            Assert.assertFalse(loginPage.isRememberMeChecked(), "Remember Me should be unchecked");
        } catch (PlaywrightException e) {
            Assert.fail("Remember Me verification failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 4, description = "Valid credentials navigate user away from login page")
    @Story("Successful authentication")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verifies valid credentials supplied through -Dvwo.username and -Dvwo.password transition the user away from the login page")
    public void verifyLoginWithValidCredentials() {
        String username = readCredential("vwo.username", "VWO_USERNAME");
        String password = readCredential("vwo.password", "VWO_PASSWORD");
        try {
            Assert.assertTrue(loginPage.login(username, password), "Login submit control was not enabled");
            Assert.assertTrue(loginPage.waitForNavigationAwayFromLogin(LOGIN_TIMEOUT_MS),
                    "User was not navigated away from the login page");
        } catch (PlaywrightException e) {
            Assert.fail("Valid login verification failed: " + e.getMessage(), e);
        }
    }

    @Test(priority = 5, description = "Valid credentials with Remember Me checked navigate user away from login page")
    @Story("Successful authentication with Remember Me")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verifies valid credentials with Remember Me checked transition the user away from the login page")
    public void verifyLoginWithValidCredentialsAndRememberMe() {
        String username = readCredential("vwo.username", "VWO_USERNAME");
        String password = readCredential("vwo.password", "VWO_PASSWORD");
        try {
            loginPage.setRememberMe(true);
            Assert.assertTrue(loginPage.login(username, password), "Login submit control was not enabled");
            Assert.assertTrue(loginPage.waitForNavigationAwayFromLogin(LOGIN_TIMEOUT_MS),
                    "User was not navigated away from the login page");
        } catch (PlaywrightException e) {
            Assert.fail("Valid login with Remember Me verification failed: " + e.getMessage(), e);
        }
    }
}
