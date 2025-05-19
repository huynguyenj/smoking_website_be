
//algorithm: make value of other property to be the key of other value of other property in an object
//In this case will be: message: 'Full name min 4 characters' and path: 'full_name'
// We will make that be this: {full_name: 'Full name min 4 characters'}
export const errorForm = (errors) => {
  let listError = []
  for ( let i in errors ) {
    let errorObj = {}
    //Create a key reference
    const key = errors[i].path
    //Make the key has been create to be a key of errorObj with value error[i].message
    errorObj[key] = errors[i].message
    listError.push(errorObj)
  }
  return listError
}