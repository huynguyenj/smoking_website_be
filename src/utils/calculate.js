const MINIMUM_ADDICTION = 70
const MID_ADDICTION = 40
const HIGH_ADDICTION = 15
const EXTREME_ADDICTION = 10

const STEP_MINIMUM_ADDICTION = 30
const STEP_MID_ADDICTION = 20
const STEP_HIGH_ADDICTION = 15
const STEP_EXTREME_ADDICTION = 10

const addictionConfigs = [
  { min: 0, max: 3, evaluation: MINIMUM_ADDICTION, step: STEP_MINIMUM_ADDICTION },
  { min: 3, max: 5, evaluation: MID_ADDICTION, step: STEP_MID_ADDICTION },
  { min: 5, max: 7, evaluation: HIGH_ADDICTION, step: STEP_HIGH_ADDICTION },
  { min: 7, max: 10.1, evaluation: EXTREME_ADDICTION, step: STEP_EXTREME_ADDICTION }
]

const calculateCigarettesReductionPerWeek = (smokingPerDate, addictionRate) => {
  let listWeek = new Map()
  let week = 1

  const config = addictionConfigs.find((crf) => crf.min <= addictionRate && addictionRate < crf.max)
  if (!config) throw new Error('Invalid addiction rate!')
  let { evaluation, step } = config
  let result = Math.floor(smokingPerDate - (smokingPerDate * evaluation) / 100)
  listWeek.set(week, result) // first week

  //The rest week
  while (evaluation < 100) {
    week+=1
    result = Math.floor(smokingPerDate - (smokingPerDate * (evaluation + step)) / 100)
    listWeek.set(week, result < 0 ? 0 : result)
    evaluation+= step
  }
  const listAdvice = [...listWeek]
  return listAdvice.map(([key, value]) => `Week ${key} reduce to ${value} cigarettes per day`)

}

export const calculate = {
  calculateCigarettesReductionPerWeek
}