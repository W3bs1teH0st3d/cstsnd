document.addEventListener('DOMContentLoaded', () => {
    const createBtn = document.getElementById('create-btn');
    const themeToggle = document.getElementById('theme-toggle');
    const resultDiv = document.getElementById('result');

    // Переключение темы
    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        document.body.classList.toggle('dark-theme');
        themeToggle.textContent = document.body.classList.contains('dark-theme') ? 'Светлая тема' : 'Темная тема';
    });

    // Создание SoundTag
    createBtn.addEventListener('click', async () => {
        const title = document.getElementById('title').value.trim() || 'Default';
        const text = document.getElementById('text').value.trim() || 'Нажми на кнопку!';
        const imageUrl = document.getElementById('image-url').value || 'https://via.placeholder.com/120';
        const soundUrl = document.getElementById('sound-url').value || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';
        const background = document.getElementById('background').value;

        try {
            const response = await fetch('/.netlify/functions/create-soundtag', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, text, imageUrl, soundUrl, background })
            });

            if (!response.ok) throw new Error('Ошибка создания SoundTag');
            const { sndtagid } = await response.json();
            const uniqueUrl = `${window.location.origin}/?sndtagid=${sndtagid}`;

            resultDiv.innerHTML = `
                <h2>SNTAG > ${title}</h2>
                <p>${text}</p>
                <button class="soundtag-button" style="background-image: url('${imageUrl}');" onclick="new Audio('${soundUrl}').play()"></button>
                <p>Ссылка: <a href="${uniqueUrl}" target="_blank">${uniqueUrl}</a></p>
            `;
            resultDiv.style.backgroundColor = background;
        } catch (error) {
            resultDiv.innerHTML = `<p>Ошибка: ${error.message}</p>`;
        }
    });

    // Отображение SoundTag по URL
    const urlParams = new URLSearchParams(window.location.search);
    const sndtagid = urlParams.get('sndtagid');
    if (sndtagid) {
        fetch(`/.netlify/functions/get-soundtag?sndtagid=${sndtagid}`)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    resultDiv.innerHTML = `<p>${data.error}</p>`;
                } else {
                    const { title, text, imageUrl, soundUrl, background } = data;
                    resultDiv.style.backgroundColor = background;
                    resultDiv.innerHTML = `
                        <h2>SNTAG > ${title}</h2>
                        <p>${text}</p>
                        <button class="soundtag-button" style="background-image: url('${imageUrl}');" onclick="new Audio('${soundUrl}').play()"></button>
                    `;
                }
            })
            .catch(error => {
                resultDiv.innerHTML = `<p>Ошибка загрузки: ${error.message}</p>`;
            });
    }
});