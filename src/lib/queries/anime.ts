export const TRENDING_ANIME_QUERY = `
  query GetTrendingAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      media(sort: TRENDING_DESC, type: ANIME) {
        id
        title {
          romaji
          english
          native
        }
        coverImage {
          large
          medium
        }
        description
        averageScore
        popularity
        genres
        status
        episodes
        duration
      }
    }
  }
`;

export const fetchTrendingAnime = async (page: number = 1, perPage: number = 10) => {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: TRENDING_ANIME_QUERY,
      variables: { page, perPage }
    })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}; 