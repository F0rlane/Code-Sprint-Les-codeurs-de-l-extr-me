const BASE_URL = "https://opentdb.com/api.php?amount=11";
const TOTAL_CATEGORIES_URL = "https://opentdb.com/api_category.php";
let index = 0;
let score = 0;

// récupèrer les données de l'API
async function fetchData(url) {
    const response = await fetch(url);
    return response.json();
}
// récupérer la data des categories de API
async function fetchCategoriesFromAPI() {
    const data = await fetchData(TOTAL_CATEGORIES_URL);
    return data.trivia_categories;
}