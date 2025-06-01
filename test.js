//https://xzdtrdiwfhqyootwcmaf.supabase.co/storage/v1/object/public/smoking-website-image/blog-image/1748766252729-73868aca-6026-4ae4-81cc-90bfb97d4679.png

const string = '//https://xzdtrdiwfhqyootwcmaf.supabase.co/storage/v1/object/public/smoking-website-image/blog-image/1748766252729-73868aca-6026-4ae4-81cc-90bfb97d4679.png'

const stringBeSplited = string.split('/')
// console.log(stringBeSplited)
/**
 Result:
 [
  '',
  '',
  'https:',
  '',
  'xzdtrdiwfhqyootwcmaf.supabase.co',
  'storage',
  'v1',
  'object',
  'public',
  'smoking-website-image',
  'blog-image',
  '1748766252729-73868aca-6026-4ae4-81cc-90bfb97d4679.png'
]
 */
console.log(stringBeSplited.indexOf('smoking-website-image')) // 9
/**
 const spliceURL = stringBeSplited.splice(stringBeSplited.indexOf('smoking-website-image'))
 Result:
 [
  'smoking-website-image',
  'blog-image',
  '1748766252729-73868aca-6026-4ae4-81cc-90bfb97d4679.png'
]
  ==> Should + 1 to take the next one not the bucket name
 */
const spliceURL = stringBeSplited.splice(stringBeSplited.indexOf('smoking-website-image')+1).join('/')
console.log(spliceURL) // result: blog-image/1748766252729-73868aca-6026-4ae4-81cc-90bfb97d4679.png ==> url need to remove