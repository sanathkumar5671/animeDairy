export const TRENDING_ANIME_QUERY = `
  query GetTrendingAnime($page: Int, $perPage: Int) {
    Page(page: $page, perPage: $perPage) {
      pageInfo {
        total
        currentPage
        lastPage
        hasNextPage
        perPage
      }
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

export const ANIME_DETAIL_QUERY = `
  query GetAnimeDetail($id: Int) {
    Media(id: $id, type: ANIME) {
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
      bannerImage
      description
      averageScore
      popularity
      genres
      status
      episodes
      duration
      season
      seasonYear
      format
      source
      studios {
        nodes {
          name
        }
      }
      startDate {
        year
        month
        day
      }
      endDate {
        year
        month
        day
      }
      characters {
        nodes {
          id
          name {
            full
          }
          image {
            medium
          }
        }
      }
      relations {
        edges {
          relationType
          node {
            id
            title {
              english
              romaji
            }
            coverImage {
              medium
            }
            type
          }
        }
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

export const fetchAnimeDetail = async (id: number) => {
  const response = await fetch('https://graphql.anilist.co', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      query: ANIME_DETAIL_QUERY,
      variables: { id }
    })
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
}; 