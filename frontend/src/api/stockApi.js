import axiosInstance from './axiosInstance';

/**
 * StockApi — Repository class for Stock API calls.
 */
class StockApi {
  async getAll() {
    const { data } = await axiosInstance.get('/stocks');
    return data.stocks;
  }

  async create(name, stockQty) {
    const { data } = await axiosInstance.post('/stocks', { name, stockQty });
    return data.stock;
  }

  async remove(id) {
    const { data } = await axiosInstance.delete(`/stocks/${id}`);
    return data;
  }
}

export const stockApi = new StockApi();
