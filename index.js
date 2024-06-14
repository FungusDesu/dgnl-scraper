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

const puppeteer = require(`puppeteer`);
const fs = require(`fs`);

console.log(`preparing to launch`);

const nameArray = require(`./information/name.json`);
const classArray = require(`./information/class.json`);
const cccdArray = require(`./information/CCCD.json`);
const emailArray = require(`./information/email.json`);

const listlength = cccdArray.length;

let nameResult = [];
let classResult = [];
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
    const browser = await puppeteer.launch();

    console.log(`browser launched, enumeration begins now`)

    for (let index = 0; index < listlength; index++) {
        console.log(`Đang tìm dữ liệu ${nameArray[index]} lớp ${classArray[index]} cccd ${cccdArray[index]} email ${emailArray[index]}...`)

        const page = await browser.newPage();

        // Navigate
        await page.goto('https://thinangluc.vnuhcm.edu.vn/dgnl/tra-thong-tin-ket-qua-thi');

        async function fetchData(p) {
            const rawData = await p.evaluate(() => {
                const element = document.querySelector('dd#lblKetQuaThi');
                return element.innerHTML;
            });

            const data = plainTextToObject(HTMLtoPlainText(rawData));
            return data;
        }

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

            await page.select(`#cboDotDuThi`, '8');
            await page.$eval('#txtSoBaoDanh', (el, value) => el.value = value, cccdArray[index]);
            await page.$eval('#txtEmail', (el, value) => el.value = value, emailArray[index]);
    
            await page.click(`#bntSearch`);
    
            await page.waitForNetworkIdle();

            const mightBeData1 = await fetchData(page);

            if (mightBeData1.TV) {
                didExam1 = true;

                console.log(`${nameArray[index]} lớp ${classArray[index]} có thi đgnl đợt 1 ${Object.entries(mightBeData1).map(([key, val]) => `${key}: ${val}`).join(`, `)}`);

                exam1Result.push(...Object.values(mightBeData1));

                break;
            }

            console.log(`không tìm được dữ liệu học sinh, đang thử lại`);
        }

        if (!didExam1) {
            console.log(`${nameArray[index]} lớp ${classArray[index]} không thi đgnl đợt 1, hoặc đã có lỗi xảy ra khi tìm dữ liệu`);
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
            
            await page.$eval('#txtSoBaoDanh', (el, value) => el.value = value, cccdArray[index]);
            await page.$eval('#txtEmail', (el, value) => el.value = value, emailArray[index]);
    
            await page.click(`#bntSearch`);
    
            await page.waitForNetworkIdle();

            const mightBeData = await fetchData(page);

            if (mightBeData.TV) {
                didExam2 = true;

                console.log(`${nameArray[index]} lớp ${classArray[index]} có thi đgnl đợt 2 ${Object.entries(mightBeData).map(([key, val]) => `${key}: ${val}`).join(`, `)}`);

                exam2Result.push(...Object.values(mightBeData));

                break;
            }

            console.log(`không tìm được dữ liệu học sinh, đang thử lại`);
        }

        if (!didExam2) {
            console.log(`${nameArray[index]} lớp ${classArray[index]} không thi đgnl đợt 2, hoặc đã có lỗi xảy ra khi tìm dữ liệu`);
        }

        if (didExam1 != didExam2) {
            nameResult.push(nameArray[index]);
            classResult.push(classArray[index]);
            cccdResult.push(cccdArray[index]);
            emailResult.push(emailArray[index]);

            if (didExam1) {
                TVResult.push(exam1Result[0]);
                TAResult.push(exam1Result[1]);
                TLPResult.push(exam1Result[2]);
                KHTNResult.push(exam1Result[3]);
                KHXHResult.push(exam1Result[4]);

                console.log(`${nameArray[index]} lớp ${classArray[index]} chỉ thi đợt 1, sẽ lấy điểm đợt 1`);
            }

            if (didExam2) {
                TVResult.push(exam2Result[0]);
                TAResult.push(exam2Result[1]);
                TLPResult.push(exam2Result[2]);
                KHTNResult.push(exam2Result[3]);
                KHXHResult.push(exam2Result[4]);

                console.log(`${nameArray[index]} lớp ${classArray[index]} chỉ thi đợt 2, sẽ lấy điểm đợt 2`);
            }
        }

        if (didExam1 && didExam2) {
            nameResult.push(nameArray[index]);
            classResult.push(classArray[index]);
            cccdResult.push(cccdArray[index]);
            emailResult.push(emailArray[index]);

            if (exam1Result.reduce((partialSum, a) => partialSum + a, 0) > exam2Result.reduce((partialSum, a) => partialSum + a, 0)) {
                TVResult.push(exam1Result[0]);
                TAResult.push(exam1Result[1]);
                TLPResult.push(exam1Result[2]);
                KHTNResult.push(exam1Result[3]);
                KHXHResult.push(exam1Result[4]);

                console.log(`${nameArray[index]} lớp ${classArray[index]} thi cả 2 đợt, sẽ lấy điểm đợt 1`);
            } else if (exam1Result.reduce((partialSum, a) => partialSum + a, 0) < exam2Result.reduce((partialSum, a) => partialSum + a, 0)) {
                TVResult.push(exam2Result[0]);
                TAResult.push(exam2Result[1]);
                TLPResult.push(exam2Result[2]);
                KHTNResult.push(exam2Result[3]);
                KHXHResult.push(exam2Result[4]);

                console.log(`${nameArray[index]} lớp ${classArray[index]} thi cả 2 đợt, sẽ lấy điểm đợt 2`);
            } else {
                TVResult.push(exam2Result[0]);
                TAResult.push(exam2Result[1]);
                TLPResult.push(exam2Result[2]);
                KHTNResult.push(exam2Result[3]);
                KHXHResult.push(exam2Result[4]);

                console.log(`${nameArray[index]} lớp ${classArray[index]} thi cả 2 đợt, sẽ lấy điểm đợt gần đây nhất`);
            }
        }

        console.log(`-------------------------`)
        exam1Result = [];
        exam2Result = [];
        
        await page.close();
    }
    await browser.close();

    fs.writeFileSync(`./results/name.txt`, nameResult.join(`\n`));
    fs.writeFileSync(`./results/class.txt`, classResult.join(`\n`));
    fs.writeFileSync(`./results/cccd.txt`, cccdResult.join(`\n`));
    fs.writeFileSync(`./results/email.txt`, emailResult.join(`\n`));
    fs.writeFileSync(`./results/TV.txt`, TVResult.join(`\n`));
    fs.writeFileSync(`./results/TA.txt`, TAResult.join(`\n`));
    fs.writeFileSync(`./results/TLP.txt`, TLPResult.join(`\n`));
    fs.writeFileSync(`./results/KHTN.txt`, KHTNResult.join(`\n`));
    fs.writeFileSync(`./results/KHXH.txt`, KHXHResult.join(`\n`));
})();