import fs from 'fs';
import zlib from 'zlib';
import https from 'https';
import path from 'path';

const API_KEY = "37f536bf16346bfc6cfcefca8f004b89"; // Insert TMDB API key here
const TARGET_COUNTRIES = ["KR", "CN", "JP"];
const OUTPUT_PATH = path.resolve('./src/asian_dramas_database.json');

// 1. Get today's date formatted as MM_DD_YYYY
const getFormattedDate = () => {
  const d = new Date();
  const mm = String(d.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(d.getUTCDate()).padStart(2, '0');
  const yyyy = d.getUTCFullYear();
  return `${mm}_${dd}_${yyyy}`;
};

const EXPORT_URL = `https://files.tmdb.org/p/exports/tv_series_ids_${getFormattedDate()}.json.gz`;

console.log(`Downloading daily export file: ${EXPORT_URL}`);

// 2. Download and Decompress the Gzip Stream
https.get(EXPORT_URL, (res) => {
  if (res.statusCode !== 200) {
    console.error(`Failed to download file. Status: ${res.statusCode}`);
    return;
  }

  const gunzip = zlib.createGunzip();
  let buffer = '';

  res.pipe(gunzip);

  gunzip.on('data', (chunk) => {
    buffer += chunk.toString('utf-8');
  });

  gunzip.on('end', async () => {
    console.log('Decompression complete. Processing IDs...');
    const lines = buffer.split('\n');
    const validIds = [];

    // Filter valid IDs with popularity > 0.5 to keep dataset relevant
    for (const line of lines) {
      if (line.trim()) {
        try {
          const item = JSON.parse(line);
          if (item.popularity > 0.5) {
            validIds.push(item.id);
          }
        } catch (e) {
          // ignore malformed lines
        }
      }
    }

    console.log(`Found ${validIds.length} candidate shows. Filtering for Asian dramas...`);
    await filterAndSaveAsianDramas(validIds, 100); // Set limit for testing (e.g. 100 or 1000)
  });
}).on('error', (err) => {
  console.error('Download error:', err.message);
});

// 3. Query TMDB Details Endpoint to check Origin Country
async function filterAndSaveAsianDramas(ids, maxShows = 100) {
  const asianDramas = [];

  for (let i = 0; i < ids.length; i++) {
    if (asianDramas.length >= maxShows) break;

    const id = ids[i];
    const url = `https://api.themoviedb.org/3/tv/${id}?api_key=${API_KEY}&language=en-US`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        const origin = data.origin_country || [];

        // Check if the show originates from S. Korea, China, or Japan
        if (origin.some((c) => TARGET_COUNTRIES.includes(c))) {
          asianDramas.push({
            id: data.id,
            name: data.name,
            original_name: data.original_name,
            countries: origin,
            first_air_date: data.first_air_date,
            overview: data.overview,
            poster_path: data.poster_path,
            vote_average: data.vote_average,
            number_of_episodes: data.number_of_episodes,
          });
          console.log(`✓ Found [${origin.join(', ')}]: ${data.name}`);
        }
      }
    } catch (err) {
      console.error(`Error checking ID ${id}:`, err.message);
    }

    // Small delay to prevent API rate limit issues
    await new Promise((r) => setTimeout(r, 50));
  }

  // 4. Save directly into React's src directory
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(asianDramas, null, 2), 'utf-8');
  console.log(`\n🎉 Success! Saved ${asianDramas.length} dramas to ${OUTPUT_PATH}`);
}