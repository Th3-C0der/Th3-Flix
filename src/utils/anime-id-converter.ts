"use server";

/**
 * Convert MyAnimeList ID to AniList ID
 * Many anime streaming services use AniList IDs instead of MAL IDs
 */
export async function convertMALtoAniList(malId: number): Promise<number | null> {
  try {
    const query = `
      query ($malId: Int) {
        Media(idMal: $malId, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
          }
        }
      }
    `;

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { malId },
      }),
      next: { revalidate: 86400 }, // Cache for 24 hours
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.errors) {
      console.error("AniList GraphQL errors:", data.errors);
      return null;
    }

    return data.data?.Media?.id || null;
  } catch (error) {
    console.error("Error converting MAL to AniList ID:", error);
    return null;
  }
}

/**
 * Get anime info from AniList using MAL ID
 */
export async function getAniListInfoFromMAL(malId: number) {
  try {
    const query = `
      query ($malId: Int) {
        Media(idMal: $malId, type: ANIME) {
          id
          idMal
          title {
            romaji
            english
            native
          }
          episodes
          status
          season
          seasonYear
        }
      }
    `;

    const response = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query,
        variables: { malId },
      }),
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`AniList API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.Media || null;
  } catch (error) {
    console.error("Error fetching AniList info:", error);
    return null;
  }
}
