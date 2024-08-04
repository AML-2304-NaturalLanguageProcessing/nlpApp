export async function fetchRecommendationsByEmotion(emotions) {
  try {
    const response = await fetch('/api/hybrid_recommendation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotions }), // Send an array of emotions
    });
    const data = await response.json();
    return data || [];
  } catch (error) {
    console.error('Error fetching emotion-based recommendations:', error);
    return [];
  }
}
