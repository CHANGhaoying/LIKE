import { HTTP } from '../../utils/http.js'

let http = new HTTP()
//const app = getApp()

Page({//100 电影 200 音乐 300 诗句 
    data:{
        data: {},
        year:"",
        monthS: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月","十二月"],
        month: "",
        first: "",
        second: "",
        flag: false,
        music_index: '',
        
    },


//传值的方法
pass(res,flag) {
    let date = res.pubdate
    let year = date.split('-')[0]
    let Month = date.split('-')[1]
    let index
    if (Month < 10) {
        index = Number(Month.split('')[1]) - 1
    }
    else {
        index = Number(Month) - 1
    }
    let first = res.type == 100 ? "电" : res.type == 200 ? "音" : "诗"
    let second = res.type == 100 ? "影" : res.type == 200 ? "乐" : "句"
    let month = this.data.monthS[index]
    
    this.setData({
        data: res,
        year: year,
        month: month,
        first: first,
        second: second
    })

    if (flag) {//本地存储
        let arr = wx.getStorageSync('list') || []
        arr.push(res)
        //console.log(arr)
        wx.setStorageSync('list', arr)
    }
},
req(url) {
    //  封装后的请求调用
    http.request({
        url: url,
        success: (res) => {
            //console.log(res)
            this.pass(res,true)
        }
    })
},

    changeFlag(flag) {//切换flag
        this.setData({
            flag: flag
        })
    },

    onLoad: function () { 
        //音乐播放器定义为this.play
        this.play = wx.getBackgroundAudioManager()
        //监听背景暂停
        this.play.onPause(()=>{
            this.changeFlag(false)
            console.log('暂停')
        })
        //监听背景播放
        this.play.onPlay(() => {
            this.changeFlag(true)
            console.log('播放')
        })
        //监听自然结束
        this.play.onEnded(() => {
            this.changeFlag(false)
            console.log('结束')
        })
        //监听背景停止
        this.play.onStop(() => {
            this.changeFlag(false)
            console.log('停止')
        })
        //判断本地存储
        let arr = wx.getStorageSync('list')
        console.log(arr)
        arr ? this.pass(arr[0]) : this.req('/classic/latest')
    },

    find(n,url) {//前后跳转时查找本地是否存在
        let index = this.data.data.index
        let arr = wx.getStorageSync('list')
        //console.log(arr)
        let find = arr.some(item => {
            if (item.index == index + n) {
                this.pass(item)
            }
            return item.index == index + n
        })
        if (!find) {
            this.req('/classic/' + index + url)
        }
    },
    
    next() {//下一页
        this.find(1,'/next')
    },

    previous() {//上一页
        this.find(-1, '/previous')
    },
    toplay() {//页面播放
        let play = this.play
        play.src = this.data.data.url
        play.title = this.data.data.title
        wx.playBackgroundAudio()
        this.setData({
            music_index: this.data.data.index
        })
    },
    topause() {//页面暂停
        this.play.pause()
    }
})