export type stylesType = {
  [key: string]: React.CSSProperties;
};
export type valueType = {
    // [key: string]: string
    // header_height | footer_height: string
    [key in "header_height" | "footer_height"]: string
}
export type tableInputType = {
  title: string, 
  dataSourceUrl: string,
  columns_to_display: string[]
}
export type useTableType = {
  dataSourceUrl: string,
  columns_to_display: string[],
}

