import { config, func1 } from '../config.js'
// 根据返回错误码，给予对应的提示
const tips = {
    1: '抱歉，出错了',
    1005: 'appkey无效',
    3000: '期刊不存在'
}
// 请求类
class HTTP {
    request(params) {
        if (!params.method) {
            params.method = 'GET' // 如果没传默认GET
        }
        wx.request({
            url: config.api_base_url + params.url,
            method: params.method,
            data: params.data,
            header: {
                'content-type': 'application/json',
                'appkey': config.appKey
            },
            success: (res) => { // 成功
                let code = res.statusCode.toString()
                if (code.startsWith('2')) {
                    params.success(res.data)
                } else {
                    let error_code = res.data.error_code
                    this._show_error(error_code)
                }
            },
            fail: (err) => { // 失败 - 断网...
                this._show_error(1)
            }
        })
    }
    // 报错处理
    _show_error(error_code) {
        if (!error_code) error_code = 1
        wx.showToast({
            title: tips[error_code],
            icon: 'none',
            duration: 2000
        })
    }
}
// 扔出去
export { HTTP }