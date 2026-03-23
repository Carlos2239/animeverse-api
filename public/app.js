document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('search-form');
    const searchInput = document.getElementById('search-input');
    const resultsGrid = document.getElementById('results-grid');
    const loader = document.getElementById('loader');
    const errorMessage = document.getElementById('error-message');
    const initialState = document.getElementById('initial-state');

    searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        
        if (!query) return;

        // Limpiar estado y mostrar loader
        initialState.classList.add('hidden');
        errorMessage.classList.add('hidden');
        resultsGrid.innerHTML = '';
        loader.classList.remove('hidden');

        try {
            const response = await fetch(`/buscar?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error('Error en la respuesta del servidor');
            }

            const data = await response.json();
            
            loader.classList.add('hidden');

            if (data.length === 0) {
                showError(`No se encontraron resultados para "${query}".`);
                return;
            }

            renderGrid(data);
        } catch (error) {
            console.error('Error al realizar la búsqueda:', error);
            loader.classList.add('hidden');
            showError('Hubo un problema de conexión. Por favor, intenta de nuevo más tarde.');
        }
    });

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    }

    function truncateText(text, maxLength) {
        if (!text) return 'Sin descripción disponible.';
        if (text.length <= maxLength) return text;
        // Truncar al último espacio antes del límite
        const truncated = text.substring(0, maxLength);
        return truncated.substring(0, truncated.lastIndexOf(' ')) + '...';
    }

    function renderGrid(animes) {
        animes.forEach((anime, index) => {
            const synopsis = truncateText(anime.synopsis, 150);
            
            const card = document.createElement('article');
            card.className = 'anime-card';
            // Añadir un pequeño retraso de animación en base al índice para efecto cascada
            card.style.animationDelay = `${index * 0.05}s`;
            
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="${anime.image}" alt="${anime.title}" class="card-image" loading="lazy">
                    <div class="card-badges">
                        <span class="badge badge-score">★ ${anime.score}</span>
                        <span class="badge">${anime.type}</span>
                    </div>
                </div>
                <div class="card-content">
                    <h3 class="card-title">${anime.title}</h3>
                    <p class="card-synopsis">${synopsis}</p>
                </div>
            `;
            
            resultsGrid.appendChild(card);
        });
    }
});
