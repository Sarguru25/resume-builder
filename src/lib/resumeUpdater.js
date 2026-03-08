export function applyAIAction(resumeData, action) {

  const newData = JSON.parse(JSON.stringify(resumeData))

  if (action.action === "update") {

    const keys = action.path.split(".")

    let obj = newData

    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]]
    }

    obj[keys[keys.length - 1]] = action.content
  }

  if (action.action === "add") {

    if (!newData[action.section]) {
      newData[action.section] = []
    }

    newData[action.section].push(action.content)
  }

  if (action.action === "remove") {

    const keys = action.path.split(".")

    let obj = newData

    for (let i = 0; i < keys.length - 1; i++) {
      obj = obj[keys[i]]
    }

    delete obj[keys[keys.length - 1]]
  }

  return newData
}