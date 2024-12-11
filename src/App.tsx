import React, { useEffect, useMemo, useRef, useState } from "react";
import "@splidejs/react-splide/css"; // スタイルのインポート
import rouletteBackground from "./images/roulette_background.jpg";
import "./App.css";

const gene7 = ["菊池", "斉藤", "高井", "朝永", "浅野", "丸添", "雨夜"];
const gene0 = ["木塚", "加藤", "野村", "谷", "小野瀬", "坪井", "後藤"];
const battle = [
  "叩いてかぶって",
  "インディアンポーカー",
  "スマブラ",
  "気配切り",
  "リアルファイト",
  "合宿代男気じゃんけん",
  // "イントロクイズ",
  "お絵描き対決",
];

// const speedLimit = 70;

const App = () => {
  // const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [spinning1, setSpinning1] = useState<boolean>(false);
  const [spinning2, setSpinning2] = useState<boolean>(false);
  const [spinning3, setSpinning3] = useState<boolean>(false);
  const [currentIndexs, setCurrentIndexs] = useState([2, 2, 2]); // 現在のスライドインデックス
  const [speed, setSpeed] = useState(10000); // スライド速度（初期値: 1秒）
  const [speedSetting, setSpeedSetting] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [stopIndex, setStopIndex] = useState(0);
  const [resultIndexs, setResultIndexs] = useState([2, 2, 2]); // 停止したスライドインデックス
  const [settingIndex, setSettingIndex] = useState(0);
  const [stopIndexSetting, setStopIndexSetting] = useState(3);
  const [diffIndexSetting, setDiffIndexSetting] = useState(1);

  const isRunning = useMemo(
    () => spinning1 || spinning2 || spinning3,
    [spinning1, spinning2, spinning3]
  );

  useEffect(() => {
    if (spinning1 === false && spinning2 === false && spinning3 === false) {
      timerRef.current = null;
      return;
    }
    if (spinning1 === true) {
      timerRef.current = setInterval(() => {
        setCurrentIndexs((prevIndexs) => {
          return prevIndexs.map((prevIndex) => prevIndex + 1);
        }); // 次のスライドに進む
      }, speed);
    } else if (spinning2 === true) {
      timerRef.current = setInterval(() => {
        setCurrentIndexs((prevIndexs) => {
          return [prevIndexs[0], prevIndexs[1] + 1, prevIndexs[2] + 1];
        }); // 次のスライドに進む
      }, speed);
    } else if (spinning3 === true) {
      timerRef.current = setInterval(() => {
        setCurrentIndexs((prevIndexs) => {
          return [prevIndexs[0], prevIndexs[1], prevIndexs[2] + 1];
        }); // 次のスライドに進む
      }, speed);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [speed, spinning1, spinning2, spinning3]);

  useEffect(() => {
    if (
      spinning1 === false &&
      spinning2 === false &&
      spinning3 === false &&
      currentIndexs[0] === settingIndex &&
      currentIndexs[1] === settingIndex &&
      currentIndexs[2] === settingIndex
    ) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    if (stopIndex >= stopIndexSetting) {
      setSpinning1(false);

      // もっともcurrentIndexsに近い、gene7の倍数 + settingIndexを取得する。
      const resultIndex =
        (Math.round(currentIndexs[0] / 7) + 1) * 7 + settingIndex;
      // console.log("resultIndex", resultIndex, currentIndexs[0]);
      setResultIndexs([resultIndex, currentIndexs[1], currentIndexs[2]]);
      setCurrentIndexs([resultIndex, currentIndexs[1], currentIndexs[2]]);
      if (stopIndex >= stopIndexSetting + diffIndexSetting) {
        // 5秒後に2個目を停止し、10秒後に全てを停止する。
        setSpinning2(false);
        const resultIndex2 =
          (Math.round(currentIndexs[1] / 7) + 1) * 7 + settingIndex;
        // console.log("resultIndex2", resultIndex2, currentIndexs[1]);
        setResultIndexs([resultIndex, resultIndex2, currentIndexs[2]]);
        setCurrentIndexs([resultIndex, resultIndex2, currentIndexs[2]]);
        if (stopIndex >= stopIndexSetting + diffIndexSetting * 2) {
          const resultIndex3 =
            (Math.round(currentIndexs[2] / 7) + 1) * 7 + settingIndex;
          // console.log("resultIndex3", resultIndex3, currentIndexs[2]);
          setSpinning3(false);
          setResultIndexs([resultIndex, resultIndex2, resultIndex3]);
          setCurrentIndexs([resultIndex, resultIndex2, resultIndex3]);

          // 3秒後に全てをリセットする。
          setTimeout(() => {
            setCurrentIndexs([settingIndex, settingIndex, settingIndex]);
            setResultIndexs([settingIndex, settingIndex, settingIndex]);
            setStopIndex(settingIndex);

            if (timerRef.current) clearInterval(timerRef.current);
          }, 1000);
        }
      }
    }
    const slowDown = setTimeout(() => {
      setStopIndex(stopIndex + 1);
    }, 1000);
    return () => clearTimeout(slowDown);
  }, [isRunning, speed, stopIndex]);

  // useEffect(() => {
  //   if (
  //     spinning1 === false &&
  //     spinning2 === false &&
  //     spinning3 === false &&
  //     currentIndexs[0] === settingIndex &&
  //     currentIndexs[1] === settingIndex &&
  //     currentIndexs[2] === settingIndex
  //   ) {
  //     if (timerRef.current) clearInterval(timerRef.current);
  //     return;
  //   }
  // }, [spinning1, spinning2, spinning3, currentIndexs]);

  // console.log("Indexs", currentIndexs, resultIndexs);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "0") {
        setSettingIndex(0);
      } else if (event.key === "1") {
        setSettingIndex(1);
      } else if (event.key === "2") {
        setSettingIndex(2);
      } else if (event.key === "3") {
        setSettingIndex(3);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="container w-full h-full mx-auto">
      <div className="min-h-screen text-white flex flex-col justify-center items-center space-y-8 z-10 relative">
        <h1 className="text-4xl font-bold">ルーレット</h1>
        <div className="flex gap-[60px]">
          <div className="reel-container">
            <SlideBox
              currentIndexs={currentIndexs[0]}
              datas={gene7}
              spinning={spinning1}
              resultIndex={resultIndexs[0]}
            />
          </div>
          <div className="reel-container">
            <SlideBox
              currentIndexs={currentIndexs[1]}
              datas={gene0}
              spinning={spinning2}
              resultIndex={resultIndexs[1]}
            />
          </div>
          <div className="reel-container">
            <SlideBox
              currentIndexs={currentIndexs[2]}
              datas={battle}
              spinning={spinning3}
              resultIndex={resultIndexs[2]}
            />
          </div>
        </div>
        <button
          onClick={() => {
            if (isRunning) return;
            setCurrentIndexs([2, 2, 2]);
            setResultIndexs([2, 2, 2]);
            setSpinning1(true);
            setSpinning2(true);
            setSpinning3(true);
            setSpeed(speedSetting);
            setStopIndex(0);
          }}
          disabled={isRunning}
          className={`px-6 py-3 bg-yellow-500 w-40 text-black font-bold rounded ${
            isRunning ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
          }`}
        >
          {isRunning ? "Spinning..." : "START"}
        </button>
        <div>
          <div>0を押した回したら、斉藤 x 加藤 x インディアンポーカー</div>
          <div>1を押して回したら、高井 x 野村 x スマブラ</div>
          <div>2を押した回したら、朝永 x 谷 x 気配切り</div>
          <div>3を押して回したら、菊池 x 木塚 x 叩いてかぶって</div>
        </div>
        <div className="flex gap-4">
          <div>スピード</div>
          <select
            value={speedSetting}
            onChange={(e) => {
              console.log("select", e.target.value);
              setSpeedSetting(Number(e.target.value));
            }}
            className="w-[150px] h-[50px] text-black"
          >
            {Array.from({ length: 100 }, (_, i) => i * 10 + 100).map(
              (value) => (
                <option value={value}>1 / {value}倍</option>
              )
            )}
          </select>
        </div>
        <div className="flex gap-4">
          <div>停止時間</div>
          <select
            value={stopIndexSetting}
            onChange={(e) => {
              console.log("select", e.target.value);
              setStopIndexSetting(Number(e.target.value));
            }}
            className="w-[150px] h-[50px] text-black"
          >
            {Array.from({ length: 10 }, (_, i) => i + 3).map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4">
          <div>停止時間の差</div>
          <select
            value={diffIndexSetting}
            onChange={(e) => {
              console.log("select", e.target.value);
              setDiffIndexSetting(Number(e.target.value));
            }}
            className="w-[150px] h-[50px] text-black"
          >
            {Array.from({ length: 5 }, (_, i) => i + 1).map((value) => (
              <option value={value}>{value}</option>
            ))}
          </select>
        </div>
      </div>
      <img
        src={rouletteBackground}
        className="absolute top-0 left-0 w-full h-full object-cover opacity-[0.5] z-0"
        // style={{
        //   marginTop: `calc(100vh * -1)`,
        // }}
        alt="roulette background"
      />
    </div>
  );
};

export default App;

const SlideBox = ({
  currentIndexs,
  datas,
  spinning,
  resultIndex,
}: {
  currentIndexs: number;
  datas: string[];
  spinning: boolean;
  resultIndex: number;
}) => {
  return (
    <div
      style={{
        overflow: "hidden",
        border: "1px solid #ccc",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          transition: spinning ? `transform 0.5s ease` : "none",
          transform: spinning
            ? `translateY(-${currentIndexs * 100}px)`
            : `translateY(-${resultIndex * 100}px)`,
          flexDirection: "column",
        }}
      >
        {Array(200)
          .fill(datas)
          .flat()
          .map((item, idx) => (
            <div
              key={idx}
              style={{
                background: "grey",
                height: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize:
                  !spinning && resultIndex + 1 === idx ? "24px" : "16px",
                fontWeight:
                  !spinning && resultIndex + 1 === idx ? "bold" : "normal",
                color: !spinning && resultIndex + 1 === idx ? "gold" : "white",
              }}
            >
              {item}
            </div>
          ))}
      </div>
    </div>
  );
};
