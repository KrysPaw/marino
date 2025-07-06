import { Application, extend } from "@pixi/react";
import { Assets, Container, Graphics, Sprite, Texture } from "pixi.js";
import { useEffect, useState } from "react";
import manifest from "../assets/manifest.json";
import { theme } from "../config/theme";

extend({
  Container,
  Graphics,
  Sprite,
});

Assets.init({ manifest });

const initializeAssetsBundles = async () => {
  await Assets.loadBundle(["sprites"]);
};

export const CanvasApp = () => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    loadAssets();
  }, []);

  const loadAssets = async () => {
    if (initialized) return;

    await initializeAssetsBundles();

    setInitialized(true);
  };

  if (!initialized || Texture.from("sea_background") === undefined) {
    return <div>Loading...</div>;
  }

  const tiles = new Array(100).fill(null);

  // Draw grid with Graphics
  return (
    <div style={{ backgroundColor: theme.colors.darkBlue_2 }}>
      <Application width={600}>
        <pixiSprite texture={Texture.from("sea_background")} />
        <pixiGraphics
          draw={(g) => {
            g.setStrokeStyle({ color: theme.colors.blue_1, width: 2 });
            g.rect(0, 1, 599, 599);
            g.stroke();
          }}
        />
        <pixiContainer>
          {tiles.map((_, index) => {
            const xCord = index % 10;
            const yCord = Math.floor(index / 10);
            const x = xCord * 60;
            const y = yCord * 60;

            return (
              <pixiGraphics
                key={`index ${xCord} ${yCord}`}
                draw={(g) => {
                  g.setStrokeStyle({ color: theme.colors.blue_1, width: 2 });
                  g.rect(x + 1, y, 60, 60);
                  g.stroke();
                }}
              />
            );
          })}
        </pixiContainer>
      </Application>
    </div>
  );
};

window.onload = initializeAssetsBundles;
