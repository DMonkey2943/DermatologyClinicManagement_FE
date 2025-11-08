export function getDateArrayForPeriod(periodType: "day" | "week" | "month" | "year", startDate: Date) {
    const dates: Date[] = []

    switch (periodType) {
        case "day": {
            // 7 ngày (từ startDate trở về trước)
            for (let i = 0; i < 7; i++) {
                const date = new Date(startDate)
                date.setDate(date.getDate() - i)
                dates.unshift(date)
            }
            break
        }

        case "week": {
            // 5 tuần (từ startDate trở về trước, mỗi tuần cách nhau 7 ngày)
            for (let i = 0; i < 5; i++) {
                const date = new Date(startDate)
                date.setDate(date.getDate() - i * 7)
                dates.unshift(date)
            }
            break
        }

        case "month": {
            // 6 tháng (từ startDate trở về trước, giữ nguyên ngày trong tháng)
            for (let i = 0; i < 6; i++) {
                const date = new Date(startDate.getFullYear(), startDate.getMonth() - i, startDate.getDate())
                dates.unshift(date)
            }
            break
        }

        case "year": {
            // 5 năm (từ startDate trở về trước, giữ nguyên tháng và ngày)
            for (let i = 0; i < 5; i++) {
                const date = new Date(startDate.getFullYear() - i, startDate.getMonth(), startDate.getDate())
                dates.unshift(date)
            }
            break
        }
    }

    return dates
}

export function formatDateForLabel(date: Date, periodType: "day" | "week" | "month" | "year"): string {
    switch (periodType) {
        case "day": {
            return new Intl.DateTimeFormat("vi-VN", {
                month: "2-digit",
                day: "2-digit",
            }).format(date)
        }

        case "week": {
            const weekNum = getWeekNumber(date)
            const year = date.getFullYear()
            return `Tuần ${weekNum}/${year}`
        }

        case "month": {
            return new Intl.DateTimeFormat("vi-VN", {
                month: "short",
                year: "numeric",
            }).format(date)
        }

        case "year": {
            return date.getFullYear().toString()
        }

        default:
            return ""
    }
}

function getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
}

export function formatDateToISO(date: Date): string {
    return date.toISOString().split("T")[0]
}






// // Utilities cho date range logic
// export function getDateRange(
//     periodType: "day" | "week" | "month" | "year" | null,
//     selectedDate: Date,
// ): { start: Date; end: Date } {
//     const date = selectedDate || new Date()
//     let start: Date, end: Date

//     switch (periodType) {
//         case "day":
//             start = new Date(date)
//             end = new Date(date)
//             break

//         case "week":
//             // Thứ hai của tuần
//             const day = date.getDay()
//             const diff = date.getDate() - day + (day === 0 ? -6 : 1)
//             start = new Date(date.setDate(diff))
//             end = new Date(start)
//             end.setDate(end.getDate() + 6)
//             break

//         case "month":
//             start = new Date(date.getFullYear(), date.getMonth(), 1)
//             end = new Date(date.getFullYear(), date.getMonth() + 1, 0)
//             break

//         case "year":
//             start = new Date(date.getFullYear(), 0, 1)
//             end = new Date(date.getFullYear(), 11, 31)
//             break

//         default:
//             start = new Date(date)
//             end = new Date(date)
//     }

//     return { start, end }
// }

// export function formatDateString(date: Date): string {
//     return date.toISOString().split("T")[0]
// }

// export function formatDateDisplay(date: Date): string {
//     return new Intl.DateTimeFormat("vi-VN", {
//         year: "numeric",
//         month: "2-digit",
//         day: "2-digit",
//     }).format(date)
// }
