import { env } from '@/config/environment'
import { blogModel } from '@/models/blogModel'
import { supabaseMethod } from '@/providers/supabase'
import ApiError from '@/utils/ApiError'
import { NAME_FOLDER_SUPABASE } from '@/utils/constants'
import { StatusCodes } from 'http-status-codes'
const createBlogService = async (user_id, data, files ) => {
  try {
    const imageURLList = await supabaseMethod.uploadFile(files, NAME_FOLDER_SUPABASE.blog, user_id)
    const formData = {
      ...data,
      user_id: user_id,
      image_url: imageURLList
    }
    const result = await blogModel.createBlog(user_id, formData)
    const dataCreated = await blogModel.findBlogById(result.insertedId)
    return dataCreated
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getBlogsPaginationService = async (limit, page, sort) => {
  try {
    const result = await blogModel.getBlogsPagination(limit, page, sort)
    const totalBlogs = await blogModel.totalBlogs()
    const totalPages = Math.ceil(totalBlogs / limit)
    const data = {
      result,
      totalPages
    }
    return data
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getBlogsPrivatePaginationService = async (userId, limit, page, sort) => {
  try {
    const result = await blogModel.getPrivateBlogsPagination(userId, limit, page, sort)
    const totalBlogs = await blogModel.totalBlogsOfUser(userId)
    const totalPages = Math.ceil(totalBlogs / limit)
    const data = {
      result,
      totalPages
    }
    return data
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const updateBlogService= async (userId, blogId, reqBody, files) => {
  try {
    const { title, content } = reqBody
    const keep_images = JSON.parse(reqBody.keep_images|| '[]')
    const blog = await blogModel.findBlogById(blogId)
    if (!blog) throw new Error('Blog is not existed')

    const oldImages = blog.image_url || []
    const imageURLToRemove = oldImages.filter(image => !keep_images.includes(image))

    const pathToRemove = imageURLToRemove.map(url => {
      const parts = url.split('/')
      return parts.slice(parts.indexOf(env.SUPABASE_BUCKET_NAME)+1).join('/')
    })

    if (pathToRemove.length > 0) {
      await supabaseMethod.deleteFile(pathToRemove)
    }

    const newURL = await supabaseMethod.uploadFile(files, NAME_FOLDER_SUPABASE.blog, userId)
    const updateImages = [...keep_images, ...newURL]
    const finalData = {
      title,
      content,
      image_url: updateImages,
      update_date: Date.now()
    }
    await blogModel.updateBlog(userId, blogId, finalData)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const deleteBlogService = async (userId, blogId) => {
  try {
    const isBlogExisted = await blogModel.findBlogById(blogId)
    if (!isBlogExisted) throw new Error('Blog is not existed!')
    await blogModel.deleteBlog(userId, blogId)
    return
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}

const getBlogDetailService = async (blogId) => {
  try {
    const blog = await blogModel.findBlogById(blogId)
    if (!blog) throw new Error('This blog is not existed')
    const result = await blogModel.getBlogDetail(blogId)
    return result
  } catch (error) {
    throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
  }
}
export const blogService = {
  createBlogService,
  getBlogsPaginationService,
  getBlogsPrivatePaginationService,
  updateBlogService,
  deleteBlogService,
  getBlogDetailService
}