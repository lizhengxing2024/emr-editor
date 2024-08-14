import type { EmrEditorOptionsI, ElementI } from "../interface";

type DataI = Array<{
  value: string;
  color?: string;
  size?: number;
  lineheight?: number;
  underline?: boolean;
  background?: string;
  fontfamily?: string;
  linethrough?: boolean;
  italic?: boolean;
  bold?: boolean;
}>;

type RowI = {
  width: number;
  height: number;
  elementList: Array<{
    value: string;
    color?: string;
    size?: number;
    lineheight?: number;
    underline?: boolean;
    background?: string;
    fontfamily?: string;
    linethrough?: boolean;
    italic?: boolean;
    bold?: boolean;

    info: {
      width: number;
    };
    font: string;
  }>;
};

export default class EmrEditor {
  private canvasDOM: HTMLCanvasElement;
  private canvasCtx: CanvasRenderingContext2D;
  private options: EmrEditorOptionsI;
  private data: DataI;
  private rows: Array<RowI> = [];

  constructor(
    container: HTMLDivElement | null,
    data: DataI,
    options: EmrEditorOptionsI
  ) {
    if (!container) {
      throw new Error(`container is null.`);
    }

    this.data = data;

    this.options = options;

    let { pageWidth, pageHeight } = options;
    let canvas: HTMLCanvasElement = document.createElement("canvas");
    canvas.width = pageWidth;
    canvas.height = pageHeight;
    canvas.style.cursor = "text";
    canvas.style.backgroundColor = "#fff";
    canvas.style.boxShadow = "#9ea1a566 0 2px 12px";
    canvas.style.marginBottom = 200 + "px";
    container.appendChild(canvas);

    this.canvasDOM = canvas;

    let ctx = canvas.getContext("2d");
    this.canvasCtx = ctx!;

    this.renderPagePaddingIndicators();
    this.computeRows();
    this.renderPage();
  }

  computeRows() {
    let { pageWidth, pagePadding, lineHeight } = this.options;
    // 实际内容可用宽度
    let contentWidth = pageWidth - pagePadding[1] - pagePadding[3];
    // 创建一个临时canvas用来测量文本宽高
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d")!;
    // 行数据
    let rows: Array<RowI> = [];
    rows.push({
      width: 0,
      height: 0,
      elementList: [],
    });
    this.data.forEach((item) => {
      let { value, lineheight } = item;
      // 实际行高倍数
      let actLineHeight = lineheight || lineHeight;
      // 获取文本宽高
      let font = this.getFontStr(item);
      ctx.font = font;
      let { width, actualBoundingBoxAscent, actualBoundingBoxDescent } =
        ctx.measureText(value);
      // 尺寸信息
      let info = {
        width,
        height: actualBoundingBoxAscent + actualBoundingBoxDescent,
        ascent: actualBoundingBoxAscent,
        descent: actualBoundingBoxDescent,
      };
      // 完整数据
      let element = {
        ...item,
        info,
        font,
      };
      // 判断当前行是否能容纳
      let curRow = rows[rows.length - 1];
      if (curRow.width + info.width <= contentWidth && value !== "\n") {
        curRow.elementList.push(element);
        curRow.width += info.width;
        curRow.height = Math.max(curRow.height, info.height * actLineHeight);
      } else {
        rows.push({
          width: info.width,
          height: info.height * actLineHeight,
          elementList: [element],
        });
      }
    });
    // @ts-ignore
    this.rows = rows;

    console.log(this.rows);
  }

  // 拼接font字符串
  getFontStr(element: ElementI) {
    let { fontSize, fontFamily } = this.options;
    return `${element.italic ? "italic " : ""} ${element.bold ? "bold " : ""} ${
      element.size || fontSize
    }px  ${element.fontfamily || fontFamily} `;
  }

  renderPage() {
    let { pageHeight, pagePadding } = this.options;
    // 页面内容实际可用高度
    let contentHeight = pageHeight - pagePadding[0] - pagePadding[2];
    // 从第一页开始绘制
    let pageIndex = 0;
    let ctx = this.canvasCtx;
    // 当前页绘制到的高度
    let renderHeight = 0;
    // 绘制四个角
    this.renderPagePaddingIndicators();
    this.rows.forEach((row) => {
      // 绘制当前行
      this.renderRow(ctx, renderHeight, row);
      // 更新当前页绘制到的高度
      renderHeight += row.height;
    });
  }

  renderRow(ctx: CanvasRenderingContext2D, renderHeight: number, row: RowI) {
    let { color, pagePadding } = this.options;
    // 内边距
    let offsetX = pagePadding[3];
    let offsetY = pagePadding[0];
    // 当前行绘制到的宽度
    let renderWidth = offsetX;
    renderHeight += offsetY;
    row.elementList.forEach((item) => {
      // 跳过换行符
      if (item.value === "\n") {
        return;
      }
      ctx.save();
      // 渲染文字
      ctx.font = item.font;
      ctx.fillStyle = item.color || color;
      ctx.fillText(item.value, renderWidth, renderHeight + row.height);
      // 更新当前行绘制到的宽度
      renderWidth += item.info.width;
      ctx.restore();
    });
  }

  renderPagePaddingIndicators() {
    let ctx = this.canvasCtx;
    if (!ctx) {
      return;
    }
    let {
      pageWidth,
      pageHeight,
      pagePaddingIndicatorColor,
      pagePadding,
      pagePaddingIndicatorSize,
    } = this.options;
    ctx.save();
    ctx.strokeStyle = pagePaddingIndicatorColor;
    let list: Array<Array<[number, number]>> = [
      // 左上
      [
        [pagePadding[3], pagePadding[0] - pagePaddingIndicatorSize],
        [pagePadding[3], pagePadding[0]],
        [pagePadding[3] - pagePaddingIndicatorSize, pagePadding[0]],
      ],
      // 右上
      [
        [pageWidth - pagePadding[1], pagePadding[0] - pagePaddingIndicatorSize],
        [pageWidth - pagePadding[1], pagePadding[0]],
        [pageWidth - pagePadding[1] + pagePaddingIndicatorSize, pagePadding[0]],
      ],
      // 左下
      [
        [
          pagePadding[3],
          pageHeight - pagePadding[2] + pagePaddingIndicatorSize,
        ],
        [pagePadding[3], pageHeight - pagePadding[2]],
        [
          pagePadding[3] - pagePaddingIndicatorSize,
          pageHeight - pagePadding[2],
        ],
      ],
      // 右下
      [
        [
          pageWidth - pagePadding[1],
          pageHeight - pagePadding[2] + pagePaddingIndicatorSize,
        ],
        [pageWidth - pagePadding[1], pageHeight - pagePadding[2]],
        [
          pageWidth - pagePadding[1] + pagePaddingIndicatorSize,
          pageHeight - pagePadding[2],
        ],
      ],
    ];
    list.forEach((item) => {
      item.forEach((point, index) => {
        if (index === 0) {
          ctx.beginPath();
          ctx.moveTo(...point);
        } else {
          ctx.lineTo(...point);
        }
        if (index >= item.length - 1) {
          ctx.stroke();
        }
      });
    });
    ctx.restore();
  }

  public destroy() {
    this.canvasDOM.remove();
  }
}
