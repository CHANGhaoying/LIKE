import { HTTP } from '../../utils/http.js'
let http = new HTTP()

// components/top/top.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        count:{
            type: Number,

        },
        status:{
            type:Number,
            
        },
        num:{
            type: String,
            value: ""
        },
        year:{
            type: String,
        },
        month:{
            type: String,
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        //flag: status ? false : true 
    },

    

    /**
     * 组件的方法列表
     */
    methods: {
        like() {
            let count = this.properties.count
            let status = this.properties.status
            this.setData({
                count: status ? count - 1 : count + 1,
                status: status ? 0 : 1,
            })
            // http.request({
            //     url: '/like',
            //     method: "POST",
            //     data: {
            //         art_id: "1",
            //         type: "300"
            //     },
            //     success(res) {
            //         console.log(res)
            //     }
            // })
        }
    },
    })
