export interface EmrEditorOptionsI {
  pageWidth: number;
  pageHeight: number;
  pagePadding: [number, number, number, number];
  pageMargin: number;
  pagePaddingIndicatorSize: number;
  pagePaddingIndicatorColor: string;
  fontSize: number;
  fontFamily: string;
  color: string
  lineHeight: number;
}

interface IElementStyle {
  fontfamily?: string;
  size?: number;
  width?: number;
  height?: number;
  bold?: boolean;
  color?: string;
  highlight?: string;
  italic?: boolean;
  underline?: boolean;
  strikeout?: boolean;
}

export type ElementI = IElementStyle;
