export function getDeviceId(d) {
    return 'id' in d ? d.id : d.name
}