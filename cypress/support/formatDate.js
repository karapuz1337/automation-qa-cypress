// Helper function to format date as DD.MM.YYYY (u can change separator)
export const formatDateUI = (separator=".") => {
    const today = new Date()
    const pad2 = (n) => String(n).padStart(2, '0')

    return `${pad2(today.getDate())}${separator}${pad2(today.getMonth() + 1)}${separator}${today.getFullYear()}`
}

// Helper function to format date as YYYY-MM-DD (u can change separator)
export const formatDateAPI = (separator="-") => {
    const today = new Date()
    const pad2 = (n) => String(n).padStart(2, '0')

    return `${pad2(today.getFullYear())}${separator}${pad2(today.getMonth() + 1)}${separator}${today.getDate()}`
}