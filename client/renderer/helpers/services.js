
export function handleResponse(response) {
    return response.text().then(text => {
        try {
            const data = text && JSON.parse(text)
            if (!response.ok) {
                const error = (data && data.message) || response.statusText
                return Promise.reject(error)
            }

            return data
        } catch(_err) {
            return Promise.reject(text)
        }
    })
}

export function formatTime(_seconds) {
    let prepend0 = (_val) => {
        return _val < 10 ? `0${_val}` : _val
    }
    let hours   = Math.floor(_seconds / 3600)
    let mins = Math.floor((_seconds - (hours * 3600)) / 60)
    let secs = Math.floor((_seconds - ((hours * 3600) + (mins * 60))))
    return `${prepend0(hours)}:${prepend0(mins)}:${prepend0(secs)}`
}