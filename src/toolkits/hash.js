export function stringify(opts) {
  return opts.reduce((arr, opt) => {
    if (opt.current.checked) arr.push(`${opt.current.name}=${opt.current.checked}`)
    return arr
  }, []).join('&')
}

export function parse(str) {
 return str.slice(1)
}