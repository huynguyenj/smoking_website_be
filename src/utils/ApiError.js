//Tạo class và custome lại Error bằng cách kế thừa lại phương thức của class Error và tạo thêm thuộc tính ta muốn
export default class ApiError extends Error {
//Goị hàm khỏi tạo của class Error(class cha) để dùng this trỏ vào phương thức có class Error 
//Vì class Error đã có sẵn thuộc tính name, message, stack mà ta chỉ cần dùng message để custome lại đúng ý nên ta chỉ cần super(message) là đủ
  constructor(statusCode, message) {
    super(message)
    //Tên mặc định của message của Error khi ném ra là Error nên ta đặt lại tên cho nó
    this.name = 'ApiError'
    //Như ta thấy ở trên ta chỉ kế thừa message trong class Error thôi mà trong class Error đã có sẵn thuộc tính name, stack, message thôi nên muốn thêm thuộc tính khác thì ta phải tự tạo ra bằng cách gán nó vào this
    //Vì ta đã có sẵn thuộc tính name, message, stack trong class Error rồi nên ta chỉ cần tạo thêm thuộc tính statusCode thôi
    this.statusCode = statusCode
    Error.captureStackTrace(this, this.constructor)
  }
}