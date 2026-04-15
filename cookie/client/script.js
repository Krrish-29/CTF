document.addEventListener("DOMContentLoaded", () => {
    const terminalOutput = document.getElementById('terminal-output');
    const checkBtn = document.getElementById('check-flag-btn');
    const btnText = checkBtn.querySelector('.btn-text');
    const loader = checkBtn.querySelector('.loader');
    const statusBadge = document.getElementById('status-badge');

    const API_URL = 'http://127.0.0.1:4000/api';

    const addLog = (message, className = "sys-msg") => {
        const p = document.createElement('p');
        p.className = className;
        p.textContent = message;
        terminalOutput.appendChild(p);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const addLogHTML = (html, className = "sys-msg") => {
        const div = document.createElement('div');
        div.className = className;
        div.innerHTML = html;
        terminalOutput.appendChild(div);
        terminalOutput.scrollTop = terminalOutput.scrollHeight;
    };

    const initializeChallenge = async () => {
        try {
            const res = await fetch(`${API_URL}/init`, {
                credentials: 'include' 
            });
            const data = await res.json();
            
            setTimeout(() => {
                addLog("> " + data.message, "sys-msg");
            }, 1000);
            
            setTimeout(() => {
                addLog("> Warning: Default permissions applied.", "auth-false");
            }, 1500);

        } catch (err) {
            console.error(err);
            addLog("> ERROR: Could not connect to API server.", "auth-false");
        }
    };

    checkBtn.addEventListener('click', async () => {
        btnText.textContent = "Verifying...";
        loader.style.display = "inline-block";
        checkBtn.disabled = true;

        addLog("> Validating credentials...", "sys-msg");

        try {
            const res = await fetch(`${API_URL}/flag`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await res.json();

            setTimeout(() => {
                if (data.success) {
                    addLog("> Validation successful. Admin token verified.", "auth-true");
                    
                    addLogHTML(`<div class="flag-container">${data.flag}</div>`, "auth-true");
                    
                    statusBadge.classList.add('admin-status');
                    statusBadge.querySelector('.status-text').textContent = 'ADMIN';
                } else {
                    addLog(`> Access Denied: ${data.message}`, "auth-false");
                }

                btnText.textContent = "Check Authorization";
                loader.style.display = "none";
                checkBtn.disabled = false;
            }, 1000);

        } catch (err) {
            console.error(err);
            addLog("> Server Error: Unauthorized or connection failed.", "auth-false");
            
            btnText.textContent = "Check Authorization";
            loader.style.display = "none";
            checkBtn.disabled = false;
        }
    });

    initializeChallenge();
});
