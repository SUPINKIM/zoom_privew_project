const baseUrl = 'http://localhost:3000';

const contentApi = {
  categoryApi: async (category, length = null) => {
    try {
      const res = await fetch(
        `${baseUrl}/content/${category}${length ? `?length=${length}` : ''}`
      );
      return { error: false, result: res.json() };
    } catch (error) {
      return { error: true, result: error };
    }
  },
  rankingApi: async () => {
    try {
      const res = await fetch(`${baseUrl}/api/best`);
      return { error: false, result: res.json() };
    } catch (error) {
      return { error: true, result: error };
    }
  },
};

export default contentApi;