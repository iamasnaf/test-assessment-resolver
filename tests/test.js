import { Builder, By, Key, locateWith, until } from 'selenium-webdriver';
import * as CONSTANT from "../utils/constants.js";
import * as LOCATOR from "../utils/locators.js";
import { expect, assert } from 'chai';


const headerVerification = async (testHeadId, constHeadtxt) => {

    const testHead = await driver
        .findElement(By.id(testHeadId)).getText();
    assert.include(testHead, constHeadtxt, 'Header is correct');

};

describe('All Tests', () => {

    let driver;
    before(async () => {
        driver = await new Builder()
            .forBrowser('chrome')
            .build();

        await driver
            .get('http://localhost:8080/QE-index.html');
        // Navigate to the Home Page and verify the Title
        const title = await driver.getTitle();
        assert.include(title, "Home", 'Landed on corret URL');
    });

    after(async () => {
        await driver
            .quit();
    });

    // Verification of Test 1 Div
    it('Test 1', async () => {
        // Header verification
        await headerVerification(LOCATOR.test1HeaderId, "Test 1");
        const test1Header = await driver
            .findElement(By.id(LOCATOR.test1HeaderId)).getText();
        assert.include(test1Header, "Test 1", 'Header is correct');
        // Username verification
        await driver
            .findElement(By.id(LOCATOR.usernameInputId))
            .sendKeys(process.env.username);
        // Password verification
        await driver
            .findElement(By.id(LOCATOR.passwordInputId))
            .sendKeys(process.env.password);
        // Sign In button verification
        await driver
            .findElement(By.xpath(LOCATOR.signInButtonXpath))
            .click();
    });

    // Verification of Test 2 Div
    it('Test 2', async () => {
        // Header verification
        await headerVerification(LOCATOR.test2HeaderId, "Test 2");
        // Verification of total number of List Item
        const countListItem = await driver.findElement(By.className(`${LOCATOR.listGroupTest2Class} li`));
        expect(countListItem).to.equal(3, 'List items numbers are not correct');
        // Verification of List item Text and there order
        const listItemTexts = await Promise.all(
            listItemTexts.map(async (item) => await item.getText()));
        expect(listItemTexts[1]).to.deep.equal("List Item 2");
        // Verification of List item 2 badge
        const badgeFor2Item = await countListItem.findElement(By.xpath('//*[@id="test-2-div"]/ul/li[2]/span')).getText();
        expect(badgeFor2Item).to.equal(6, 'List Item 2 badge is not correct');

    });

    // Verification of Test 3 Div
    it('Test 3', async () => {
        // Header verification
        await headerVerification(LOCATOR.test3HeaderId, "Test 3");
        //
        const buttonDropdown = await driver.findElement(By.id(LOCATOR.menuDropDownId));
        const defaultSelect = await buttonDropdown.getCssValue('outerText');
        expect(defaultSelect).to.equal('Option 1 ', "Default selection is not correct");
        await buttonDropdown.click();
        await driver.findElement(By.xpath('//*[@id="test-3-div"]/div/div/a[3]')).click();
    });

    // Verification of Test 4 Div
    it('Test 4', async () => {
        // Header verification
        await headerVerification(LOCATOR.test4HeaderId, "Test 4");

        // Enabled button 
        const buttonEnableLocate = await driver.findElement(By.id(LOCATOR.test4HeaderId)).findElement(By.className('btn-primary')).isEnabled();
        expect(buttonEnableLocate).to.be.false;
        // Disabled button
        const buttonDisabledLocate = await driver.findElement(By.id(LOCATOR.test4HeaderId)).findElement(By.className('btn-secondary')).getAttribute('disabled');
        expect(buttonEnableLocate).to.be.true;
    });

    // Verification of Test 5 Div
    it('Test 5', async () => {
        // Header verification
        await headerVerification(LOCATOR.test5HeaderId, "Test 5");

        // wait and verify the button will be displayed 
        const loadBtnTxt = await driver.findElement(By.id('test5-placeholder')).getText();
        assert.include(loadBtnTxt, "A button will eventually show up here...", "Loading state button Message is not correct");
        const buttonLoading = await driver.wait(until.elementLocated(By.id('test5-button')));
        // Click and verify the assertion message
        await driver.findElement(By.id('test5-button')).click();
        const successAlert = await driver.findElement(By.id('test5-alert')).getText();
        assert.include(successAlert, "/nYou clicked a button!/n", "Alert is not correct or the button pressed failed");

    });

    // Verification of Test 6 Div
    it('Test 6', async () => {
        // Header verification
        await headerVerification(LOCATOR.test6HeaderId, "Test 6");

        // method to find the value of any cell
        const findCellValue = async (row, column) =>{
            const table = await driver.findElement(By.xpath('//*[@id="test-6-div"]/div/table'));
            const xpathCell = `./tbody/tr[${row+1}]/td[${column+1}]`

            const cellVal = await table.findElement(By.xpath(xpathCell)).getText();
            return cellVal;
        }
        const cellValue = await findCellValue(2,2);
        assert.include(cellValue, "Ventosanzap", `Cell value is ${cellValue} instead of Ventosanzap`);
    });
});


