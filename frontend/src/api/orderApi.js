import axiosInstance from './axiosInstance';

/**
 * OrderApi — Repository class for Order API calls.
 */
class OrderApi {
  async getAll() {
    const { data } = await axiosInstance.get('/orders');
    return data.orders;
  }

  async create(customerName, stockId, orderQty) {
    const { data } = await axiosInstance.post('/orders', { customerName, stockId, orderQty });
    return data.order;
  }

  async remove(id) {
    const { data } = await axiosInstance.delete(`/orders/${id}`);
    return data;
  }
}

export const orderApi = new OrderApi();
