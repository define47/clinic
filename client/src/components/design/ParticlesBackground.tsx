import { FC, ReactNode } from "react";
import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
// import type { Container } from "@tsparticles/engine";
import { loadFull } from "tsparticles";

interface ParticlesBackgroundProps {
  children: ReactNode;
}

const ParticlesBackground: FC<ParticlesBackgroundProps> = ({ children }) => {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  // const particlesLoaded = (container: Container) => {
  //   console.log(container);
  // };

  return (
    <div>
      {init && (
        <Particles
          id="tsparticles"
          // particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                //
                value: "#100c08",
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: false,
                  mode: "push",
                },
                onHover: {
                  enable: false,
                  mode: "repulse",
                  // duration: 0.2,
                },
                // resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 180,
                  duration: 0.8,
                },
              },
            },
            // #7cb9e8
            particles: {
              color: {
                value: "#fc46aa",
              },
              links: {
                color: "#fc46aa",
                distance: 110,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              collisions: {
                enable: true,
              },
              move: {
                direction: "none",
                enable: true,
                outModes: {
                  default: "bounce",
                },
                random: true,
                speed: 1.5,
                straight: true,
              },
              number: {
                density: {
                  enable: true,
                  // area: 500,
                },
                value: 300,
              },
              opacity: {
                value: 0.6,
              },
              shape: {
                type: "circle",
              },
              size: {
                value: { min: 1, max: 3 },
              },
            },
            detectRetina: true,
          }}
        />
      )}
      {children}
    </div>
  );
};

export default ParticlesBackground;
