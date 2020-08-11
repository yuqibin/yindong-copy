class BaseModel {
  constructor(message, data) {
    if (typeof message !== 'string') {
      message = '未定义反馈内容'
    }
    this.message = message
    this.data = data
  }
}

class SuccessModel extends BaseModel {
  constructor(message, data) {
    super(message, data)
    this.code = 0
  }
}

class ErrorModel extends BaseModel {
  constructor(message, data) {
    super(message, data)
    this.code = -1
  }
}

module.exports = {
  SuccessModel,
  ErrorModel
}