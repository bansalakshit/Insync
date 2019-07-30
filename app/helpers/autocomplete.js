export function matchStateToTerm(state, value) {
    return (
        state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
}

export function matchStateToTermWithHeaders(state, value) {
    return (
        state.header ||
        state.name.toLowerCase().indexOf(value.toLowerCase()) !== -1
    )
}

export function sortStates(a, b, value) {
    const aLower = a.name.toLowerCase()
    const bLower = b.name.toLowerCase()
    const valueLower = value.toLowerCase()
    const queryPosA = aLower.indexOf(valueLower)
    const queryPosB = bLower.indexOf(valueLower)
    if (queryPosA !== queryPosB) {
        return queryPosA - queryPosB
    }
    return aLower < bLower ? -1 : 1
}