export function timeStampToDateString(v: string) {
    const parts = v.split(':');
    return `2017-01-01 ${parts[0]?.length < 2 ? '0' + parts[0] : parts[0]}:${parts[1]?.length < 2 ? '0' + parts[1] : parts[1]}:${parts[2]?.length < 2 ? '0' + parts[2] : parts[2]}`;
}

export function timeStampStringToSeconds(timeStr: string) {
    const parts = timeStr.split(/\s+/);
    const timestampString = parts.length < 2 ? parts[0] : parts[1];
    const timeParts = timestampString.split(':');
    return parseInt(timeParts[0]) * 3600 + parseInt(timeParts[1]) * 60 + parseInt(timeParts[2]);
}
