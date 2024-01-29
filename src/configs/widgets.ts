const widgets: Array<{
  name: string;
  thumb: string;
  defaultState: Record<string, string>;
}> = [
  {
    name: "button",
    thumb: "https://placekitten.com/200/200",
    defaultState: {
      btnText: "Button",
      alertMessage: "Alert",
    },
  },
  {
    name: "paragraph",
    thumb: "https://placekitten.com/200/200",
    defaultState: {
      text: "Paragraph",
    },
  },
];

export default widgets;
