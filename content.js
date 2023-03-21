function createSummaryButton() {
  const summaryButton = document.createElement("a")
  summaryButton.textContent = "Summarize Changes"

  // set fixed width to button and center text in button
  summaryButton.setAttribute("style", "width: 200px; text-align: center;")
  summaryButton.setAttribute("class", "btn-default btn")

  summaryButton.addEventListener("click", summarizeChanges)

  return summaryButton
}
async function summarizeChanges(e) {
  const diff = Array.from(document.querySelectorAll("#files_bucket .js-code-nav-pass"))
    .map((x) => ({ line: x.textContent, marker: x.getAttribute("data-code-marker") }))
    .filter((x) => x.marker !== " ")
  // Clean up the diff text
  const summary = JSON.stringify(diff)
  const prompt = `As a software engineer writing pull request description, write a good description for this changes:\n\n${summary}\n\n you must start with "## Summary" and use at least ${
    summary.length * 10
  } words \n\n`
  // Send a message to the background script requesting a ChatGPT response
  chrome.runtime.sendMessage({ type: "getChatGptResponse", prompt: prompt }, async function (response) {
    console.log({ response })
    // append the response to github PR description
    const description = document.querySelector("#pull_request_body")
    description.value = response
    // Remove loader from button
    e.target.textContent = "Summarize Changes"
  })

  // Add loader to button till we have the data
  e.target.textContent = "Loading..."
  e.preventDefault()
}
waitForSelector(`[class="BtnGroup width-full width-md-auto d-flex d-md-inline-block"]`, (createButtonContainer) => {
  const summaryButton = createSummaryButton()
  createButtonContainer.appendChild(summaryButton)
})
function waitForSelector(selector, callback) {
  const intervalId = setInterval(() => {
    const element = document.querySelector(selector)
    if (element && element.offsetHeight > 0) {
      clearInterval(intervalId)
      callback(element)
    }
  }, 100) // Check every 100ms
}
