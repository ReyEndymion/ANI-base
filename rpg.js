export const rpg = {
emoticon(string) {
string = string.toLowerCase()
let emot = {
level: '🏆',
limit: '💎',
exp: '🕹️'}
let results = Object.keys(emot).map(v => [v, new RegExp(v, 'gi')]).filter(v => v[1].test(string))
if (!results.length) return ''
else return emot[results[0][0]]}
}
