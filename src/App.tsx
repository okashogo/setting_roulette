import React, { useEffect, useMemo, useRef, useState } from "react";
import "@splidejs/react-splide/css"; // スタイルのインポート
import rouletteBackground from "./images/roulette_background.jpg";
import "./App.css";

const gene7 = ["斉藤", "菊池", "高井", "朝永", "浅野", "丸添", "雨夜"];
const gene0 = ["加藤", "木塚", "野村", "谷", "小野瀬", "坪井", "後藤"];
const battle = [
  "インディアンポーカー",
  "叩いてかぶって",
  "スマブラ",
  "気配切り",
  "リアルファイト",
  "合宿代男気じゃんけん",
  "お絵描き対決",
  // "イントロクイズ",
];

// const speedLimit = 70;

const App = () => {
  // const [spinning, setSpinning] = useState<boolean[]>([false, false, false]);
  const [spinning1, setSpinning1] = useState<boolean>(false);
  const [spinning2, setSpinning2] = useState<boolean>(false);
  const [spinning3, setSpinning3] = useState<boolean>(false);
  const [currentIndexs, setCurrentIndexs] = useState([2, 2, 2]); // 現在のスライドインデックス
  const [speed, setSpeed] = useState(10000); // スライド速度（初期値: 1秒）
  const [speedSetting, setSpeedSetting] = useState(300);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [stopIndex, setStopIndex] = useState(0);
  // console.log("stopIndex", stopIndex);
  const [resultIndexs, setResultIndexs] = useState<(number | null)[]>([
    null,
    null,
    null,
  ]); // 停止したスライドインデックス
  // console.log("resultIndexs", resultIndexs, currentIndexs);
  const [settingIndex, setSettingIndex] = useState(0);
  const [stopIndexSetting, setStopIndexSetting] = useState(3);
  const [diffIndexSetting, setDiffIndexSetting] = useState(7);

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
      // if (spinning1 === true || currentIndexs[0] % 7 === settingIndex) {
      timerRef.current = setInterval(() => {
        setCurrentIndexs((prevIndexs) => {
          return prevIndexs.map((prevIndex) => prevIndex + 1);
        }); // 次のスライドに進む
      }, speed);
    } else if (spinning2 === true) {
      // } else if (spinning2 === true || currentIndexs[1] % 7 === settingIndex) {
      timerRef.current = setInterval(() => {
        setCurrentIndexs((prevIndexs) => {
          return [prevIndexs[0], prevIndexs[1] + 1, prevIndexs[2] + 1];
        }); // 次のスライドに進む
      }, speed);
    } else if (spinning3 === true) {
      // } else if (spinning3 === true || currentIndexs[2] % 7 === settingIndex) {
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
    console.log("resultIndexs", settingIndex, resultIndexs, currentIndexs);
    // console.log("stopIndex", stopIndex);
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

    // console.log(
    //   "8888",
    //   stopIndex,
    //   stopIndexSetting,
    //   currentIndexs[0] % 7,
    //   stopIndexSetting
    // );
    if (
      currentIndexs[0] >= stopIndexSetting + diffIndexSetting &&
      (currentIndexs[0] - 2) % 7 === stopIndexSetting
    ) {
      setSpinning1(false);

      // もっともcurrentIndexsに近い、gene7の倍数 + settingIndexを取得する。
      const resultIndex =
        Math.round(currentIndexs[0] / 7) * 7 + settingIndex - 7;
      // console.log("currentIndexs", currentIndexs[0], resultIndex);
      setResultIndexs([resultIndex, -1, -1]);
      if (
        currentIndexs[1] >= stopIndexSetting + diffIndexSetting * 2 &&
        (currentIndexs[1] - 2) % 7 === stopIndexSetting
      ) {
        // 5秒後に2個目を停止し、10秒後に全てを停止する。
        setSpinning2(false);
        const resultIndex2 =
          Math.round(currentIndexs[1] / 7) * 7 + settingIndex - 7;
        setResultIndexs([resultIndexs[0], resultIndex2, -1]);
        if (
          currentIndexs[2] >= stopIndexSetting + diffIndexSetting * 3 &&
          (currentIndexs[2] - 2) % 7 === stopIndexSetting
        ) {
          const resultIndex3 =
            Math.round(currentIndexs[2] / 7) * 7 + settingIndex - 7;
          setSpinning3(false);
          setResultIndexs([resultIndexs[0], resultIndexs[1], resultIndex3]);

          // 3秒後に全てをリセットする。
          setTimeout(() => {
            setCurrentIndexs([settingIndex, settingIndex, settingIndex]);
            setStopIndex(settingIndex);

            if (timerRef.current) clearInterval(timerRef.current);
            // }, 10000);
          }, 1000);
        }
      }
    }
    // const slowDown = setTimeout(() => {
    //   setStopIndex(stopIndex + 1);
    // }, 1000);
    // return () => clearTimeout(slowDown);
  }, [isRunning, speed, currentIndexs]);

  const handleStart = () => {
    if (isRunning) return;
    setCurrentIndexs([2, 2, 2]);
    setResultIndexs([-1, -1, -1]);
    setSpinning1(true);
    setSpinning2(true);
    setSpinning3(true);
    setSpeed(speedSetting);
    setStopIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") {
        console.log("click 1");
        setSettingIndex(0 - 1);
      } else if (event.key === "2") {
        console.log("click 2");
        setSettingIndex(1 - 1);
      } else if (event.key === "3") {
        console.log("click 3");
        setSettingIndex(2 - 1);
      } else if (event.key === "4") {
        console.log("click 4");
        setSettingIndex(3 - 1);
      } else if (event.key === "Enter") {
        console.log("click Enter");
        handleStart();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="container w-full h-full mx-auto">
      <div className="min-h-screen text-white flex flex-col justify-center items-center z-10 relative">
        <h1 className="font-bold text-[50px] mb-[60px]">ルーレット</h1>
        <div className="flex gap-[100px]">
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
          onClick={handleStart}
          disabled={isRunning}
          className={`mt-[70px] px-6 py-3 bg-yellow-500 w-[500px] h-[60px] text-black font-bold text-2xl rounded ${
            isRunning ? "opacity-50 cursor-not-allowed" : "hover:bg-yellow-600"
          }`}
        >
          {isRunning ? "Spinning..." : "START"}
        </button>
        {/* <div>
          <div>1を押した回したら、斉藤 x 加藤 x インディアンポーカー</div>
          <div>2を押して回したら、菊池 x 木塚 x 叩いてかぶって</div>
          <div>3を押して回したら、高井 x 野村 x スマブラ</div>
          <div>4を押した回したら、朝永 x 谷 x 気配切り</div>
        </div> */}
        {/* <div className="flex gap-4">
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
                <option value={value} selected={value === speedSetting}>
                  1 / {value}倍
                </option>
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
              <option value={value} selected={value === stopIndexSetting}>
                {value}
              </option>
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
              <option value={value} selected={value === diffIndexSetting}>
                {value}
              </option>
            ))}
          </select>
        </div> */}
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
  resultIndex: number | null;
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
          transition: spinning
            ? `transform 1s cubic-bezier(0.25, 0.1, 0.25, 1)`
            : "translateY(0)",
          transform:
            resultIndex !== null
              ? spinning
                ? `translateY(-${currentIndexs * 100 + 100}px)`
                : `translateY(-${resultIndex * 100 + 600}px)`
              : "",
          flexDirection: "column",
          willChange: "transform", // 最適化ヒント
        }}
      >
        {Array(200)
          .fill(datas)
          .flat()
          .map((item, idx) => (
            <div
              key={resultIndex ? resultIndex - idx : idx}
              className={`text-option ${
                !spinning && resultIndex && resultIndex! + 1 === idx - 7
                  ? "selected-text"
                  : "no-selected-text"
              }`}
            >
              {item}
              {/* <span className="text-[15px] ml-2">{idx}</span> */}
            </div>
          ))}
      </div>
    </div>
  );
};
