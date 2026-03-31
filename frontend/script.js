document.addEventListener('DOMContentLoaded', () => {
    const chatWindow = document.getElementById('chat-window');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const exportPdfBtn = document.getElementById('export-pdf-btn');

    // Simulated AI Database for Government Schemes
    const knowledgeBase = {
        "aadhar": {
            title: "Aadhar Card",
            description: "A 12-digit unique identity number obtained by residents of India, based on their biometric and demographic data.",
            eligibility: "Any resident of India (including newborns and minors).",
            checklist: ["Proof of Identity (e.g., Voter ID, Passport)", "Proof of Address (e.g., Utility bill, Bank Statement)", "Date of Birth proof"],
            steps: ["Visit a local Aadhar Enrolment Centre.", "Fill out the enrolment form.", "Submit demographic and biometric data.", "Collect your acknowledgment slip."],
            alert: "Update your Aadhar details every 10 years to keep it active."
        },
        "pan": {
            title: "PAN Card",
            description: "Permanent Account Number is a ten-character alphanumeric identifier, issued by the Indian Income Tax Department.",
            eligibility: "Any Indian citizen, NRI, or foreign national paying taxes in India.",
            checklist: ["Identity Proof (Aadhar, Voter ID)", "Address Proof", "2 recent passport size photographs"],
            steps: ["Visit the NSDL or UTIITSL website.", "Fill Form 49A.", "Pay the processing fee.", "Send physical documents if e-KYC is not used."],
            alert: "Link your PAN with Aadhar immediately to avoid deactivation."
        },
        "driving": {
            title: "Driving License",
            description: "An official document certifying that the holder is suitably qualified to drive a motor vehicle or vehicles.",
            eligibility: "Must be 18+ for standard vehicles, 16+ for gearless 2-wheelers.",
            checklist: ["Age Proof", "Address Proof", "Learner's License", "Passport size photos"],
            steps: ["Apply for Learner's License online via Parivahan portal.", "Pass the online written test.", "After 30 days, apply for the permanent DL.", "Pass the physical driving test."],
            alert: "Check Parivahan portal for updated slot booking timings."
        }
    };

    // Send message on button click or Enter key
    sendBtn.addEventListener('click', handleSend);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    function handleSend() {
        const text = userInput.value.trim().toLowerCase();
        if (!text) return;

        appendMessage(userInput.value, 'user-message');
        userInput.value = '';

        const loadingId = appendLoading();

        // Simulate AI thinking delay (1.5 seconds)
        setTimeout(() => {
            document.getElementById(loadingId).remove();

            let responseData = null;
            if (text.includes('aadhar')) responseData = knowledgeBase['aadhar'];
            else if (text.includes('pan')) responseData = knowledgeBase['pan'];
            else if (text.includes('driving') || text.includes('license')) responseData = knowledgeBase['driving'];

            if (responseData) {
                appendStructuredData(responseData);
            } else {
                appendMessage("I couldn't find specific details for that. Try asking about 'Aadhar Card', 'PAN Card', or 'Driving License'.", 'ai-message');
            }
        }, 1500);
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

        htmlContent += `<div class="info-section"><h4><i class="fa-solid fa-check-double"></i> Eligibility Check</h4><p>${data.eligibility}</p></div>`;
        
        const checklistItems = data.checklist.map(item => `<li>${item}</li>`).join('');
        htmlContent += `<div class="info-section"><h4><i class="fa-solid fa-list-check"></i> Document Checklist</h4><ul>${checklistItems}</ul></div>`;

        const stepsItems = data.steps.map(item => `<li>${item}</li>`).join('');
        htmlContent += `<div class="info-section"><h4><i class="fa-solid fa-shoe-prints"></i> Step-by-Step Guide</h4><ol>${stepsItems}</ol></div>`;

        htmlContent += `<div class="alert-box"><i class="fa-solid fa-triangle-exclamation"></i><div><strong>Scheme Alert:</strong><br>${data.alert}</div></div>`;

        card.innerHTML = htmlContent;
        chatWindow.appendChild(card);
        scrollToBottom();
    }

    function scrollToBottom() {
        chatWindow.scrollTop = chatWindow.scrollHeight;
    }

    // PDF Export Logic
    exportPdfBtn.addEventListener('click', () => {
        const originalText = exportPdfBtn.innerHTML;
        exportPdfBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';

        const opt = {
            margin: 10,
            filename: 'Smart_Gov_Assistant_Chat.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, scrollX: 0, scrollY: 0 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(chatWindow).save().then(() => {
            exportPdfBtn.innerHTML = originalText;
        });
    });
});
