import math
import json
from datetime import datetime, timedelta
from enum import Enum
import holidays

il_holidays = holidays.Israel()


class Shift:
    def __init__(self, s_id: str, shift_date: datetime, shift_type: str, has_after: bool, is_holiday: bool = False,
                 is_readiness: bool = False, has_noon: bool = False):
        self.id = s_id
        self.shift_date = shift_date
        self.shift_type = shift_type
        self.is_holiday = is_holiday
        self.has_after = has_after
        self.is_readiness = is_readiness
        self.has_noon = has_noon

        self.start_time, self.end_time = self._determine_hours()

    def _determine_hours(self):
        if not isinstance(self.shift_date, datetime):
            dt = datetime.combine(self.shift_date, datetime.min.time())
        else:
            dt = self.shift_date

        base_date = dt.replace(hour=0, minute=0, second=0, microsecond=0)

        if self.shift_type == 'FULL_DAY':
            start = base_date.replace(hour=8)
            end = start + timedelta(hours=24)

        elif self.shift_type == 'DAY':
            start = base_date.replace(hour=8)
            end = start + timedelta(hours=9 if self.has_noon else 10)

        elif self.shift_type == 'NOON':
            start = base_date.replace(hour=17)
            end = start + timedelta(hours=5)

        elif self.shift_type == 'NIGHT':
            if self.has_noon:
                start = base_date.replace(hour=22)
                end = start + timedelta(hours=10)
            else:
                start = base_date.replace(hour=18)
                end = start + timedelta(hours=14)
        else:
            start = dt
            end = dt + timedelta(hours=8)

        return start, end


def calculate_shift_weights(shifts: list[Shift]) -> list[tuple[str, float]]:
    results = []

    for shift in shifts:
        L = 0 if shift.is_readiness else 1
        total_score = 0.0

        current_time = shift.start_time
        while current_time < shift.end_time:
            hour = current_time.hour
            day = current_time.weekday()

            if 8 <= hour < 18:
                T = 1
            elif hour >= 22 or hour < 6:
                T = 3
            else:
                T = 2

            is_weekend = False
            if (day == 3 and hour >= 18) or (day in [4, 5]) or (day == 6 and hour < 8):
                is_weekend = True

            if shift.is_holiday:
                F = 1.2 if L == 0 else 3.2
            elif is_weekend:
                F = 0.7 if L == 0 else 1.9
            else:
                F = 0.0 if L == 0 else 0.2

            hourly_weight = 0.8 + 0.5 * (T - 1) + F + 0.3 * math.floor((T * L) / 3)
            total_score += hourly_weight
            current_time += timedelta(hours=1)

        if shift.has_after:
            if shift.shift_type in ['NIGHT', 'FULL_DAY']:
                after_factor = 0.6 + 0.005 * (total_score - 20)
            else:
                after_factor = 1.0 - (0.008 * total_score)
            final_weight = total_score * after_factor
        else:
            final_weight = total_score

        results.append((shift.id, round(final_weight, 2)))

    return results


def calculate_allocation_difficulties(
    shifts_dates: list[str],
    allocate_type: str,
    is_readiness: bool = False,
    override_holiday: bool = None
) -> list[dict]:
    shifts_to_process = []

    if allocate_type == 'FULL_DAY':
        sub_shifts = [("FULL_DAY", False)]
    elif allocate_type == 'DAY_NIGHT':
        sub_shifts = [("DAY", False), ("NIGHT", False)]
    elif allocate_type == 'DAY_NOON_NIGHT':
        sub_shifts = [("DAY", True), ("NOON", False), ("NIGHT", True)]
    else:
        raise ValueError(f"Unsupported allocate_type: {allocate_type}")

    for date_str in shifts_dates:
        dt = datetime.strptime(date_str, "%Y-%m-%d")
        day_of_week = dt.weekday()

        # Check today and tomorrow for holiday coverage
        is_today_holiday = dt in il_holidays
        is_tomorrow_holiday = (dt + timedelta(days=1)) in il_holidays

        for s_type, has_noon in sub_shifts:
            # Determine if this specific shift qualifies as a holiday shift
            if override_holiday is not None:
                shift_is_holiday = override_holiday
            else:
                is_eve_holiday_shift = (
                    is_tomorrow_holiday and s_type in ['FULL_DAY', 'NIGHT']
                )
                shift_is_holiday = is_today_holiday or is_eve_holiday_shift

            has_after = (
                s_type in ['NIGHT', 'FULL_DAY']
                and day_of_week not in [3, 4]
            )

            s_id = f"{date_str}_{s_type}"

            shift = Shift(
                s_id=s_id,
                shift_date=dt,
                shift_type=s_type,
                is_holiday=shift_is_holiday,  # <-- Evaluated per shift type
                has_after=has_after,
                is_readiness=is_readiness,
                has_noon=has_noon
            )
            shifts_to_process.append(shift)

    weights_results = calculate_shift_weights(shifts_to_process)

    formatted_results = []
    for s_id, weight in weights_results:
        date_part, type_part = s_id.split('_', 1)
        formatted_results.append({
            "date": date_part,
            "shift_type": type_part,
            "calculated_weight": weight
        })

    return formatted_results