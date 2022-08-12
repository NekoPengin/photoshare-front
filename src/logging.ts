const show = (type: string, title: string, text: string) => {
  // eslint-disable-line no-console
  console.log(`[${type}] ${title} - ${text}`); // eslint-disable-line no-console
};

const error = (type: string, title: string, text: string) => {
  // eslint-disable-line no-console
  console.error(`[${type}] ${title} - ${text}`); // eslint-disable-line no-console
};

const logging = {
  install() {
    console.log("logging plugin");
  },
  error: (title: string, text: string) => {
    if (text == null) text = "";
    if (typeof text === "object") {
      error("error", title, JSON.stringify(text));
    } else {
      error("error", title, text);
    }
  },
  success: (title: string, text: string) => {
    if (text == null) text = "";
    show("success", title, text);
  },

  info: (title: string, text: string) => {
    if (text == null) text = "";

    if (typeof text === "object") {
      show("info", title, JSON.stringify(text));
    } else {
      show("info", title, text);
    }
  },
  debug: (title: string, text: string) => {
    if (text == null) text = "";

    if (typeof text === "object") {
      show("debug", title, JSON.stringify(text, null, 2));
    } else {
      show("debug", title, text);
    }
  },
  debugObj: (title: string, obj: unknown) => {
    if (typeof obj !== "object" || obj === null) {
      return "";
    }

    show("debug", title, JSON.stringify(obj, null, 2));
  },
};

export default logging;
