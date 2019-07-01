class Pagination {
  constructor(page, size, totalItems) {
    this.page = page;
    this.size = size;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(this.totalItems / this.size);
  }
}

module.exports = Pagination;
