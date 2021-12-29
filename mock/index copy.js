import mockjs from 'mockjs'
import { parse } from 'url'

const getPosts = async (req, res) => {
  const dataSource = mockjs.mock({
    'list|10': [
      {
        'userId|1-1000': 1,
        'id|+1': 1,
        'title|+1': [mockjs.Random.ctitle(), mockjs.Random.ctitle(), mockjs.Random.ctitle()],
        'body|+1': [
          mockjs.Random.cparagraph(),
          mockjs.Random.cparagraph(),
          mockjs.Random.cparagraph(),
        ],
      },
    ],
  })

  const url = req.url

  const params = parse(url, true).query

  let pageSize = 10

  if (params.pageSize) {
    pageSize = params.pageSize * 1
  }

  const result = {
    code: 0,
    msg: '请求成功',
    data: {
      ...dataSource,
      pagination: {
        total: 100,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    },
  }

  await new Promise((resolve) => {
    req.on('data', (chunk) => {
      reqbody += chunk
    })
    req.on('end', () => resolve(undefined))
  })

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200

  res.end(JSON.stringify(result))
}

const getPostsById = () => {
  const result = {
    'userId|1-1000': 1,
    'id|+1': 1,
    title: mockjs.Random.ctitle(),
    body: mockjs.Random.cparagraph(),
  }

  return result
}

const getComments = async (req, res) => {
  const dataSource = mockjs.mock({
    'list|100': [
      {
        'postId|1-1000': 1,
        'id|+1': 1,
        name: mockjs.Random.ctitle(),
        email: mockjs.Random.email(),
        body: mockjs.Random.cparagraph(),
      },
    ],
  })

  const url = req.url

  const params = parse(url, true).query

  let pageSize = 10
  if (params.pageSize) {
    pageSize = params.pageSize * 1
  }

  const result = {
    code: 0,
    msg: '请求成功',
    data: {
      ...dataSource,
      pagination: {
        total: dataSource.length,
        pageSize,
        current: parseInt(params.currentPage, 10) || 1,
      },
    },
  }

  await new Promise((resolve) => {
    req.on('data', (chunk) => {
      reqbody += chunk
    })
    req.on('end', () => resolve(undefined))
  })

  res.setHeader('Content-Type', 'application/json')
  res.statusCode = 200

  res.end(JSON.stringify(result))
}

const getCommentsById = () => {
  const result = {
    'postId|1-1000': 1,
    'id|+1': 1,
    name: mockjs.Random.title(),
    email: mockjs.Random.email(),
    body: mockjs.Random.cparagraph(),
  }

  return result
}

export default [
  {
    url: '/api/int',
    method: 'get',
    rawResponse: async (req, res) => {
      await getPosts(req, res)
    },
  },
  {
    url: '/api/posts/:id',
    method: 'get',
    response: () => {
      return getPostsById()
    },
  },
  {
    url: '/posts/:id/comments',
    method: 'get',
    response: () => {
      return getCommentsById()
    },
  },
  {
    url: '/api/comments',
    method: 'get',
    rawResponse: async (req, res) => {
      await getComments(req, res)
    },
  },
  {
    url: '/api/posts',
    method: 'post',
    response: () => {
      return {
        code: 0,
        msg: '请求成功',
        data: {},
      }
    },
  },
  {
    url: '/api/posts',
    method: 'put',
    response: () => {
      return {
        code: 0,
        msg: '请求成功',
        data: {},
      }
    },
  },
  {
    url: '/api/posts',
    method: 'patch',
    response: () => {
      return {
        code: 0,
        msg: '请求成功',
        data: {},
      }
    },
  },
  {
    url: '/api/posts',
    method: 'delete',
    response: () => {
      return {
        code: 0,
        msg: '请求成功',
        data: {},
      }
    },
  },
]
