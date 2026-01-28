export function jumpRequest(url, reqBody, init, successCallback, failCallback, timeout = 30000) {
    let reqHeader = { 'TRAN_PROCESS': '', 'TRAN_ID': '' };
    let param = { 'REQ_HEAD': reqHeader, 'REQ_BODY': reqBody };
    let body = encodeURI(`REQ_MESSAGE=${JSON.stringify(param)}`);
    let myInit = {
        method: 'POST',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
        body: body,
        cache: 'no-cache',
        credentials: 'include',
    };
    let realInit = Object.assign(myInit, init);
    realInit.method === 'GET' && delete realInit.body;
    fetch(url, realInit)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (successCallback) {
                successCallback(data);
            }
        })
        .catch(error => {
            if (failCallback) {
                failCallback(error);
            }
        });
}

// 定义属于 cpay 的接口列表
const cpayList = ['queryCpayTotalErrorProcess', 'handlerCpayErrorProcess'];

// 异步处理函数
const FlexProcess = async (process, params) => {
    return new Promise((resolve, reject) => {
        // 根据 process 是否在 cpayList 中决定请求路径
        const epccUrl = cpayList.includes(process) ? `cpay/${process}.json` : `epcc/${process}.json`;
        
        // 调用 jumpRequest 发送 POST 请求
        jumpRequest(epccUrl, params, {},
            (response) => {
                resolve(response);
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export default FlexProcess;