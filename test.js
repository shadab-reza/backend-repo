
var count = 1;
// async function run(api, appid) {

//     const requestOptions = {
//         method: "GET",
//         redirect: "follow"
//     };

//     fetch(`http://192.168.1.7:3000/${api}?userid=1119&page=1&size=30&appId=${appid}&userId=1119`, requestOptions)
//         // fetch(`http://127.1.1.1:3000/${api}?userid=1119&page=1&size=30&appId=${appid}`, requestOptions)
//         .then((response) => response.json())
//         .then((result) => console.log("success response from appid : " + count++))
//         .catch((error) => console.error(error));
// }

async function run(api, appid) {

    const requestOptions = {
        method: "GET",
        redirect: "follow"
    };

    // fetch(`https://backend-repo-w178.onrender.com/${api}?userid=1119`, requestOptions)
    fetch(`http://192.168.1.7:3000/${api}?userid=1119&page=1&size=30&appId=${appid}&userId=1119`, requestOptions)
        .then((response) => response.text())
        .then((result) => console.log(result.length + " success response from appid : " + count++))
        .catch((error) => console.error(error));
}

async function main() {


    setInterval(() => {
        for (let i = 0; i < 300; i++) {
            Promise.all([
                run('user', 'MASTERSHAD'), run('user', '1STB1tNfUx'), run('txn', 'PNozKFxWwz'),
            ]);
            Promise.all([
                run('work-report', 'MASTERSHAD'), run('work-report', '1STB1tNfUx'), run('work-report', 'PNozKFxWwz'),
            ]);
            Promise.all([
                run('txn', 'MASTERSHAD'), run('task', '1STB1tNfUx'), run('task', 'PNozKFxWwz')
            ]);
            Promise.all([
                run('task', 'MASTERSHAD'), run('txn', '1STB1tNfUx'), run('user', 'PNozKFxWwz'),
            ]);
            // await run('MASTERSHAD');
            // await run('1STB1tNfUx');
            // await run('PNozKFxWwz');
        }
    }, 3000);

    // const appids = ['MASTERSHAD', '1STB1tNfUx', 'PNozKFxWwz'];
    // for (const appid of appids) {
    //     await run(appid);
    // }

}

main().catch(console.error);