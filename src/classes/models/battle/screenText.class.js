class ScreenText {
  constructor(textInfo) {
    this.msg = textInfo.msg;
    this.typingAnimation = textInfo.typingAnimation;
    this.alignment = new Alignment(textInfo.alignment);
    this.textColor = new Color(textInfo.textColor);
    this.screenColor = new Color(textInfo.screenColor);
  }
}

class Alignment {
  constructor(textInfo) {
    this.x = textInfo.x;
    this.y = textInfo.y;
  }
}

class Color {
  constructor(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }
}

export { ScreenText, Alignment, Color };
