default {
  state_entry() {
    llSay(0, "Hello Avatar!");
  }

  touch_start(integer n) {
    llSay(0, "Touched");
  }
}
