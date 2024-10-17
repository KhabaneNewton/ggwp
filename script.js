const apiKey = 'AIzaSyBSZp1QSxhI2ys7DdIs3dhQ-VUtmaNNBJ0';
const channelId = 'UCnHbiarag20EzIjSXDl0tJA'; // Ganti dengan ID Channel sesuai

async function fetchVideos(order, elementId) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=${order}&maxResults=5`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const videoList = document.getElementById(elementId);
        videoList.innerHTML = '';

        data.items.forEach(item => {
            const videoItem = document.createElement('li');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <h3>${item.snippet.title}</h3>
                <a href="https://www.youtube.com/watch?v=${item.id.videoId}" target="_blank">Tonton Video</a>
            `;
            videoList.appendChild(videoItem);
        });
    } catch (error) {
        console.error('Error fetching videos:', error);
    }
}

// Fetch latest videos
fetchVideos('date', 'latest-videos');
// Fetch oldest videos
fetchVideos('date', 'oldest-videos');

const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    document.body.classList.toggle('light-mode');
    themeSwitch.textContent = document.body.classList.contains('dark-mode') ? '🌙' : '☀️';
});
