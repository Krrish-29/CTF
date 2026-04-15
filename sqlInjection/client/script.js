document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');
    const submitBtn = document.querySelector('button');

    const API_URL = 'http://127.0.0.1:4000/api/login';
    messageEl.className = 'hidden';
    messageEl.textContent = '';
    submitBtn.textContent = 'Authenticating...';
    submitBtn.style.opacity = '0.7';

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        setTimeout(() => {
            messageEl.classList.remove('hidden');
            
            if (data.success) {
                messageEl.className = 'success';
                messageEl.innerHTML = `>> AUTHENTICATION SUCCESSFUL<br><br>Welcome ${data.user}!<br>FLAG: <strong>${data.flag}</strong>`;
            } else {
                messageEl.className = 'error';
                messageEl.innerHTML = `>> AUTHENTICATION FAILED<br><br>${data.message}`;
            }
            
            submitBtn.textContent = 'Login';
            submitBtn.style.opacity = '1';
        }, 600);

    } catch (err) {
        console.error(err);
        messageEl.classList.remove('hidden');
        messageEl.className = 'error';
        messageEl.innerHTML = '>> SERVER CONNECTION FAILED<br><br>Make sure the backend is running.';
        
        submitBtn.textContent = 'Login';
        submitBtn.style.opacity = '1';
    }
});
