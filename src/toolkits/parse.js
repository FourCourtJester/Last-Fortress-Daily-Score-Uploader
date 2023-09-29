const START = "{\"rankInfo\":"
const END = "}]}"

function _obj({ uid, score, name, abbr, serverId }) {
  return { uid, score, name, abbr, serverId }
}

function _sort(a, b) {
return b.serverId - a.serverId
}

export function parse(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      try {
        // Weekly
        const startW = e.target.result.indexOf(START)
        const endW = e.target.result.indexOf(END, startW)
        const weekly = JSON.parse(e.target.result.substring(startW, endW + END.length + 1))

        // Daily
        const startD = e.target.result.indexOf(START, endW)
        const endD = e.target.result.indexOf(END, startD)
        const daily = JSON.parse(e.target.result.substring(startD, endD + END.length + 1))

        resolve({
          daily: daily?.rankInfo.sort(_sort).map((entry) => _obj(entry)),
          weekly: weekly?.rankInfo.sort(_sort).map((entry) => _obj(entry)),
          })
      } catch (err) {
        reject(err)
      }
    })

    reader.readAsText(file)
  }).catch((err) => {
    console.error(err)
  })
}