 const music = document.getElementById("bgMusic");
        const btn = document.getElementById("toggleMusic");
        const disc = document.getElementById("musicDisc");
        document.addEventListener("mousemove", (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            document.querySelector(".background").style.transform =
                `translate(${x}px, ${y}px) scale(1.05)`;
        });
        function searchGoogle() {
            const input = document.getElementById("searchInput").value.trim();

            if (input === "") return false;

            // Se é um URL, abre diretamente
            if (input.includes(".") && !input.includes(" ")) {
                window.location.href = input.startsWith("http") ? input : "https://" + input;
                return false;
            }

            // Caso contrário, pesquisa no Google
            const query = encodeURIComponent(input);
            window.location.href = "https://www.google.com/search?q=" + query;


            return false;
        }
        //relogio
        function updateClock() {
            const now = new Date();

            let h = now.getHours().toString().padStart(2, "0");
            let m = now.getMinutes().toString().padStart(2, "0");

            const days = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
            const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

            let date = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}`;

            document.getElementById("clockTime").textContent = `${h}:${m}`;
            document.getElementById("clockDate").textContent = date;
        }

        setInterval(updateClock, 1000);
        updateClock();


        //clima

        function loadWeather() {
            navigator.geolocation.getCurrentPosition(async pos => {

                let lat = pos.coords.latitude;
                let lon = pos.coords.longitude;

                let url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;

                let res = await fetch(url);
                let data = await res.json();

                let temp = data.current_weather.temperature;
                let wind = data.current_weather.windspeed;

                let html = `
            Temperatura: ${temp}ºC<br>
            Vento: ${wind} km/h
        `;

                document.getElementById("weatherInfo").innerHTML = html;

            }, () => {
                document.getElementById("weatherInfo").innerHTML = "Ative a localização.";
            });
        }
        loadWeather();

        let todoList = [];

        function loadTodos() {
            let saved = localStorage.getItem("todos");
            if (saved) todoList = JSON.parse(saved);
            renderTodos();
        }

        function saveTodos() {
            localStorage.setItem("todos", JSON.stringify(todoList));
        }

        function renderTodos() {
            const div = document.getElementById("todoList");
            div.innerHTML = "";

            todoList.forEach((task, i) => {
                div.innerHTML += `
            <div class="todo-item">
                <span class="todo-text">${task}</span>
                <span class="todo-remove" onclick="removeTodo(${i})">X</span>
            </div>
        `;
            });
        }

        document.getElementById("todoInput").addEventListener("keypress", e => {
            if (e.key === "Enter") {
                let text = e.target.value.trim();
                if (text !== "") {
                    todoList.push(text);
                    e.target.value = "";
                    saveTodos();
                    renderTodos();
                }
            }
        });

        function removeTodo(i) {
            todoList.splice(i, 1);
            saveTodos();
            renderTodos();
        }

        loadTodos();