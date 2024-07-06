const ms = require(`pretty-ms`);
const puppeteer = require(`puppeteer`);
const fs = require(`fs`);

const BATCH_NUMBER = 1;

function createProgressBar(percentage) { // percentage should be from 0 to 1 only
    const loadedBarCount = Math.round(percentage * 20);
    const progressBar = Array(20).fill(`▱`).fill(`▰`, 0, loadedBarCount).join(``);

    return `【${progressBar}】${percentage * 100}%`;
}

function plainTextToObject(string) {
    // Remove irrelevant information
    const startIndex = string.indexOf('*');
    const endIndex = string.indexOf('Tổng:');

    const untrimmedResult = string.substring(startIndex, endIndex).trim();

    // Convert into array and trim
    const trimmedResultArray = untrimmedResult.split('*').slice(-5).map(element => element.trim());
    const scoresArray = trimmedResultArray.map(string => {
        const numbers = string.match(/\d+/);
        const result = numbers ? parseInt(numbers[0], 10) : null;

        return result;
    });

    const result = ['TV', 'TA', 'TLP', 'KHTN', 'KHXH'].reduce((acc, key, index) => {
        acc[key] = scoresArray[index];
        return acc;
    }, {});

    return result;
}

function HTMLtoPlainText(input) {
    let html = input;

    html = html.replace(/<style([\s\S]*?)<\/style>/gi, '');
    html = html.replace(/<script([\s\S]*?)<\/script>/gi, '');
    html = html.replace(/<\/div>/ig, '\n');
    html = html.replace(/<\/li>/ig, '\n');
    html = html.replace(/<li>/ig, '  *  ');
    html = html.replace(/<\/ul>/ig, '\n');
    html = html.replace(/<\/p>/ig, '\n');
    html = html.replace(/<br\s*[\/]?>/gi, "\n");
    html = html.replace(/<[^>]+>/ig, '');

    return html;
}

async function fetchData(p) {
    const rawData = await p.evaluate(() => {
        const element = document.querySelector('dd#lblKetQuaThi');
        return element.innerHTML;
    });

    const data = plainTextToObject(HTMLtoPlainText(rawData));
    return data;
}

const nameArray = fs.readFileSync(`./information/name.txt`,
    { encoding: 'utf8', flag: 'r' }).split('\n').slice(BATCH_NUMBER * 100 - 100, BATCH_NUMBER * 100);
const cccdArray = fs.readFileSync(`./information/CCCD.txt`,
    { encoding: 'utf8', flag: 'r' }).split('\n').slice(BATCH_NUMBER * 100 - 100, BATCH_NUMBER * 100);
const emailArray = fs.readFileSync(`./information/email.txt`,
    { encoding: 'utf8', flag: 'r' }).split('\n').slice(BATCH_NUMBER * 100 - 100, BATCH_NUMBER * 100);

const listlength = cccdArray.length;

let nameResult = [];
let cccdResult = [];
let emailResult = [];

let TVResult = [];
let TAResult = [];
let TLPResult = [];
let KHTNResult = [];
let KHXHResult = [];

let exam1Result = [];
let exam2Result = [];

(async () => {
    // Initiate browser
    const startTime = Date.now();
    const browser = await puppeteer.launch();

    for (let index = 0; index < listlength; index++) {
        console.clear();
        console.log(createProgressBar(index / listlength));
        console.log(`• Entry: ${index + 1}/${listlength}`);
        console.log(`• Fetched: ${nameResult.length}, Rejected: ${index - nameResult.length}`);
        console.log(`• Average speed: ${ms((Date.now() - startTime) / (index + 1))}/entry`);
        console.log(`• Elapsed time: ${ms(Date.now() - startTime, { verbose: true })}`);
        console.log(`• Estimated time left: ${ms((Date.now() - startTime) / (index + 1) * (listlength - (index + 1)), { verbose: true })}\n`);

        console.log(`Last person fetched: ${nameResult[nameResult.length - 1]} - [${TVResult[TVResult.length - 1]}, ${TAResult[TAResult.length - 1]}, ${TLPResult[TLPResult.length - 1]}, ${KHTNResult[KHTNResult.length - 1]}, ${KHXHResult[KHXHResult.length - 1]}] -> ${TVResult[TVResult.length - 1] + TAResult[TAResult.length - 1] + TLPResult[TLPResult.length - 1] + KHTNResult[KHTNResult.length - 1] + KHXHResult[KHXHResult.length - 1]}`);

        const page = await browser.newPage();

        // Navigate
        await page.goto('https://thinangluc.vnuhcm.edu.vn/dgnl/tra-thong-tin-ket-qua-thi');

        let didExam1 = false;
        let didExam2 = false;

        for (let i = 0; i < 5; i++) {
            try {
                await page.waitForSelector('#txtSoBaoDanh');
                await page.waitForSelector('#txtEmail');
                await page.waitForSelector('#cboDotDuThi');
            } catch (err) {
                console.log(`Unresponsive, trying again`);
                continue;
            }

            try {
                await page.select(`#cboDotDuThi`, '8');
                await page.$eval('#txtSoBaoDanh', (el, value) => el.value = value, cccdArray[index]);
                await page.$eval('#txtEmail', (el, value) => el.value = value, emailArray[index]);

                await page.click(`#bntSearch`);

                await page.waitForNetworkIdle();
            } catch (err) {
                console.log(`Unresponsive, trying again`);
                continue;
            }

            const mightBeData1 = await fetchData(page);

            if (mightBeData1.TV) {
                didExam1 = true;
                exam1Result.push(...Object.values(mightBeData1));

                break;
            }
        }

        await page.reload();

        for (let i = 0; i < 5; i++) {
            try {
                await page.waitForSelector('#txtSoBaoDanh');
                await page.waitForSelector('#txtEmail');
                await page.waitForSelector('#cboDotDuThi');
            } catch (err) {
                console.log(`Unresponsive, trying again`);
                continue;
            }

            try {
                await page.$eval('#txtSoBaoDanh', (el, value) => el.value = value, cccdArray[index]);
                await page.$eval('#txtEmail', (el, value) => el.value = value, emailArray[index]);

                await page.click(`#bntSearch`);

                await page.waitForNetworkIdle();
            } catch (err) {
                console.log(`Unresponsive, trying again`);
                continue;
            }

            const mightBeData = await fetchData(page);

            if (mightBeData.TV) {
                didExam2 = true;
                exam2Result.push(...Object.values(mightBeData));

                break;
            }
        }

        if (didExam1 != didExam2) {
            nameResult.push(nameArray[index]);
            cccdResult.push(cccdArray[index]);
            emailResult.push(emailArray[index]);

            if (didExam1) {
                TVResult.push(exam1Result[0]);
                TAResult.push(exam1Result[1]);
                TLPResult.push(exam1Result[2]);
                KHTNResult.push(exam1Result[3]);
                KHXHResult.push(exam1Result[4]);
            }

            if (didExam2) {
                TVResult.push(exam2Result[0]);
                TAResult.push(exam2Result[1]);
                TLPResult.push(exam2Result[2]);
                KHTNResult.push(exam2Result[3]);
                KHXHResult.push(exam2Result[4]);
            }
        }

        if (didExam1 && didExam2) {
            nameResult.push(nameArray[index]);
            cccdResult.push(cccdArray[index]);
            emailResult.push(emailArray[index]);

            if (exam1Result.reduce((partialSum, a) => partialSum + a, 0) > exam2Result.reduce((partialSum, a) => partialSum + a, 0)) {
                TVResult.push(exam1Result[0]);
                TAResult.push(exam1Result[1]);
                TLPResult.push(exam1Result[2]);
                KHTNResult.push(exam1Result[3]);
                KHXHResult.push(exam1Result[4]);
            } else if (exam1Result.reduce((partialSum, a) => partialSum + a, 0) < exam2Result.reduce((partialSum, a) => partialSum + a, 0)) {
                TVResult.push(exam2Result[0]);
                TAResult.push(exam2Result[1]);
                TLPResult.push(exam2Result[2]);
                KHTNResult.push(exam2Result[3]);
                KHXHResult.push(exam2Result[4]);
            } else {
                TVResult.push(exam2Result[0]);
                TAResult.push(exam2Result[1]);
                TLPResult.push(exam2Result[2]);
                KHTNResult.push(exam2Result[3]);
                KHXHResult.push(exam2Result[4]);
            }
        }

        exam1Result = [];
        exam2Result = [];

        console.clear();
        console.log(createProgressBar(index / listlength));
        console.log(`• Entry: ${index + 1}/${listlength}`);
        console.log(`• Fetched: ${nameResult.length}, Rejected: ${index - nameResult.length}`);
        console.log(`• Average speed: ${ms((Date.now() - startTime) / (index + 1))}/entry`);
        console.log(`• Elapsed time: ${ms(Date.now() - startTime, { verbose: true })}`);
        console.log(`• Estimated time left: ${ms((Date.now() - startTime) / (index + 1) * (listlength - (index + 1)), { verbose: true })}\n`);

        console.log(`Last person fetched: ${nameResult[nameResult.length - 1]} - [${TVResult[TVResult.length - 1]}, ${TAResult[TAResult.length - 1]}, ${TLPResult[TLPResult.length - 1]}, ${KHTNResult[KHTNResult.length - 1]}, ${KHXHResult[KHXHResult.length - 1]}] -> ${TVResult[TVResult.length - 1] + TAResult[TAResult.length - 1] + TLPResult[TLPResult.length - 1] + KHTNResult[KHTNResult.length - 1] + KHXHResult[KHXHResult.length - 1]}`);

        await page.close();
    }
    await browser.close();

    fs.writeFileSync(`./results/name.txt`, nameResult.join(`\n`));
    fs.writeFileSync(`./results/cccd.txt`, cccdResult.join(`\n`));
    fs.writeFileSync(`./results/email.txt`, emailResult.join(`\n`));
    fs.writeFileSync(`./results/TV.txt`, TVResult.join(`\n`));
    fs.writeFileSync(`./results/TA.txt`, TAResult.join(`\n`));
    fs.writeFileSync(`./results/TLP.txt`, TLPResult.join(`\n`));
    fs.writeFileSync(`./results/KHTN.txt`, KHTNResult.join(`\n`));
    fs.writeFileSync(`./results/KHXH.txt`, KHXHResult.join(`\n`));
})();

process.on('uncaughtException', () => {
    console.log(`SOMETHING WENT WRONG. WRITING ANYWAY`);

    fs.writeFileSync(`./results/name.txt`, nameResult.join(`\n`));
    fs.writeFileSync(`./results/cccd.txt`, cccdResult.join(`\n`));
    fs.writeFileSync(`./results/email.txt`, emailResult.join(`\n`));
    fs.writeFileSync(`./results/TV.txt`, TVResult.join(`\n`));
    fs.writeFileSync(`./results/TA.txt`, TAResult.join(`\n`));
    fs.writeFileSync(`./results/TLP.txt`, TLPResult.join(`\n`));
    fs.writeFileSync(`./results/KHTN.txt`, KHTNResult.join(`\n`));
    fs.writeFileSync(`./results/KHXH.txt`, KHXHResult.join(`\n`));
});

process.on('unhandledRejection', () => {
    console.log(`SOMETHING WENT WRONG. WRITING ANYWAY`);

    fs.writeFileSync(`./results/name.txt`, nameResult.join(`\n`));
    fs.writeFileSync(`./results/cccd.txt`, cccdResult.join(`\n`));
    fs.writeFileSync(`./results/email.txt`, emailResult.join(`\n`));
    fs.writeFileSync(`./results/TV.txt`, TVResult.join(`\n`));
    fs.writeFileSync(`./results/TA.txt`, TAResult.join(`\n`));
    fs.writeFileSync(`./results/TLP.txt`, TLPResult.join(`\n`));
    fs.writeFileSync(`./results/KHTN.txt`, KHTNResult.join(`\n`));
    fs.writeFileSync(`./results/KHXH.txt`, KHXHResult.join(`\n`));
});
