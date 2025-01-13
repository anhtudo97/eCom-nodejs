'use strict'

const { SuccessResponse } = require("../core/success.response")
const { listNotifitcationByUser } = require("../services/notification.service")


class NotificationController {
    getNotificationByUser = async (req, res, next) => {
        new SuccessResponse({
            message: "Get notifications successfully",
            metadata: await listNotifitcationByUser(req.body)
        }).send(res)
    }
}

module.exports = new NotificationController()