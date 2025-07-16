// // Percent amount cigarette need to reduce in specific time
// const MINIMUM_ADDICTION = 70
// const MID_ADDICTION = 40
// const HIGH_ADDICTION = 15
// const EXTREME_ADDICTION = 10
// // Percent increase in next stage when previous stage have been completed
// const STEP_MINIMUM_ADDICTION = 30
// const STEP_MID_ADDICTION = 20
// const STEP_HIGH_ADDICTION = 15
// const STEP_EXTREME_ADDICTION = 10

// // Rule for use these percent above
// const addictionConfigs = [
//   { min: 0, max: 3, evaluation: MINIMUM_ADDICTION, step: STEP_MINIMUM_ADDICTION },
//   { min: 3, max: 5, evaluation: MID_ADDICTION, step: STEP_MID_ADDICTION },
//   { min: 5, max: 7, evaluation: HIGH_ADDICTION, step: STEP_HIGH_ADDICTION },
//   { min: 7, max: 10.1, evaluation: EXTREME_ADDICTION, step: STEP_EXTREME_ADDICTION }
// ]
// //Algorithm:
// // First week: Amount smoke per date - (smoke per date * (percent reduce)) / 100
// // The next weeks: Amount smoke per date - (smoke per date * (percent reduce + increase percent)) / 100
// // ***(percent reduce + increase percent) <= 100% ***

// const TIME_WEEK = 7*24*60*60*1000
// const calculateCigarettesReductionPerWeek = (smokingPerDate, addictionRate) => {
//   let listObj = new Map()
//   const currentTime = Date.now()
//   let objectStage = {
//     start_time: 0,
//     end_time: 0,
//     expected_result: 0,
//     isCompleted: false
//   }
//   let week = 1
//   let result = 0
//   const config = addictionConfigs.find((addictionConfig) => addictionConfig.min <= addictionRate && addictionRate < addictionConfig.max)
//   if (!config) throw new Error('Invalid addiction rate!')
//   let { evaluation, step } = config

//   //The rest week

//   while (evaluation < 100) {
//     if (listObj.size === 0) {
//       result = Math.floor(smokingPerDate - (smokingPerDate * evaluation) / 100)
//       objectStage.start_time = currentTime
//       objectStage.end_time = currentTime + TIME_WEEK
//       objectStage.expected_result = result
//       listObj.set(week, objectStage)
//     } else {
//       result = Math.floor(smokingPerDate - (smokingPerDate * (evaluation + step)) / 100)
//       const previousWeek = listObj.get(week - 1)
//       const newObj = {
//         start_time: previousWeek.end_time,
//         end_time: previousWeek.end_time + TIME_WEEK,
//         expected_result: result,
//         isCompleted: false
//       }
//       listObj.set(week, newObj)
//     }
//     week+=1
//     evaluation+=step
//   }
//   return Array.from(listObj.values())
// }
// console.log(calculateCigarettesReductionPerWeek(20, 3))

// const data = {
//       name: 'huy',
//       age: 12,
//       stage: [
//             {
//              time: 12,
//              endTime: 13,
//              isComplete: false
//             },
//              {
//              time: 13,
//              endTime: 15,
//              isComplete: false
//             },
//              {
//              time: 15,
//              endTime: 18,
//              isComplete: false
//             }
//       ]
// }
// const time = 12
// const check = data.stage.forEach((item) => {
//       if (item.time == time) {
//             item.isComplete = true
//       }
// })
// console.log(data)