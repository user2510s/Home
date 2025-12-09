 const clientId = '';
        const accessToken = '';

        const channels = ['alanzoka', 'BrunimNeets', 'gabepeixe' , 'GamsterGaming' , 'loud_coringa'];


        async function updateLiveIcons() {
            // Pega perfis
            const profileRes = await fetch(`https://api.twitch.tv/helix/users?${channels.map(c => `login=${c}`).join('&')}`, {
                headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${accessToken}` }
            });
            const profileData = await profileRes.json();
            const profileMap = {};
            profileData.data.forEach(user => {
                profileMap[user.login.toLowerCase()] = user.profile_image_url;
            });

            // Pega quem está ao vivo
            const query = channels.map(c => `user_login=${c}`).join('&');
            const res = await fetch(`https://api.twitch.tv/helix/streams?${query}`, {
                headers: { 'Client-ID': clientId, 'Authorization': `Bearer ${accessToken}` }
            });
            const data = await res.json();

            const container = document.getElementById('liveIconsContainer');
            container.innerHTML = '';

            if (!data.data || data.data.length === 0) return;

            data.data.forEach(stream => {
                const iconDiv = document.createElement('div');
                iconDiv.className = 'live-icon';
                iconDiv.title = `${stream.user_name} está ao vivo!`;
                iconDiv.innerHTML = `<img src="${profileMap[stream.user_login.toLowerCase()]}">`;

                // clique abre Twitch
                iconDiv.addEventListener('click', () => {
                    window.open(`https://twitch.tv/${stream.user_login}`, '_blank');
                });

                container.appendChild(iconDiv);
            
            });
        }

        // Atualiza a cada 30 segundos
        updateLiveIcons();
        setInterval(updateLiveIcons, 30000);