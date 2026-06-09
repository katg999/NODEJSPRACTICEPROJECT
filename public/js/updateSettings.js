import { showAlert } from './alerts';
import axios from 'axios';

//type is either password or data
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? '/api/v1/users/updateMyPassword'
        : '/api/v1/users/updateMe';

    let res;
    if (type === 'data') {
      // Use fetch for FormData to avoid axios serialization issues
      const response = await fetch(url, {
        method: 'PATCH',
        body: data, // FormData sent natively
      });
      res = await response.json();
    } else {
      const response = await axios({
        method: 'PATCH',
        url,
        data,
      });
      res = response.data;
    }

    if (res.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch (err) {
    showAlert('error', err.response?.data?.message || 'Something went wrong');
  }
};
