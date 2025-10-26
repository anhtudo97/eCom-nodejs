'use strict';

const { template } = require("../models/template.model");
const { emailVerificationTemplate } = require("../utils/tem.html");

const newTemplateEmail = async ({
    tem_name,
    tem_html
}) => {
    // Implementation for creating a new email template

    // 1. check if template exists in dbs

    // 2. if exists, throw error

    // 3. create new template
    const newTemplate = await template.create({
        tem_name,
        tem_html: emailVerificationTemplate({ tem_name }),
    });
    return newTemplate;
}

const getTemplateEmail = async ({
    tem_name
}) => {
    // Implementation for retrieving the email template
    const template = await newTemplateEmail({
        tem_name,
    });
    return template;
}

module.exports = {
    newTemplateEmail,
    getTemplateEmail
};