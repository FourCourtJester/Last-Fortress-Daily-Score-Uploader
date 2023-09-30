// Import Assets
import fields from 'fields.json'

function _sort(a, b) {
  return b.serverId - a.serverId
}

function _obj(obj, keys) {
  return keys.reduce((_obj, key) => (_obj[key]=obj[key], _obj), {})
}

function _parseDonations(file, cursor) {
  const START = "<al.donate.record> |</color> {\"record\":"
  const END = "]}"
  const start = file.indexOf(START, cursor)

  if (cursor === -1 || start === -1) return []

  const end = file.indexOf(END, start)
  const results = JSON.parse(file.substring(start + 29, end + END.length + 1))

  return Object.freeze(results.record.map((entry => _obj(entry, fields.donationsRaw))).concat(_parseDonations(file, end)))
}

function _parseMembers(file) {
  const START = "{\"allianceOffical\":"
  const END = "}}"
  const start = file.indexOf(START)

  if (start === -1) return { results: [] }

  const end = file.indexOf(END, start)
  const results = JSON.parse(file.substring(start, end + END.length + 1))

  return Object.freeze(results.list.map((entry) => _obj(entry, fields.members)))
}

function _parseScore(file, cursor, report) {
  const START = "{\"rankInfo\":"
  const END = "}]}"
  const start = file.indexOf(START, cursor)

  if (cursor === -1 || start === -1) return { cursor: -1, results: [] }

  const end = file.indexOf(END, start)
  const results = JSON.parse(file.substring(start, end + END.length + 1))

  return {
    cursor: end,
    results: Object.freeze(results.rankInfo.sort(_sort).map((entry) => _obj(entry, fields[report])))
  }
}

function _remixDonations(donations) {
  const results = donations.reduce((obj, entry) => {
    if (!obj[entry.uid]) obj[entry.uid] = {
      donations: [],
      name: entry.username,
      uid: entry.uid,
    }

    obj[entry.uid].donations.push(_obj(entry, ['type', 'time']))
    return obj
  }, {})

  return Object.values(results).sort((a, b) => b.donations.length - a.donations.length)
}

function _remixScore(daily, weekly) {
  const results = daily.results.reduce((obj, entry) => ({ ...obj, [entry.uid]: entry }), {})

  weekly.results.forEach((entry) => {
    results[entry.uid].daily = results[entry.uid].score
    results[entry.uid].weekly = entry.score
  })

  return Object.values(results).sort(_sort)
}

export function parse(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.addEventListener('load', (e) => {
      try {
        const weekly = _parseScore(e.target.result, 0, 'weekly')
        const daily = _parseScore(e.target.result, weekly.cursor, 'daily')
        const members = _parseMembers(e.target.result)
        const donations = _remixDonations(_parseDonations(e.target.result, 0))
        const score = _remixScore(Object.create(daily), Object.create(weekly))

        console.log(donations)

        resolve({
          daily: daily.results,
          weekly: weekly.results,
          score,
          donations,
          members,
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