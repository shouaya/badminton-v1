class RandomPicker {
  constructor(length, idleSize) {
    this.length = length;
    this.idleSize = idleSize;
    this.resetPool();
  }

  resetPool() {
    this.pool = Array.from({ length: this.length }, (_, i) => i);
    this.selectedSet = new Set();
  }

  pickRandomGroup() {
    let result = [];

    if (this.pool.length < this.idleSize) {
      result = [...this.pool];
      this.resetPool();

      while (result.length < this.idleSize) {
        const randomIndex = Math.floor(Math.random() * this.pool.length);
        const person = this.pool[randomIndex];
        if (!result.includes(person)) {
          result.push(person);
          this.selectedSet.add(person);
          this.pool.splice(randomIndex, 1);
        }
      }
    } else {
      while (result.length < this.idleSize) {
        const randomIndex = Math.floor(Math.random() * this.pool.length);
        const person = this.pool[randomIndex];
        if (!this.selectedSet.has(person)) {
          result.push(person);
          this.selectedSet.add(person);
          this.pool.splice(randomIndex, 1);
        }
      }
    }

    return result;
  }
}

module.exports = RandomPicker;