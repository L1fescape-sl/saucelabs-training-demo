const { Builder, By, Key } = require('selenium-webdriver')
const username = process.env.USERNAME
const accessKey = process.env.ACCESS_KEY
const baseUrl = 'http://saucelabs.github.io/training-test-page'

async function example() {
    const driver = await new Builder().withCapabilities({
        browserName: 'safari',
        version: '11.1',
        platformName: 'macOS 10.13',
        'sauce:options': {
            username,
            accessKey,
            build: 'Sauce Labs Training Test - NodeJS',
            name: 'add-comment'
        }
    }).usingServer('https://@ondemand.saucelabs.com:443/wd/hub').build()

    const comment = 'whale hello there'

    try {
        await driver.get(baseUrl)
        const comments = await driver.findElement(By.id('comments'))
        await comments.sendKeys(comment)

        const send = await driver.findElement(By.id('submit'))
        await send.sendKeys(Key.RETURN)

        const yourComments = await driver.findElement(By.id('your_comments'))
        const commentText = await yourComments.getText()

        if (commentText === `Your comments: ${comment}`) {
            driver.executeScript('sauce:job-result=passed')
            console.log("Test Passed!")
        } else {
            driver.executeScript('sauce:job-result=failed')
            console.log('Test Failed! Comments do not match.')
        }
    } catch (e) {
        console.log('Test Failed!', e)
    } finally {
        await driver.quit()
    }
}

example()