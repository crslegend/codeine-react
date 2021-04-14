export const calculateDateInterval = (timestamp) => {
  const dateBefore = new Date(timestamp);
  const dateNow = new Date();

  let seconds = Math.floor((dateNow - dateBefore) / 1000);
  let minutes = Math.floor(seconds / 60);
  let hours = Math.floor(minutes / 60);
  let days = Math.floor(hours / 24);

  hours = hours - days * 24;
  minutes = minutes - days * 24 * 60 - hours * 60;
  seconds = seconds - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60;

  if (days === 0) {
    if (hours === 0) {
      if (minutes === 0) {
        return `${seconds} seconds ago`;
      }

      if (minutes === 1) {
        return `${minutes} minute ago`;
      }
      return `${minutes} minutes ago`;
    }

    if (hours === 1) {
      return `${hours} hour ago`;
    }
    return `${hours} hours ago`;
  }

  if (days === 1) {
    return `${days} day ago`;
  }
  return `${days} days ago`;
};

export const downloadJSON = (jsonObj) => {
  let copy = {
    ...jsonObj,
    label: jsonObj.label + " (copy)",
  };

  return (
    "data: text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(copy))
  );
};

export const checkTimeDiff = (start, end) => {
  const startArr = start.split(":");
  const endArr = end.split(":");
  let startSeconds;
  let endSeconds;

  startSeconds =
    parseInt(startArr[0]) * 60 * 60 +
    parseInt(startArr[1]) * 60 +
    parseInt(startArr[2]);

  endSeconds =
    parseInt(endArr[0]) * 60 * 60 +
    parseInt(endArr[1]) * 60 +
    parseInt(endArr[2]);

  if (endSeconds - startSeconds <= 0) {
    return false;
  }
  return true;
};

export const formatToVideoTimeFormat = (seconds) => {
  const pad = (string) => {
    return ("0" + string).slice(-2);
  };

  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = pad(date.getUTCSeconds());

  return `${pad(hh)}:${pad(mm)}:${ss}`;
};
