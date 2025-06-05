const id2 = '6837cf908bb68e5cd823c88c'
const id1 = '68332a972b50cdc4c01b37d5'
const a = id1.replace(/[a-z]/g, '')
const b = id2.replace(/[a-z]/g, '')

function generateRoomId(id1, id2) {
  return [id1, id2].sort().join('_')
}
console.log(generateRoomId(id1, id2))

console.log(generateRoomId(id2, id1))