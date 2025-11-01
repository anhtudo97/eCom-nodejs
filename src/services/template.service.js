'use strict';

const { template } = require("../models/template.model");
const { emailVerificationTemplate } = require("../utils/tem.html");

const newTemplateEmail = async ({
    tem_name,
    tem_id
}) => {
    // Implementation for creating a new email template

    // 1. check if template exists in dbs

    // 2. if exists, throw error

    // 3. create new template
    const newTemplate = await template.create({
        tem_id,
        tem_name,
        tem_html: emailVerificationTemplate({ tem_name }),
    });
    return newTemplate;
}

const getTemplateEmail = async ({
    tem_name,
    tem_id
}) => {
    // Implementation for retrieving the email template
    const template = await newTemplateEmail({
        tem_name,
        tem_id
    });
    return template;
}

module.exports = {
    newTemplateEmail,
    getTemplateEmail
};