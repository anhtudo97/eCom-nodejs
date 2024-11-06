'use strict'

const { SuccessResponse } = require("../core/success.response")
const { createComment, getCommentsByParentId } = require("../services/comment.service")

class CommentController {
    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: "Create a new comment successfully",
            metadata: await createComment(req.body)
        }).send(res)
    }

    getCommentsByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all comment by parentId",
            metadata: await getCommentsByParentId(req.query)
        }).send(res)
    }
}

module.exports = new CommentController()