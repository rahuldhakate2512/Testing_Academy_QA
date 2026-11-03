package com.wingify.pages;

import com.microsoft.playwright.Locator;
import com.microsoft.playwright.Page;
import com.microsoft.playwright.PlaywrightException;
import com.microsoft.playwright.TimeoutError;
import com.microsoft.playwright.options.LoadState;
import com.microsoft.playwright.options.WaitForSelectorState;
import io.qameta.allure.Step;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;
import java.lang.reflect.Field;

public class LoginPage {

    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.FIELD)
    public @interface FindBy {
        String xpath();
    }

    private static final int FORM_TIMEOUT_MS = 30000;

    private final Page page;

    @FindBy(xpath = "(//input[not(@type='password') and not(@type='checkbox') and not(@type='hidden')])[1]")
    private Locator emailInput;

    @FindBy(xpath = "//input[@type='password']")
    private Locator passwordInput;

    @FindBy(xpath = "//input[@type='checkbox']")
    private Locator rememberMeCheckbox;

    @FindBy(xpath = "//button[@type='submit']")
    private Locator loginButton;

    public LoginPage(Page page) {
        this.page = page;
        initElements();
    }

    private void initElements() {
        try {
            for (Field field : LoginPage.class.getDeclaredFields()) {
                FindBy findBy = field.getAnnotation(FindBy.class);
                if (findBy != null) {
                    field.setAccessible(true);
                    field.set(this, page.locator("xpath=" + findBy.xpath()));
                }
            }
        } catch (IllegalAccessException e) {
            throw new IllegalStateException("Unable to initialise page elements for LoginPage", e);
        }
    }

    @Step("Open login page")
    public void navigateTo(String url) {
        try {
            page.navigate(url);
            emailInput.waitFor(new Locator.WaitForOptions()
                    .setState(WaitForSelectorState.VISIBLE)
                    .setTimeout(FORM_TIMEOUT_MS));
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to open login page: " + url, e);
        }
    }

    @Step("Enter email address")
    public void enterEmail(String email) {
        try {
            emailInput.fill(email);
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to enter email address", e);
        }
    }

    @Step("Enter password")
    public void enterPassword(String password) {
        try {
            passwordInput.fill(password);
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to enter password", e);
        }
    }

    @Step("Set Remember Me to {checked}")
    public void setRememberMe(boolean checked) {
        try {
            rememberMeCheckbox.setChecked(checked, new Locator.SetCheckedOptions().setForce(true));
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to set Remember Me checkbox", e);
        }
    }

    @Step("Submit login form")
    public boolean submit() {
        try {
            if (!loginButton.isEnabled()) {
                return false;
            }
            loginButton.click();
            return true;
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to submit login form", e);
        }
    }

    @Step("Login with provided credentials")
    public boolean login(String email, String password) {
        enterEmail(email);
        enterPassword(password);
        return submit();
    }

    @Step("Check login form is displayed")
    public boolean isLoginFormDisplayed() {
        try {
            return emailInput.isVisible() && passwordInput.isVisible() && loginButton.isVisible();
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to verify login form visibility", e);
        }
    }

    @Step("Check Remember Me state")
    public boolean isRememberMeChecked() {
        try {
            return rememberMeCheckbox.isChecked();
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to read Remember Me state", e);
        }
    }

    @Step("Check browser is on login page")
    public boolean isOnLoginPage() {
        try {
            page.waitForLoadState(LoadState.DOMCONTENTLOADED);
            return page.url().contains("login");
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to read current page URL", e);
        }
    }

    @Step("Wait for navigation away from login page")
    public boolean waitForNavigationAwayFromLogin(int timeoutMs) {
        try {
            page.waitForURL(url -> !url.contains("login"), new Page.WaitForURLOptions().setTimeout(timeoutMs));
            return true;
        } catch (TimeoutError e) {
            return false;
        } catch (PlaywrightException e) {
            throw new IllegalStateException("Unable to observe navigation after login", e);
        }
    }
}
