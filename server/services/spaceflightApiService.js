// This is the ONLY file that talks to the external Spaceflight News API
const API_URL = 'https://api.spaceflightnewsapi.net/v4/articles';

// Gets the latest articles. (fetch is built into Node 18+)
async function fetchLatestArticles(limit = 30) {
  const response = await fetch(`${API_URL}/?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Spaceflight News API failed with status ' + response.status);
  }
  const data = await response.json();
  return data.results; // the list of articles
}

module.exports = { fetchLatestArticles };
