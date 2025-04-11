export function checkClosed(endDateStr: string): boolean {
    const endDate = new Date(endDateStr);
    endDate.setHours(23, 59, 59, 999);

    const now = new Date();

    return endDate < now;
}
