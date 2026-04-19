import * as Phaser from "phaser";

/**
 * Главная игровая сцена
 * Здесь будет отображаться пирамида карт и управление игрой
 */
export class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: "MainScene" });
  }

  /**
   * preload - загрузка ресурсов (картинок, звуков)
   * Вызывается один раз перед create
   */
  preload(): void {
    console.log("[MainScene] preload: загрузка ресурсов");
  }

  /**
   * create - создание игровых объектов
   * Вызывается после preload
   */
  create(): void {
    console.log("[MainScene] create: сцена создана");

    // 1. Добавляем фон-сукно
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add.rectangle(0, 0, width, height, 0x1a4d2a, 1).setOrigin(0, 0);

    // 2. Добавляем декоративные элементы
    const graphics = this.add.graphics();
    graphics.lineStyle(1, 0x2a6a3a, 0.3);

    for (let y = 0; y < height; y += 30) {
      graphics.lineBetween(0, y, width, y);
    }

    for (let x = 0; x < width; x += 30) {
      graphics.lineBetween(x, 0, x, height);
    }

    // 3. Добавляем заглушку - текст, чтобы убедиться, что сцена работает
    const debugText = this.add
      .text(
        width / 2,
        height / 2,
        'Аида — пасьянс "Пирамида"\nСкоро здесь будут карты...',
        {
          fontFamily: "Arial, sans-serif",
          fontSize: "24px",
          color: "#ffffff",
          align: "center",
          backgroundColor: "#000000aa",
          padding: { x: 20, y: 10 },
        },
      )
      .setOrigin(0.5, 0.5);

    // 4. Добавляем информацию о разрешении экрана
    const infoText = this.add.text(
      10,
      10,
      `Размер: ${Math.floor(width)}x${Math.floor(height)}`,
      {
        fontFamily: "monospace",
        fontSize: "12px",
        color: "#aaaaaa",
      },
    );

    console.log(`[MainScene] Сцена создана. Размер: ${width}x${height}`);
  }

  /**
   * update - вызывается каждый кадр (60 раз в секунду)
   */
  update(): void {}
}
