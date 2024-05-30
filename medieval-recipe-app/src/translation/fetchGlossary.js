export default async function fetchGlossary() {
    const URL = import.meta.env.BASE_URL + 'glossary.jsonl';
    const response = await fetch(URL);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.text();
}
