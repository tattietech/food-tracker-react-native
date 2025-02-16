export class TextData {
    resultText: string
  }

const dateRegex = /\b(0[1-9]|[12][0-9]|3[01])[-/. ](0[1-9]|1[0-2]|JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC|January|February|March|April|May|June|July|August|September|October|November|December)([-/. ](\d{2}|\d{4}))?\b/i;

const monthMap = {
    JAN: 0, JANUARY: 0,
    FEB: 1, FEBRUARY: 1,
    MAR: 2, MARCH: 2,
    APR: 3, APRIL: 3,
    MAY: 4,
    JUNE: 5, JUN: 5,
    JUL: 6, JULY: 6,
    AUG: 7, AUGUST: 7,
    SEP: 8, SEPTEMBER: 8,
    OCT: 9, OCTOBER: 9,
    NOV: 10, NOVEMBER: 10,
    DEC: 11, DECEMBER: 11
};

export const parseDateFromScan = (input: string): Date | null => {
    const match = input.match(dateRegex);

    if (!match || (!match[1] && !match[2])) return null;

    let day = 0;
    let month = 0;
    let year = 0;

    day = parseInt(match[1]);
    if (isNaN(day)) return null;

    let intMonth = parseInt(match[2]);
    if (isNaN(intMonth)) {
        month = monthMap[match[2].toUpperCase() as keyof typeof monthMap];
    }
    else {
        month = intMonth - 1;
    }

    if (match[3]) {
        // removes any non number characters
        let y = match[3].replace(/\D/g, '');

        // prepends 20 before a 2 digit date
        if (y.length == 2) {
            y = "20" + y;
        }

        year = parseInt(y);
    }
    else {
        year = new Date().getFullYear();
    }

    return new Date(year, month, day);
};

export function getDateColour(date : Date): string {
    let currentDate = new Date();
    let inputDate = new Date(date);

    if (inputDate <= currentDate) return "red"

    if (inputDate <= addDays(currentDate, 3)) return "amber"
    
    return "green";
}

export function addDays (date: Date, days: number): Date {
    if (!days) return date;
    date.setDate(date.getDate() + days);
    return date;
 };