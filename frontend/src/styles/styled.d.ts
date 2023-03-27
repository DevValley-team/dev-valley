import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    backgroundColor: string;
    inputColor: string;
    inputFocusColor: string;
    btnColor: string;
    btnFocusColor: string;
  }
}
