const chatBox = document.getElementById("chatBox");

function addMessage(text, sender) {
  const div = document.createElement("div");
  div.className = sender;
  div.innerText = text;
  chatBox.appendChild(div);

  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🚀 SEND MESSAGE
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;

  if (!message) return;

  addMessage(message, "user");
  input.value = "";

  addMessage("Typing...", "ai");

  try {
    const response = await fetch("http://localhost:5000/api/triage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
    });

    const data = await response.json();

    // remove "Typing..."
    chatBox.lastChild.remove();

    addMessage(data.reply, "ai");

  } catch (error) {
    chatBox.lastChild.remove();
    addMessage("Server error", "ai");
  }
}

// 🚀 SHARE CHAT
function shareChat() {
  const text = chatBox.innerText;

  if (navigator.share) {
    navigator.share({
      title: "Health Chat",
      text: text,
    });
  } else {
    alert("Sharing not supported on this browser");
  }
}
