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
import org.testng.annotations.AfterMethod;
import org.testng.annotations.AfterTest;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.BeforeTest;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

@Epic("Wingify Login")
@Feature("Invalid Login Scenarios")
public class InvalidLoginTest {

    private static final String LOGIN_URL = "https://app.wingify.com/#/login";
    private static final int REJECTION_WINDOW_MS = 5000;

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

    @DataProvider(name = "invalidCredentials")
    public Object[][] invalidCredentials() {
        return new Object[][] {
                {"invalid.user@example.com", "WrongPass@123"},
                {"", "WrongPass@123"},
                {"invalid.user@example.com", ""},
                {"", ""},
                {"invalid-email-format", "WrongPass@123"},
                {"   ", "   "},
                {"invalid.user@example.com", "short"}
        };
    }

    @Test(dataProvider = "invalidCredentials", description = "Invalid credentials do not authenticate the user")
    @Story("Rejected authentication")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verifies invalid, empty and malformed credentials keep the user on the login page")
    public void verifyInvalidLoginIsRejected(String email, String password) {
        try {
            loginPage.login(email, password);
            Assert.assertFalse(loginPage.waitForNavigationAwayFromLogin(REJECTION_WINDOW_MS),
                    "User was navigated away from the login page with invalid credentials");
            Assert.assertTrue(loginPage.isOnLoginPage(), "Browser is no longer on the login page");
        } catch (PlaywrightException e) {
            Assert.fail("Invalid login verification failed: " + e.getMessage(), e);
        }
    }

    @Test(description = "Invalid credentials with Remember Me checked do not authenticate the user")
    @Story("Rejected authentication with Remember Me")
    @Severity(SeverityLevel.CRITICAL)
    @Description("Verifies invalid credentials with Remember Me checked keep the user on the login page")
    public void verifyInvalidLoginWithRememberMeIsRejected() {
        try {
            loginPage.setRememberMe(true);
            loginPage.login("invalid.user@example.com", "WrongPass@123");
            Assert.assertFalse(loginPage.waitForNavigationAwayFromLogin(REJECTION_WINDOW_MS),
                    "User was navigated away from the login page with invalid credentials");
            Assert.assertTrue(loginPage.isOnLoginPage(), "Browser is no longer on the login page");
        } catch (PlaywrightException e) {
            Assert.fail("Invalid login with Remember Me verification failed: " + e.getMessage(), e);
        }
    }

    @Test(description = "Login form remains displayed after rejected authentication")
    @Story("Rejected authentication form state")
    @Severity(SeverityLevel.NORMAL)
    @Description("Verifies the login form controls remain visible after invalid credentials are submitted")
    public void verifyLoginFormRemainsAfterInvalidLogin() {
        try {
            loginPage.login("invalid.user@example.com", "WrongPass@123");
            Assert.assertFalse(loginPage.waitForNavigationAwayFromLogin(REJECTION_WINDOW_MS),
                    "User was navigated away from the login page with invalid credentials");
            Assert.assertTrue(loginPage.isLoginFormDisplayed(), "Login form controls are not displayed");
        } catch (PlaywrightException e) {
            Assert.fail("Login form state verification failed: " + e.getMessage(), e);
        }
    }
}
