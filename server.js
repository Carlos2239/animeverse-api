const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta de búsqueda que consume la API de Jikan
app.get('/buscar', async (req, res) => {
    const { q } = req.query;
    
    if (!q) {
        return res.status(400).json({ error: 'Falta el parámetro de búsqueda (q)' });
    }

    try {
        const response = await fetch(`https://api.jikan.moe/v4/anime?q=${encodeURIComponent(q)}`);
        
        if (!response.ok) {
            throw new Error(`Error en la API de Jikan: ${response.status}`);
        }

        const data = await response.json();
        
        
        const cleanedData = data.data.map(anime => ({
            id: anime.mal_id,
            title: anime.title || 'Título Desconocido',
            image: anime.images?.jpg?.image_url || 'https://via.placeholder.com/225x318?text=Sin+Imagen',
            synopsis: anime.synopsis || 'Sin sinopsis disponible.',
            score: anime.score || 'N/A',
            type: anime.type || 'Desconocido'
        }));

        res.json(cleanedData);
    } catch (error) {
        console.error('Error al buscar anime:', error);
        res.status(500).json({ error: 'Error interno del servidor al consultar la API' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor AnimeVerse en ejecución: http://localhost:${PORT}`);
});
