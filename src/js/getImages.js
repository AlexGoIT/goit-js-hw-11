import axios from 'axios';

const API_KEY = '35497294-a51068c2cf702ee7b95a718bd';
const URL = 'https://pixabay.com/api/';

export async function getImages(searchQuery, pageCount) {
  const params = {
    params: {
      timeout: 1000,
      key: API_KEY,
      q: searchQuery,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page: pageCount,
      per_page: 40,
    },
  };

  return await axios.get(URL, params).then(res => {
    console.log(res);
    return res.data;
  });
}