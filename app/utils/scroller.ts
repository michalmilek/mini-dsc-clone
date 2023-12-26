import { scroller } from "react-scroll";

export const scrollToElement = (elementName: string) => {
  scroller.scrollTo(elementName, {
    duration: 800,
    delay: 0,
    smooth: "easeInOutQuart",
  });
};
