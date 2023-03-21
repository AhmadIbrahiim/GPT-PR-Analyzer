// Get the form element
const form = document.querySelector("form")

// Handle form submission
form.addEventListener("submit", function (e) {
  e.preventDefault()

  // Get the API key value
  const apiKey = document.getElementById("api_key").value

  // Store the API key globally
  chrome.storage.sync.set({ apiKey: apiKey }, function () {
    console.log("API key stored")
  })

  // Close the popup
  window.close()
})
>
