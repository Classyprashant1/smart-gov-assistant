// backend/server.js
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Simulated AI Database for Government Schemes & Documents
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
        steps: ["Visit the NSDL or UTIITSL website.", "Fill Form 49A (for Indian citizens).", "Pay the processing fee.", "Send physical documents if e-KYC is not used."],
        alert: "Link your PAN with Aadhar immediately to avoid deactivation."
    },
    "driving": {
        title: "Driving License",
        description: "An official document certifying that the holder is suitably qualified to drive a motor vehicle or vehicles.",
        eligibility: "Must be 18+ for standard vehicles, 16+ for gearless 2-wheelers (with parental consent).",
        checklist: ["Age Proof (Birth certificate, 10th mark sheet)", "Address Proof", "Learner's License", "Passport size photos"],
        steps: ["Apply for a Learner's License online via Parivahan portal.", "Pass the online written test.", "After 30 days, apply for the permanent DL.", "Pass the physical driving test at the RTO."],
        alert: "Check Parivahan portal for updated slot booking timings."
    }
};

app.post('/api/ask', (req, res) => {
    const userMessage = req.body.message.toLowerCase();
    
    // Simple keyword matching for the mock AI
    let responseData = null;
    if (userMessage.includes('aadhar')) responseData = knowledgeBase['aadhar'];
    else if (userMessage.includes('pan')) responseData = knowledgeBase['pan'];
    else if (userMessage.includes('driving') || userMessage.includes('license')) responseData = knowledgeBase['driving'];

    if (responseData) {
        res.json({ success: true, data: responseData });
    } else {
        res.json({ 
            success: false, 
            message: "I couldn't find specific details for that. Try asking about 'Aadhar Card', 'PAN Card', or 'Driving License'." 
        });
    }
});

app.listen(PORT, () => {
    console.log(`Smart Gov Assistant Backend running on http://localhost:${PORT}`);
});