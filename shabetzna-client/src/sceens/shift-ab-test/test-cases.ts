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
    testType: "algorithm" | "manual";
}

export const shiftAbTestScenarios: ShiftAbTestScenario[] = [
    // Algorithm test scenarios
    {
        id: "scenario-a",
        title: "תרחיש בסיסי (אלגוריתם) - משמרות רגילות עם אילוצים בסיסיים",
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
            {
                userId: "u3",
                userName: "רוני",
                type: "CANNOT",
                date: "2026-06-04",
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
        testType: "algorithm",
    },
    
    // Manual test scenarios - different but similar difficulty
    {
        id: "scenario-b",
        title: "תרחיש בסיסי (בדיקה ידנית) - משמרות רגילות עם אילוצים בסיסיים",
        description:
            "יצירת שבוע משמרות רגיל עם מספר אילוצים אישיים פשוטים ושימוש במספר מצומצם של עובדים (גרסה שונה לבדיקה ידנית).",
        missionName: "משימה 2",
        teamName: "צוות אזור דרום",
        teamMembers: [
            { id: "u4", name: "דניאל", isAvailable: true },
            { id: "u5", name: "עמית", isAvailable: true },
            { id: "u6", name: "ליהי", isAvailable: true },
        ],
        constraints: [
            {
                userId: "u4",
                userName: "דניאל",
                type: "CANNOT",
                date: "2026-07-01",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u5",
                userName: "עמית",
                type: "MUST",
                date: "2026-07-04",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u6",
                userName: "ליהי",
                type: "CANNOT",
                date: "2026-07-05",
                shiftType: "FULL_DAY",
            },
        ],
        shiftsDates: [
            "2026-07-01",
            "2026-07-02",
            "2026-07-03",
            "2026-07-04",
            "2026-07-05",
        ],
        shiftsType: "FULL_DAY",
        usersPerShift: 1,
        testType: "manual",
    },
    {
        id: "scenario-c",
        title: "תרחיש מורחב (אלגוריתם) - צוות גדול עם אילוצים מגוונים",
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
                type: "MUST",
                date: "2026-06-17",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u11",
                userName: "גלעד",
                type: "CANNOT",
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
        testType: "algorithm",
    },
    {
        id: "scenario-d",
        title: "תרחיש מורחב (בדיקה ידנית) - צוות גדול עם אילוצים מגוונים",
        description: "תרחיש עם צוות גדול (7 אנשים) ואילוצים מסוגים שונים, כולם על משמרות 24 שעות (גרסה שונה לבדיקה ידנית).",
        missionName: "משימה 4",
        teamName: "צוות בדיקה גדול 2",
        teamMembers: [
            { id: "u15", name: "גיא", isAvailable: true },
            { id: "u16", name: "שמולי", isAvailable: true },
            { id: "u17", name: "ניקי", isAvailable: true },
            { id: "u18", name: "אורן", isAvailable: true },
            { id: "u19", name: "רמי", isAvailable: true },
            { id: "u20", name: "מתן", isAvailable: true },
            { id: "u21", name: "רוית", isAvailable: true },
        ],
        constraints: [
            {
                userId: "u15",
                userName: "גיא",
                type: "CANNOT",
                date: "2026-08-10",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u16",
                userName: "שמולי",
                type: "MUST",
                date: "2026-08-11",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u17",
                userName: "ניקי",
                type: "CANNOT",
                date: "2026-08-12",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u18",
                userName: "אורן",
                type: "MUST",
                date: "2026-08-13",
                shiftType: "FULL_DAY",
            },
            {
                userId: "u19",
                userName: "רמי",
                type: "CANNOT",
                date: "2026-08-14",
                shiftType: "FULL_DAY",
            },
        ],
        shiftsDates: [
            "2026-08-10",
            "2026-08-11",
            "2026-08-12",
            "2026-08-13",
            "2026-08-14",
            "2026-08-15",
            "2026-08-16",
        ],
        shiftsType: "FULL_DAY",
        usersPerShift: 1,
        testType: "manual",
    },
];
