export function scoreDesc(score) {
  if (score >= 85) {
    return '优秀'
  } else if (score >= 75) {
    return '良好'
  } else if (score >= 60) {
    return '一般'
  }
  return '较差'
}
