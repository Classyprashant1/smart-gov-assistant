// frontend/script.js
document.addEventListener('DOMContentLoaded', () => {
    // --- Add these new lines right below your other variables ---
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    // PDF Export Logic
    exportPdfBtn.addEventListener('click', () => {
        // Change button text briefly to show it's working
        const originalText = exportPdfBtn.innerHTML;
        exportPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Generating...';

        // Set PDF Options
        const opt = {
            margin:       10,
            filename:     'Smart_Gov_Assistant_Chat.pdf',
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { scale: 2, scrollX: 0, scrollY: 0 }, // Scale 2 makes it high-res
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generate the PDF from the chat window content
        html2pdf().set(opt).from(chatWindow).save().then(() => {
            // Restore original button text after download starts
            exportPdfBtn.innerHTML = originalText;
        });
    });
    // --- End of new lines ---
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');

    // Send message on button click
    sendBtn.addEventListener('click', handleSend);

    // Send message on Enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    });

    async function handleSend() {
        const text = userInput.value.trim();
        if (!text) return;

        // 1. Add User Message to UI
        appendMessage(text, 'user-message');
        userInput.value = '';

        // 2. Add Loading Indicator
        const loadingId = appendLoading();

        try {
            // 3. Fetch from Backend
            const response = await fetch('http://localhost:3000/api/ask', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });
            const data = await response.json();

            // 4. Remove Loading Indicator
            document.getElementById(loadingId).remove();

            // 5. Display AI Response
            if (data.success) {
                appendStructuredData(data.data);
            } else {
                appendMessage(data.message, 'ai-message');
            }
        } catch (error) {
            document.getElementById(loadingId).remove();
            appendMessage("Error connecting to the server. Is the backend running?", 'ai-message');
        }
    }

    function appendMessage(text, className) {
        const div = document.createElement('div');
        div.className = `message ${className} pop-in`;
        div.innerHTML = `<p>${text}</p>`;
        chatWindow.appendChild(div);
        scrollToBottom();
    }

    function appendLoading() {
        const id = 'loading-' + Date.now();
        const div = document.createElement('div');
        div.id = id;
        div.className = `message ai-message pop-in`;
        div.innerHTML = `<p><i class="fa-solid fa-spinner fa-spin"></i> Analyzing government databases...</p>`;
        chatWindow.appendChild(div);
        scrollToBottom();
        return id;
    }

    function appendStructuredData(data) {
        const card = document.createElement('div');
        card.className = 'info-card pop-in';
        
        let htmlContent = `<h3>${data.title}</h3>`;
        htmlContent += `<p style="margin-bottom: 15px;">${data.description}</p>`;

        // Eligibility Feature
        htmlContent += `
            <div class="info-section">
                <h4><i class="fa-solid fa-check-double"></i> Eligibility Check</h4>
                <p>${data.eligibility}</p>
            </div>
        `;

        // Document Checklist Feature
        const checklistItems = data.checklist.map(item => `<li>${item}</li>`).join('');
        htmlContent += `
            <div class="info-section">
                <h4><i class="fa-solid fa-list-check"></i> Document Checklist</h4>
                <ul>${checklistItems}</ul>
            </div>
        `;

        // Step by Step Guide Feature
        const stepsItems = data.steps.map(item => `<li>${item}</li>`).join('');
        htmlContent += `
            <div class="info-section">
                <h4><i class="fa-solid fa-shoe-prints"></i> Step-by-Step Guide</h4>
                <ol>${stepsItems}</ol>
            </div>
        `;

        // Scheme Alerts Feature
        htmlContent += `
            <div class="alert-box">
                <i class="fa-solid fa-triangle-exclamation" style="font-size: 1.5rem;"></i>
                <div>
                    <strong>Scheme Alert:</strong><br>
                    ${data.alert}
                </div>
            </div>
        `;

        card.innerHTML = htmlContent;
        chatWindow.appendChild(card);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }
});