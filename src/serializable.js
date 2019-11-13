export function isTagSerializable(value) {
  if (!value) {
    return true;
  }
  const type = typeof value;
  if (type === "function") {
    return false;
  }
  if (type === "object") {
    if (Array.isArray(value)) {
      for (let i = 0; i < value.length; i++) {
        if (!isTagSerializable(value[i])) {
          return false;
        }
      }
      return true;
    }
    return false;
  }
  return true;
}

export function addTagMetaStringify(tags, tag) {
  if (tags.$meta && tags.$meta.stringify) {
    tags.$meta.stringify.push(tag);
  } else {
    tags.$meta = {
      stringify: [tag]
    };
  }
}
