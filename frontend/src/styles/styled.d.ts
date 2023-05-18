import "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    textColor: string;
    backgroundColor: string;
    inputColor: string;
    inputFocusColor: string;
    btnColor: string;
    btnFocusColor: string;
    btnHoverColor: string;
    modalBackgroundColor: string;
    borderBottomColor: string;
  }
}
