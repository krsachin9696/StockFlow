/**
 * BaseRepository - Abstract base class implementing the Repository Pattern.
 * Provides generic CRUD operations. All entity repositories must extend this.
 */
class BaseRepository {
  constructor(model) {
    if (new.target === BaseRepository) {
      throw new Error('BaseRepository is abstract and cannot be instantiated directly.');
    }
    this.model = model;
  }

  async findAll(filter = {}, options = {}) {
    return this.model.find(filter, null, options);
  }

  async findById(id) {
    return this.model.findById(id);
  }

  async findOne(filter) {
    return this.model.findOne(filter);
  }

  async create(data) {
    const document = new this.model(data);
    return document.save();
  }

  async updateById(id, data, options = { new: true, runValidators: true }) {
    return this.model.findByIdAndUpdate(id, data, options);
  }

  async deleteById(id) {
    return this.model.findByIdAndDelete(id);
  }

  async count(filter = {}) {
    return this.model.countDocuments(filter);
  }
}

module.exports = BaseRepository;
