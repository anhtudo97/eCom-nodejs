'use strict'

const { NotFoundError, BadRequestError } = require('../core/error.response');
const Comment = require('../models/comment.model');
const { getProductById } = require('../models/repositories/product.repository');
const { convertToObjectIdMongodb } = require("../utils")
/*
    key features: Comment service 
    + add comment [User, Shop]
    + get a list of commnets [User, Shop]
    + delete a comment [user | Shop | Admin]
*/

class CommentService {
    static async createComment({
        productId, userId, content, parentCommentId = null
    }) {
        const product = await getProductById(productId)
        if (!product) {
            throw new BadRequestError("Product is not exited!")
        }

        const comment = new Comment({
            comment_productId: productId,
            comment_parentId: parentCommentId,
            comment_userId: userId,
            comment_content: content,
        })

        let rightValue;

        // update index binary comment
        if (parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) {
                throw new NotFoundError("Parent comment not found")
            }
            rightValue = parentComment.comment_right

            // update many
            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })
        } else {

            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongodb(productId),
            }, 'comment_right', { sort: { comment_right: -1 } })

            if (maxRightValue) {
                rightValue = maxRightValue.right + 1
            } else {
                rightValue = 1
            }
        }

        // insert to comment
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static async getCommentsByParentId(
        {
            productId,
            parentCommentId = null,
            limit = 50,
            offset = 0 // skip
        }
    ) {
        const product = await getProductById(productId)
        if (!product) {
            throw new BadRequestError("Product is not exited!")
        }

        if (parentCommentId) {
            const parentComment = await Comment.findById(parentCommentId)
            if (!parentComment) {
                throw new NotFoundError("Parent comment not found")
            }

            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongodb(productId),
                comment_left: { $gt: parentComment.comment_left },
                comment_right: { $lte: parentComment.comment_right },
            },
                {

                }
            ).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments


        }
        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_parentId: null,
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static async deleteComment({
        commentId,
        productId
    }) {
        const product = await getProductById(productId)
        if (!product) {
            throw new BadRequestError("Product is not exited!")
        }
        const comment = await Comment.findById(commentId)
        if (!comment) {
            throw new NotFoundError("Parent comment not found")
        }

        //1. Xac dinh left right
        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        //2. tinh width
        const width = rightValue - leftValue + 1

        //3. xoa tat ca commentId con
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gte: leftValue },
            comment_right: { $lte: rightValue }
        })

        //4. update left and right value
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: { comment_right: -width }
        })
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongodb(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: { comment_left: -width }
        })
    }
}

module.exports = CommentService