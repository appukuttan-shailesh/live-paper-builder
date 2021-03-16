export function showNotification(
  enqueueSnackbar,
  closeSnackbar,
  message,
  type = "default"
) {
  // type: default, success, error, warning, info
  const key = enqueueSnackbar(message, {
    variant: type,
    anchorOrigin: {
      vertical: "bottom",
      horizontal: "right",
    },
    onClick: () => {
      closeSnackbar(key);
    },
  });
}

export function replaceEmptyStringsWithNull(param) {
  if (param === null) {
    return param;
  } else if (typeof param === "string") {
    return param === "" ? null : param;
  } else if (Array.isArray(param)) {
    return param.map((element) => replaceEmptyStringsWithNull(element));
  } else if (typeof param === "object") {
    Object.entries(param).map(function ([key, val]) {
      return (param[key] = replaceEmptyStringsWithNull(val));
    });
    return param;
  } else {
    // e.g. number, boolean
    return param;
  }
}

export function replaceNullWithEmptyStrings(param) {
  if (param === null) {
    // Note: null is also object, but explictly comared before testing for object below
    return "";
  } else if (typeof param === "string") {
    return param;
  } else if (Array.isArray(param)) {
    return param.map((element) => replaceNullWithEmptyStrings(element));
  } else if (typeof param === "object") {
    Object.entries(param).map(function ([key, val]) {
      return (param[key] = replaceNullWithEmptyStrings(val));
    });
    return param;
  } else {
    // e.g. number, boolean
    return param;
  }
}

export function compareArrayoOfObjectsByOrder(a, b) {
  if (a.order < b.order) {
    return -1;
  } else {
    return 1;
  }
}

export function formatAuthors(authors) {
  if (authors) {
    return authors
      .map((author) => author.given_name + " " + author.family_name)
      .join(", ");
  } else {
    return "";
  }
}

export function formatTimeStampToLongString(ISOtimestamp) {
  if (ISOtimestamp) {
    const d = new Date(ISOtimestamp);
    return d.toUTCString();
  } else {
    return "";
  }
}

export const flattenNestedObject = (obj) => {
  const flattened = {};
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === "object" && obj[key] !== null) {
      Object.assign(flattened, flattenNestedObject(obj[key]));
    } else {
      flattened[key] = obj[key];
    }
  });
  return flattened;
};
