const getBaseTemplate = (categoryConfig, ticketData, studentName) => {
    const { color, iconLabel, nodeStatus } = categoryConfig;
    
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .email-container { max-width: 650px; margin: 0 auto; font-family: 'Segoe UI', system-ui, -apple-system, sans-serif; background-color: #fcfcfc; border: 1px solid #eef2f6; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px -10px rgba(0,0,0,0.05); }
                .header { background: linear-gradient(135deg, ${color} 0%, #1e293b 100%); padding: 60px 40px; text-align: center; color: white; position: relative; }
                .header h1 { margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.02em; }
                .header p { margin: 10px 0 0; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em; opacity: 0.9; }
                .content { padding: 40px; background-color: white; }
                .metadata-card { background-color: #f8fbff; border: 1px solid #e1e9f4; border-radius: 16px; padding: 25px; margin-bottom: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
                .metadata-item { border-bottom: 1px solid #edf2f9; padding-bottom: 10px; }
                .metadata-label { font-size: 9px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 4px; }
                .metadata-value { font-size: 13px; font-weight: 700; color: #1e293b; }
                .inquiry-block { margin-top: 30px; }
                .subject-badge { display: inline-block; background-color: #eff6ff; color: ${color}; padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 15px; border: 1px solid #dbeafe; }
                .description-box { background-color: #ffffff; border-left: 4px solid ${color}; padding: 20px 25px; border-radius: 0 12px 12px 0; font-style: italic; color: #475569; font-size: 14px; line-height: 1.6; background-image: linear-gradient(to bottom right, #fcfcfc, #ffffff); box-shadow: inset 0 0 10px rgba(0,0,0,0.01); }
                .footer { text-align: center; padding: 30px 40px; background-color: #f8fafc; border-top: 1px solid #edf2f7; }
                .footer p { margin: 5px 0; font-size: 11px; color: #64748b; font-weight: 600; }
                .footer .brand { font-weight: 900; color: #1e3a8a; font-size: 12px; margin-bottom: 10px; }
            </style>
        </head>
        <body>
            <div class="email-container">
                <div class="header">
                    <h1>UNIHELP PORTAL</h1>
                    <p>${iconLabel}</p>
                </div>
                
                    <div class="content">
                    <div class="metadata-card">
                        <div class="metadata-item" style="grid-column: span 2;">
                            <span class="metadata-label">Student Name</span>
                            <span class="metadata-value" style="font-size: 16px;">${studentName}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="metadata-label">Reference ID</span>
                            <span class="metadata-value">TKT-${ticketData.id.toString().padStart(4, '0')}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="metadata-label">Current Status</span>
                            <span class="metadata-value" style="color: ${color};">${nodeStatus}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="metadata-label">Inquiry Category</span>
                            <span class="metadata-value">${ticketData.category}</span>
                        </div>
                        <div class="metadata-item">
                            <span class="metadata-label">Contact Number</span>
                            <span class="metadata-value" style="font-family: monospace;">${ticketData.contact_number || 'Not Provided'}</span>
                        </div>
                    </div>

                    <div class="inquiry-block">
                        <span class="subject-badge">Inquiry Details</span>
                        <h2 style="font-size: 18px; font-weight: 800; color: #0f172a; margin: 0 0 15px;">${ticketData.subject}</h2>
                        <div class="description-box">
                            "${ticketData.description}"
                        </div>
                    </div>
                </div>
                
                <div class="footer">
                    <div class="brand">UniHelp Automated Response Protocol</div>
                    <p>Priority Academic Support Communication Infrastructure</p>
                    <p>&copy; 2026 UniHelp Infrastructure Node. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const templates = {
    'Technical Support': (ticketData, studentName) => getBaseTemplate({
        color: '#2563eb', // Blue
        iconLabel: 'TECHNICAL SUPPORT ANALYSIS',
        nodeStatus: 'PENDING REVIEW'
    }, ticketData, studentName),

    'Academic Assistance': (ticketData, studentName) => getBaseTemplate({
        color: '#4f46e5', // Indigo
        iconLabel: 'ACADEMIC ASSISTANCE NOTIFICATION',
        nodeStatus: 'FACULTY REVIEW PENDING'
    }, ticketData, studentName),

    'Examination & Results': (ticketData, studentName) => getBaseTemplate({
        color: '#d97706', // Amber
        iconLabel: 'EXAMINATION INQUIRY AUDIT',
        nodeStatus: 'RECORDS REVIEW PENDING'
    }, ticketData, studentName),

    'System Access (Login)': (ticketData, studentName) => getBaseTemplate({
        color: '#e11d48', // Rose
        iconLabel: 'SYSTEM ACCESS INQUIRY',
        nodeStatus: 'URGENT REVIEW'
    }, ticketData, studentName),

    'default': (ticketData, studentName) => getBaseTemplate({
        color: '#1e293b', // Slate
        iconLabel: 'GENERAL SUPPORT INQUIRY',
        nodeStatus: 'ADMINISTRATIVE REVIEW'
    }, ticketData, studentName)
};

module.exports = {
    generateInquiryTemplate: (category, ticketData, studentName) => {
        const generator = templates[category] || templates['default'];
        return generator(ticketData, studentName);
    }
};
