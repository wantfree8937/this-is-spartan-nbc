export class ScreenText {
  constructor(screenText) {
    this.msg = screenText.msg;
    this.typingAnimation = screenText.typingAnimation;
    this.textAlignment = new TextAlignment(screenText.textAlignment);
    this.textColor = new Color(screenText.textColor);
    this.screenColor = new Color(screenText.screenColor);
  }
}

export class TextAlignment {
  constructor(screenText) {
    this.x = screenText.x;      // 0:왼쪽 |  1:중앙  | 2:오른쪽 정렬
    this.y = screenText.y;      // 0:상단 | 1:가운데 | 2:하단 정렬
  }

  setPos(x, y) {
    this.x = x;
    this.y = y;
  }
}

export class Color {
  constructor(color) {
    this.r = color.r;
    this.g = color.g;
    this.b = color.b;
  }

  setColor(r, g, b) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
}

export default { ScreenText, TextAlignment, Color };
