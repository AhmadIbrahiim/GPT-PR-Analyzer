// Define a function to be called from content.js to retrieve a ChatGPT response
// Listen for messages from the content script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log({ request })
  console.log("#".repeat(50))
  if (request.type === "getChatGptResponse") {
    const prompt = request.prompt
    getChatGptResponse(prompt).then((response) => {
      sendResponse(response)
    })
  }

  return true // indicates that sendResponse will be called asynchronously
})
// Define the API endpoint
const API_ENDPOINT = "https://api.openai.com/v1/completions"
let API_KEY = ""
chrome.storage.sync.get(["apiKey"], function (result) {
  console.log("Value currently is " + result.apiKey)
  if (result.apiKey) {
    API_KEY = result.apiKey
  }
})
// Define a function to call the ChatGPT API and retrieve a response
async function getChatGptResponse(prompt) {
  // Define the request parameters
  const params = { model: "text-davinci-003", prompt, temperature: 0.2, max_tokens: 600, top_p: 1, frequency_penalty: 0, presence_penalty: 0, stream: true }
  // Send the API request and wait for the response
  const response = await fetch(API_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(params),
  })

  // Read the stream of responses and append them to a textarea
  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  let text = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) {
      break
    }
    const chunk = decoder.decode(value)

    if (chunk.includes("DONE")) {
      break
    }
    const data = JSON.parse(chunk.split("data: ")[1])
    const choice = data.choices[0]
    const choiceText = choice.text
    text += choiceText
    console.log(text)
  }
  console.log("#".repeat(50))
  console.log({ text })
  return Promise.resolve(text)
}
