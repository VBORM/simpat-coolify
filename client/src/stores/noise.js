let waves = [1, 0.5, 0.25, 0.125];
const NOISE_AMPLITUDE = 0.03;
const Noise = {};
Noise.sample = () => {
  let noise = 0;
  const clock = Date.now() / 1000;
  for (let i in waves) {
    let theta = clock * waves[i];
    noise += Math.sin(theta);
  }
  return noise / waves.length;
};
Noise.apply = (value, noise, baseline) => {
  let updated = value + baseline * NOISE_AMPLITUDE * noise;
  return updated < 0 ? 0 : updated;
};

export default Noise;

/*
  # Put into CODESANDBOX to visualize #
  import { useEffect, useState } from "react";
import "./styles.css";
let waves = [1, 0.5, 0.25, 0.125];
const Noise = {};
Noise.sample = (t) => {
  let noise = 0;
  const clock = t || (Date.now() / 1000);
  for (let i in waves) {
    let theta = clock * waves[i];
    noise += Math.sin(theta);
  }
  return noise ;
};


export default function App() {
  let [points, setPoints] = useState([]);

  useEffect(() => {
      let p = [];
      for (let i = 5340; i < 5500; i++) {
        let noise = Noise.sample(i);
        p.push(noise);
      }
      setPoints(p);
  }, []);

  return (
    <div className="App">
      <h1>Noise Test</h1>
      <div className="container">
      {points.map(p => (
        <div className="point" style={{ marginBottom: p + 50, width: 2 }}/>
      ))}
      </div>
    </div>
  );
}

*/
