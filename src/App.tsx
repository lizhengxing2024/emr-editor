import React, { useEffect, useRef } from "react";

import EmrEditor from "./editor";

function App() {
  const containerDOMRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const editor = new EmrEditor(
      containerDOMRef.current,
      [
        {
          value: "你", // 文字内容
          color: "#000", // 文字颜色
          size: 16, // 文字大小
        },
        {
          value: "好",
          background: "red", // 文字背景颜色
          lineheight: 1, // 行高，倍数
        },
        {
          value: "哇",
          bold: true, // 加粗
        },
        {
          value: "\n", // 换行
        },
        {
          value: "这",
          italic: true, // 斜体
        },
        {
          value: "是",
        },
        {
          value: "编",
          underline: true, // 下划线
        },
        {
          value: "辑",
          linethrough: true, // 中划线
        },
        {
          value: "器",
          fontfamily: "", // 字体
        },
      ],
      {
        pageWidth: 794,
        pageHeight: 1122,
        pagePadding: [100, 120, 100, 120], // 纸张内边距，分别为：上、右、下、左
        pageMargin: 20, // 页面之间的间隔
        pagePaddingIndicatorSize: 35, // 纸张内边距指示器的大小，也就是四个直角的边长
        pagePaddingIndicatorColor: "#BABABA", // 纸张内边距指示器的颜色，也就是四个直角的边颜色
        color: "#333", // 文字颜色
        fontSize: 16, // 字号
        fontFamily: "Yahei", // 字体
        lineHeight: 1,
      }
    );
    return () => {
      editor.destroy();
    };
  }, []);

  return <div ref={containerDOMRef} style={{ border: "2px solid blue" }}></div>;
}

export default App;
