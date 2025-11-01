'use strict'

const { SuccessResponse } = require("../core/success.response");
const { newTemplateEmail } = require("../services/template.service");

class EmailController {
    // Controller methods for email-related operations can be added here

    newTemplate = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create new template email successfully',
            metadata: await newTemplateEmail({
                tem_id: req.body.tem_id,
                tem_name: req.body.tem_name,
            })
        }).send(res);
    }
}

module.exports = new EmailController();