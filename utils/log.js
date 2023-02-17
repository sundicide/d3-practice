class Logger {
  showMode = true

  constructor() {}
  log(props) {
    if (this.showMode) {
      console.log(...props)
    }
  }
  set showMode(flag) {
    this.showMode = flag
  }
}
export default new Logger()