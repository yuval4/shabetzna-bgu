export type ShiftAbTestConstraint = {
    userId: string;
    userName: string;
    type: "CANNOT" | "PREFER_NOT" | "PREFER" | "MUST";
    date: string;
    shiftType: "FULL_DAY" | "DAY" | "NOON" | "NIGHT";
};

export type ShiftAbTestMember = {
    id: string;
    name: string;
    isAvailable: boolean;
};

export type AllocateShiftType = "FULL_DAY" | "PARTIAL_DAY" | "DAY_NOON_NIGHT";

export interface ShiftAbTestScenario {
    id: string;
    title: string;
    description: string;
    missionName: string;
    teamName: string;
    teamMembers: ShiftAbTestMember[];
    constraints: ShiftAbTestConstraint[];
    shiftsDates: string[];
    shiftsType: AllocateShiftType;
    usersPerShift: number;
}

export const shiftAbTestScenarios: ShiftAbTestScenario[] = [
    {
        id: "scenario-a",
        title: "משמרות רגילות עם אילוצים בסיסיים",
        description:
            "יצירת שבוע משמרות רגיל עם מספר אילוצים אישיים פשוטים ושימוש במספר מצומצם של עובדים.",
        missionName: "משימה 1",
        teamName: "צוות אזור מרכז",
        teamMembers: [
            { id: "u1", name: "אילן", isAvailable: true },
            { id: "u2", name: "מאיה", isAvailable: true },
            { id: "u3", name: "רוני", isAvailable: true },
        ],
        constraints: [
            {
                userId: "u1",
                userName: "אילן",
                type: "MUST",
                date: "2026-06-01",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u2",
                userName: "מאיה",
                type: "CANNOT",
                date: "2026-06-03",
                shiftType: "FULL_DAY",
            },
        ],
        shiftsDates: [
            "2026-06-01",
            "2026-06-02",
            "2026-06-03",
            "2026-06-04",
            "2026-06-05",
        ],
        shiftsType: "FULL_DAY",
        usersPerShift: 1,
    },
    {
        id: "scenario-b",
        title: "משמרות חצי-יום עם אילוצים מרובי משתמשים",
        description:
            "יצירת שבוע של משמרות חצי יום, עם אילוצים למספר עובדים ובקשות העדפה שמדמות מצב עבודה קשה יותר.",
        missionName: "משימה 2",
        teamName: "צוות ספקטור",
        teamMembers: [
            { id: "u4", name: "דנה", isAvailable: true },
            { id: "u5", name: "אמיר", isAvailable: true },
            { id: "u6", name: "נועם", isAvailable: true },
            { id: "u7", name: "הילה", isAvailable: false },
        ],
        constraints: [
            {
                userId: "u4",
                userName: "דנה",
                type: "PREFER_NOT",
                date: "2026-06-08",
                shiftType: "DAY",
            },
            {
                userId: "u5",
                userName: "אמיר",
                type: "MUST",
                date: "2026-06-09",
                shiftType: "NOON",
            },
            {
                userId: "u6",
                userName: "נועם",
                type: "CANNOT",
                date: "2026-06-10",
                shiftType: "NIGHT",
            },
        ],
        shiftsDates: [
            "2026-06-08",
            "2026-06-09",
            "2026-06-10",
            "2026-06-11",
            "2026-06-12",
        ],
        shiftsType: "PARTIAL_DAY",
        usersPerShift: 2,
    },
    {
        id: "scenario-c",
        title: "תרחיש מורחב - צוות גדול, כל האילוצים ל-FULL_DAY",
        description: "תרחיש עם צוות גדול (7 אנשים) ואילוצים מסוגים שונים, כולם על משמרות 24 שעות.",
        missionName: "משימה 3",
        teamName: "צוות בדיקה גדול",
        teamMembers: [
            { id: "u8", name: "אורי", isAvailable: true },
            { id: "u9", name: "מיכה", isAvailable: true },
            { id: "u10", name: "שרה", isAvailable: true },
            { id: "u11", name: "גלעד", isAvailable: true },
            { id: "u12", name: "ינון", isAvailable: true },
            { id: "u13", name: "תהלה", isAvailable: true },
            { id: "u14", name: "עידו", isAvailable: true },
        ],
        constraints: [
            {
                userId: "u8",
                userName: "אורי",
                type: "MUST",
                date: "2026-06-15",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u9",
                userName: "מיכה",
                type: "CANNOT",
                date: "2026-06-16",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u10",
                userName: "שרה",
                type: "PREFER",
                date: "2026-06-17",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u11",
                userName: "גלעד",
                type: "PREFER_NOT",
                date: "2026-06-18",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u12",
                userName: "ינון",
                type: "MUST",
                date: "2026-06-19",
                shiftType: "FULL_DAY",
            },
        ],
        shiftsDates: [
            "2026-06-15",
            "2026-06-16",
            "2026-06-17",
            "2026-06-18",
            "2026-06-19",
            "2026-06-20",
            "2026-06-21",
        ],
        shiftsType: "FULL_DAY",
        usersPerShift: 1,
    },
];
