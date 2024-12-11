export function supportsPictureInPictureApi() {

  const userAgent = navigator.userAgent;

  const firefox = userAgent.match(/Firefox\/(\d+)/);
  if(firefox) {
    return false;
  }

  return document.pictureInPictureEnabled || 'requestPictureInPicture' in HTMLVideoElement.prototype;
}
