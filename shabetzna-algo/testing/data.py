raw_input = """
{
  "userIds": ["1", "2", "3", "4", "5", "6", "7"],

  "shiftsDates": [
    "2026-08-01",
    "2026-08-02",
    "2026-08-03",
    "2026-08-04",
    "2026-08-05",
    "2026-08-06",
    "2026-08-07"
  ],

  "shiftsType": "FULL_DAY",

  "constraints": [
    {
      "userId": "1",
      "type": "CANNOT",
      "date": "2026-08-01"
    },
    {
      "userId": "1",
      "type": "PREFER",
      "date": "2026-08-05"
    },

    {
      "userId": "2",
      "type": "PREFER_NOT",
      "date": "2026-08-02"
    },
    {
      "userId": "2",
      "type": "MUST",
      "date": "2026-08-06"
    },

    {
      "userId": "3",
      "type": "CANNOT",
      "date": "2026-08-03"
    },
    {
      "userId": "3",
      "type": "PREFER",
      "date": "2026-08-07"
    },

    {
      "userId": "4",
      "type": "PREFER_NOT",
      "date": "2026-08-04"
    },
    {
      "userId": "4",
      "type": "MUST",
      "date": "2026-08-01"
    },

    {
      "userId": "5",
      "type": "CANNOT",
      "date": "2026-08-05"
    },
    {
      "userId": "5",
      "type": "PREFER",
      "date": "2026-08-02"
    },

    {
      "userId": "6",
      "type": "PREFER_NOT",
      "date": "2026-08-06"
    },
    {
      "userId": "6",
      "type": "MUST",
      "date": "2026-08-03"
    },

    {
      "userId": "7",
      "type": "CANNOT",
      "date": "2026-08-07"
    },
    {
      "userId": "7",
      "type": "PREFER",
      "date": "2026-08-04"
    }
  ],

  "usersPerShift": 2,

  "prevShifts": [

    {
      "id": 100,
      "date": "2026-07-01",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 12.0
    },
    {
      "id": 101,
      "date": "2026-07-02",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 15.5
    },
    {
      "id": 102,
      "date": "2026-07-03",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 18.0
    },
    {
      "id": 103,
      "date": "2026-07-04",
      "assignedUserId": "4",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 14.5
    },
    {
      "id": 104,
      "date": "2026-07-05",
      "assignedUserId": "5",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 17.0
    },
    {
      "id": 105,
      "date": "2026-07-06",
      "assignedUserId": "6",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 20.0
    },
    {
      "id": 106,
      "date": "2026-07-07",
      "assignedUserId": "7",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 13.5
    },

    {
      "id": 107,
      "date": "2026-07-08",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 25.0
    },
    {
      "id": 108,
      "date": "2026-07-09",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 28.5
    },
    {
      "id": 109,
      "date": "2026-07-10",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 31.0
    },
    {
      "id": 110,
      "date": "2026-07-11",
      "assignedUserId": "4",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 27.0
    },
    {
      "id": 111,
      "date": "2026-07-12",
      "assignedUserId": "5",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 29.5
    },
    {
      "id": 112,
      "date": "2026-07-13",
      "assignedUserId": "6",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 32.5
    },
    {
      "id": 113,
      "date": "2026-07-14",
      "assignedUserId": "7",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 24.0
    },

    {
      "id": 114,
      "date": "2026-07-15",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 36.5
    },
    {
      "id": 115,
      "date": "2026-07-16",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 39.0
    },
    {
      "id": 116,
      "date": "2026-07-17",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 42.5
    },
    {
      "id": 117,
      "date": "2026-07-18",
      "assignedUserId": "4",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 38.0
    },
    {
      "id": 118,
      "date": "2026-07-19",
      "assignedUserId": "5",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 41.0
    },
    {
      "id": 119,
      "date": "2026-07-20",
      "assignedUserId": "1",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 44.0
    },
    {
      "id": 120,
      "date": "2026-07-21",
      "assignedUserId": "7",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 35.0
    },

    {
      "id": 121,
      "date": "2026-07-22",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 48.0
    },
    {
      "id": 122,
      "date": "2026-07-23",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 51.5
    },
    {
      "id": 123,
      "date": "2026-07-24",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 54.0
    },
    {
      "id": 124,
      "date": "2026-07-25",
      "assignedUserId": "4",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 50.0
    },
    {
      "id": 125,
      "date": "2026-07-26",
      "assignedUserId": "5",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 52.5
    },
    {
      "id": 126,
      "date": "2026-07-27",
      "assignedUserId": "6",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 55.5
    },
    {
      "id": 127,
      "date": "2026-07-28",
      "assignedUserId": "7",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 47.0
    },

    {
      "id": 128,
      "date": "2026-07-29",
      "assignedUserId": "1",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 71.0
    },
    {
      "id": 129,
      "date": "2026-07-30",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 64.5
    },
    {
      "id": 130,
      "date": "2026-07-31",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 67.0
    },
    {
      "id": 131,
      "date": "2026-07-31",
      "assignedUserId": "4",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 63.0
    },
    {
      "id": 132,
      "date": "2026-07-31",
      "assignedUserId": "5",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 65.5
    },
    {
      "id": 133,
      "date": "2026-07-31",
      "assignedUserId": "6",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 69.0
    },
    {
      "id": 134,
      "date": "2026-07-31",
      "assignedUserId": "7",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 60.0
    },

    {
      "id": 135,
      "date": "2026-07-31",
      "assignedUserId": "1",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 82.5
    },
    {
      "id": 136,
      "date": "2026-07-31",
      "assignedUserId": "2",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 75.0
    },
    {
      "id": 137,
      "date": "2026-07-31",
      "assignedUserId": "3",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 78.0
    },
    {
      "id": 138,
      "date": "2026-07-31",
      "assignedUserId": "4",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 74.0
    },
    {
      "id": 139,
      "date": "2026-07-31",
      "assignedUserId": "5",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 76.5
    },
    {
      "id": 140,
      "date": "2026-07-31",
      "assignedUserId": "6",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 80.0
    },
    {
      "id": 141,
      "date": "2026-07-31",
      "assignedUserId": "7",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 71.0
    },
    {
      "id": 142,
      "date": "2026-07-31",
      "assignedUserId": "1",
      "shiftType": "FULL_DAY",
      "isReadiness": true,
      "weight": 20.4
    }
  ]
}
"""