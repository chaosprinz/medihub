const { exec, spawn } = require('child_process')

let ents = [
  {
    id: 0,
    cwd: './backend',
    process: null,
    name: 'Backend'
  },
  {
    id: 1,
    cwd: './frontend',
    process: null,
    name: 'Frontend'
  }
]

for (let ent of ents) {
  ent.process = exec('npm run dev', {cwd: ent.cwd}, (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      return
    }
    console.log(stdout)
    console.error(stderr)
  })
  ent.process.stdout.on('data', (data) => {
    console.log(`${ent.name}: ${data}`)
  })
  ent.process.stderr.on('data', (data) => {
    console.error(`${ent.name}: ${data}`)
  })
}
