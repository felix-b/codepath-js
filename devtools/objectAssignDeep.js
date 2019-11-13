define(function (require) {

  function objectAssignDeep(target, sources) {
    if (!sources.length) {
      return target;
    }
    
    const source = sources.shift();
  
    if (isObject(target) && isObject(source)) {
      for (const key in source) {
        if (isObject(source[key])) {
          if (!target[key]) Object.assign(target, { [key]: {} });
          objectAssignDeep(target[key], [source[key]]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  
    return objectAssignDeep(target, sources);
  }

  function isObject(item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  }  
  return objectAssignDeep;

});
