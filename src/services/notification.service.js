'use strict'

const { noti } = require("../models/Notification.model")

const pushNotiToSystem = async ({
    type = 'SHOP-001',
    recivedId = 1,
    senderId = 1,
    options = {}
}) => {
    let noti_content

    if (type === "SHOP-001") {
        noti_content = `@@@ vừa mới thêm 1 sản phẩm: @@@`
    } else if (type === "PROMOTION-001") {
        noti_content = `@@@ vừa mới thêm 1 voucher: @@@`
    }

    const newNoti = await noti.create({
        noti_type: type,
        noti_content,
        noti_senderId: senderId,
        noti_recivedId: recivedId,
        noti_options: options
    })

    return newNoti;
}

const listNotifitcationByUser = async ({
    userId = "1",
    type = 'All',
    isRead = 0
}) => {
    const match = {
        noti_recivedId: userId
    }

    if (type !== 'All') {
        match['noti_type'] = type
    }

    return await noti.aggregate([
        {
            $match: match
        },
        {
            $project: {
                noti_type: 1,
                noti_senderId: 1,
                noti_recivedId: 1,
                noti_content: 1,
                noti_options: {
                    $concat: [
                        {
                            $substr: ['$noti_options.shop_name', 0, -1]
                        },
                        ' vừa mới thêm một sản phẩm mới: ', // lang,
                        {
                            $substr: ['$noti_options.product_name', 0, -1]
                        },

                    ]
                },
                createAt: 1,
            }
        }
    ])
}

module.exports = {
    pushNotiToSystem,
    listNotifitcationByUser
}