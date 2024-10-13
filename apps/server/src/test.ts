import "dotenv/config"

if (!Bun.env.TEST_BEARER) {
  throw new Error("TEST_BEARER is not defined")
}

const headers = new Headers()

headers.append("Content-Type", "application/json")
headers.append("Authorization", Bun.env.TEST_BEARER)
headers.append("Accept", "*/*")
headers.append("Accept-Language", "en-US,en;q=0.9")
headers.append("Accept-Encoding", "gzip, deflate")
headers.append("Connection", "keep-alive")

const createProject = () => {
  fetch("http://localhost:3000/api/project.create", {
    method: "POST",
    headers,
    body: JSON.stringify({ json: null, meta: { values: ["undefined"] } }),
  })
    .then((res) => res.json())
    .then(console.log)
}

for (let i = 0; i < 10; i++) {
  createProject()
}
