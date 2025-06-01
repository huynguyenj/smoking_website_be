
const successJsonMessage = (success, message, data) => {
  return {
    success: success,
    message: message,
    data: data
  }
}

const paginationReturn = (data, limit, page, totalPage) => {
  return {
    listData: data,
    pageInfo: {
      limit: limit,
      page: page,
      totalPage: totalPage
    }
  }
}

export const jsonForm = {
  successJsonMessage,
  paginationReturn
}